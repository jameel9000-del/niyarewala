import { Hono } from "hono";

type Snapshot = {
  timestamp: string;
  gold999Price: number;
  gold995Price: number;
  silver999Price: number;
};

type Adjustment = { mode: "fixed" | "percentage"; value: number };

type MetalState = {
  apiStatus: {
    provider: "Metals.Dev";
    status: "Connected" | "Error";
    lastSuccessfulUpdate: string | null;
    nextScheduledUpdate: string;
    apiUsageCounter: string;
    errorMessage?: string;
  };
  schedule: "Every 60 minutes";
  timezone: "Asia/Kolkata";
  gold999Adjustment: Adjustment;
  gold995Adjustment: Adjustment;
  silver999Adjustment: Adjustment;
  manualPriceMode: boolean;
  manualPrices: { gold999: number; gold995: number; silver999: number };
  currentSnapshot: Snapshot | null;
  previousSnapshot: Snapshot | null;
};

type WorkerEnv = Env & {
  METAL_STATE_KV?: KVNamespace;
  METALS_DEV_API_KEY?: string;
  ADMIN_API_TOKEN?: string;
};

const app = new Hono<{ Bindings: WorkerEnv }>();
const STORAGE_KEY = "niyarewala-metal-prices-v1";
const METALS_API_URL = "https://api.metals.dev/v1/latest";
const INDIA_KOLKATA_TZ = "Asia/Kolkata";
const REFRESH_INTERVAL_MS = 3_600_000;
const FIXED_SCHEDULE = "Every 60 minutes" as const;

function getIndiaWallClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_KOLKATA_TZ, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(`${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`);
}

function getNextScheduledUpdate(now = new Date()) {
  const indiaNow = getIndiaWallClock(now);
  return new Date(indiaNow.getTime() + REFRESH_INTERVAL_MS);
}

