import type {
  MetalAdjustment,
  MetalManualPrices,
  MetalPriceSettings,
} from "./metalsPrice";

export interface MetalServiceState extends MetalPriceSettings {
  gold999Price: number | null;
  gold995Price: number | null;
  silver999Price: number | null;
  platinum999Price: number | null;
  gold999Change: {
    difference: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
  gold995Change: {
    difference: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
  silver999Change: {
    difference: number;
    percentage: number;
    direction: "up" | "down" | "neutral";
  };
  manualOverride: boolean;
  adminAdjustments: {
    gold999Adjustment: MetalAdjustment;
    gold995Adjustment: MetalAdjustment;
    silver999Adjustment: MetalAdjustment;
  };
}

export type MetalSettingsUpdate = Partial<{
  schedule: string;
  timezone: string;
  gold999Adjustment: MetalAdjustment;
  gold995Adjustment: MetalAdjustment;
  silver999Adjustment: MetalAdjustment;
  manualPriceMode: boolean;
  manualPrices: MetalManualPrices;
}>;

export async function fetchMetalState(): Promise<MetalServiceState> {
  const response = await fetch("/api/metals");
  if (!response.ok) {
    throw new Error("Unable to load metal price data.");
  }
  const data = await response.json();
  return data as MetalServiceState;
}

function adminHeaders(adminToken: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` };
}

export async function refreshMetalState(adminToken: string): Promise<MetalServiceState> {
  const response = await fetch("/api/metals/refresh", {
    method: "POST",
    headers: adminHeaders(adminToken),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || "Unable to refresh metal prices.");
  }
  const data = await response.json();
  return data as MetalServiceState;
}

export async function saveMetalSettings(settings: MetalSettingsUpdate, adminToken: string): Promise<MetalServiceState> {
  const response = await fetch("/api/metals/settings", {
    method: "POST",
    headers: adminHeaders(adminToken),
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || "Unable to save metal price settings.");
  }
  const data = await response.json();
  return data as MetalServiceState;
}