function formatScheduleLabel(date: Date) {
  const hours = date.getHours();
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${date.getMinutes().toString().padStart(2, "0")} ${period}`;
}

function createInitialState(): MetalState {
  return {
    apiStatus: { provider: "Metals.Dev", status: "Error", lastSuccessfulUpdate: null, nextScheduledUpdate: formatScheduleLabel(getNextScheduledUpdate()), apiUsageCounter: "-" },
    schedule: FIXED_SCHEDULE,
    timezone: INDIA_KOLKATA_TZ,
    gold999Adjustment: { mode: "fixed", value: 0 }, gold995Adjustment: { mode: "fixed", value: 0 }, silver999Adjustment: { mode: "fixed", value: 0 },
    manualPriceMode: false,
    manualPrices: { gold999: 0, gold995: 0, silver999: 0 },
    currentSnapshot: null, previousSnapshot: null,
  };
}

function isAdmin(c: { req: { header(name: string): string | undefined }; env: WorkerEnv }) {
  const token = c.env.ADMIN_API_TOKEN;
  return Boolean(token && c.req.header("Authorization") === `Bearer ${token}`);
}

function isAdjustment(value: unknown): value is Adjustment {
  return Boolean(value && typeof value === "object" && ["fixed", "percentage"].includes((value as Adjustment).mode) && typeof (value as Adjustment).value === "number");
}

function validateSettings(body: unknown) {
  if (!body || typeof body !== "object") return false;
  const data = body as Record<string, unknown>;
  if (data.schedule !== undefined || data.timezone !== undefined) return false; // cron is intentionally fixed to protect the 100/month quota.
  for (const key of ["gold999Adjustment", "gold995Adjustment", "silver999Adjustment"]) if (data[key] !== undefined && !isAdjustment(data[key])) return false;
  if (data.manualPriceMode !== undefined && typeof data.manualPriceMode !== "boolean") return false;
  if (data.manualPrices !== undefined) {
    if (!data.manualPrices || typeof data.manualPrices !== "object") return false;
    for (const value of Object.values(data.manualPrices as Record<string, unknown>)) if (typeof value !== "number" || !Number.isFinite(value)) return false;
  }
  return true;
}

function toPricePerGram(value: number, unit: string) {
  switch (unit.toLowerCase()) {
    case "g": case "gram": case "grams": return value;
    case "kg": case "kilogram": case "kilograms": return value / 1000;
    case "toz": case "troy_oz": case "troy ounce": return value / 31.1034768;
    default: throw new Error(`Unsupported Metals.Dev unit: ${unit}`);
  }
}

function computeSnapshotFromApi(json: any): Snapshot {
  if (!json || json.status !== "success") throw new Error(json?.error_message || "Invalid Metals.Dev response.");
  const gold = json.metals?.gold;
  const silver = json.metals?.silver;
  if (typeof gold !== "number" || typeof silver !== "number") throw new Error("Metals.Dev response is missing gold or silver rates.");
  const unit = json.unit ?? "g";
  const goldPerGram = toPricePerGram(gold, unit);
  const silverPerGram = toPricePerGram(silver, unit);

  let timestampStr: string;
  if (typeof json.timestamp === "number") {
    timestampStr = new Date(json.timestamp * 1000).toISOString();
  } else if (typeof json.timestamp === "string") {
    timestampStr = json.timestamp;
  } else {
    timestampStr = new Date().toISOString();
  }

  return {
    timestamp: timestampStr,
    gold999Price: Math.round(goldPerGram * 10), // ₹ / 10 g
    gold995Price: Math.round(goldPerGram * 10 * 0.995), // ₹ / 10 g at 99.5% purity
    silver999Price: Math.round(silverPerGram * 1000), // ₹ / kg
  };
}

function applyAdjustment(price: number, adjustment: Adjustment) {
  return Math.round(adjustment.mode === "percentage" ? price * (1 + adjustment.value / 100) : price + adjustment.value);
}

function ratesFor(snapshot: Snapshot | null, state: MetalState, useManual = false) {
  if (!snapshot) return { gold999: null, gold995: null, silver999: null };
  if (useManual && state.manualPriceMode) return state.manualPrices;
  return {
    gold999: applyAdjustment(snapshot.gold999Price, state.gold999Adjustment),
    gold995: applyAdjustment(snapshot.gold995Price, state.gold995Adjustment),
    silver999: applyAdjustment(snapshot.silver999Price, state.silver999Adjustment),
  };
}

function changeFor(current: number | null, previous: number | null) {
  if (current === null || previous === null || previous === 0) return { difference: 0, percentage: 0, direction: "neutral" as const };
  const difference = current - previous;
  return difference === 0
    ? { difference: 0, percentage: 0, direction: "neutral" as const }
    : { difference: Math.round(Math.abs(difference)), percentage: Number(Math.abs((difference / previous) * 100).toFixed(2)), direction: difference > 0 ? "up" as const : "down" as const };
}

function formatSnapshotForResponse(state: MetalState) {
  const current = ratesFor(state.currentSnapshot, state, true);
  const previous = ratesFor(state.previousSnapshot, state);
  return {
    currentSnapshot: state.currentSnapshot, previousSnapshot: state.previousSnapshot,
    gold999Price: current.gold999, gold995Price: current.gold995, silver999Price: current.silver999,
    gold999Change: changeFor(current.gold999, previous.gold999), gold995Change: changeFor(current.gold995, previous.gold995), silver999Change: changeFor(current.silver999, previous.silver999),
    apiStatus: { ...state.apiStatus, nextScheduledUpdate: formatScheduleLabel(getNextScheduledUpdate()) },
    schedule: FIXED_SCHEDULE, timezone: INDIA_KOLKATA_TZ, nextScheduledUpdate: formatScheduleLabel(getNextScheduledUpdate()),
    lastSuccessfulUpdate: state.apiStatus.lastSuccessfulUpdate, manualOverride: state.manualPriceMode,
    adminAdjustments: { gold999Adjustment: state.gold999Adjustment, gold995Adjustment: state.gold995Adjustment, silver999Adjustment: state.silver999Adjustment },
    manualPrices: state.manualPrices,
    currentSavedRates: ratesFor(state.currentSnapshot, state), previousSavedRates: previous,
  };
}

async function readStorage(env: WorkerEnv): Promise<MetalState | null> {
  if (!env.METAL_STATE_KV) return null;
  const raw = await env.METAL_STATE_KV.get(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as MetalState; } catch { return null; }
}

async function writeStorage(env: WorkerEnv, data: MetalState) {
  if (!env.METAL_STATE_KV) throw new Error("METAL_STATE_KV binding is not configured.");
  await env.METAL_STATE_KV.put(STORAGE_KEY, JSON.stringify(data));
}

async function refreshSnapshot(env: WorkerEnv) {
  const stored = (await readStorage(env)) ?? createInitialState();
  if (!env.METALS_DEV_API_KEY) throw new Error("METALS_DEV_API_KEY secret is not configured.");
  try {
    const response = await fetch(`${METALS_API_URL}?api_key=${encodeURIComponent(env.METALS_DEV_API_KEY)}&currency=INR&unit=g`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Metals.Dev returned ${response.status}.`);
    const snapshot = computeSnapshotFromApi(await response.json());
    const refreshedAt = new Date().toISOString();
    const next: MetalState = {
      ...stored,
      apiStatus: { provider: "Metals.Dev", status: "Connected", lastSuccessfulUpdate: refreshedAt, nextScheduledUpdate: formatScheduleLabel(getNextScheduledUpdate()), apiUsageCounter: "-" },
      previousSnapshot: stored.currentSnapshot, currentSnapshot: snapshot,
    };
    await writeStorage(env, next);
    return next;
  } catch (error) {
    const failed: MetalState = { ...stored, apiStatus: { ...stored.apiStatus, status: "Error", nextScheduledUpdate: formatScheduleLabel(getNextScheduledUpdate()), errorMessage: error instanceof Error ? error.message : "Unable to fetch Metals.Dev." } };
    await writeStorage(env, failed);
    throw error;
  }
}

app.get("/api/metals", async (c) => {
  let state = (await readStorage(c.env)) ?? createInitialState();

  // Bootstrap the first snapshot automatically when KV is empty.
  if (!state.currentSnapshot && c.env.METALS_DEV_API_KEY) {
    try {
      state = await refreshSnapshot(c.env);
    } catch {
      // Keep returning the last known state shape even if provider refresh fails.
    }
  }

  return c.json(formatSnapshotForResponse(state), 200, { "Cache-Control": "public, max-age=60" });
});

app.post("/api/metals/settings", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  const body = await c.req.json();
  if (!validateSettings(body)) return c.json({ error: "Invalid settings payload. The refresh schedule is fixed at every 60 minutes (Asia/Kolkata)." }, 400);
  const state = (await readStorage(c.env)) ?? createInitialState();
  const data = body as Partial<MetalState>;
  const next: MetalState = {
    ...state,
    gold999Adjustment: data.gold999Adjustment ?? state.gold999Adjustment, gold995Adjustment: data.gold995Adjustment ?? state.gold995Adjustment, silver999Adjustment: data.silver999Adjustment ?? state.silver999Adjustment,
    manualPriceMode: data.manualPriceMode ?? state.manualPriceMode,
    manualPrices: { ...state.manualPrices, ...(data.manualPrices ?? {}) },
  };
  await writeStorage(c.env, next);
  return c.json(formatSnapshotForResponse(next));
});

app.post("/api/metals/refresh", async (c) => {
  if (!isAdmin(c)) return c.json({ error: "Unauthorized" }, 401);
  try { return c.json(formatSnapshotForResponse(await refreshSnapshot(c.env))); }
  catch (error) { return c.json({ error: error instanceof Error ? error.message : "Unable to refresh metal rates." }, 502); }
});

export async function scheduled(_controller: ScheduledController, env: WorkerEnv) {
  try { await refreshSnapshot(env); } catch { /* Keep the last successful snapshot when a scheduled request fails. */ }
}

export default { fetch: app.fetch, scheduled };
