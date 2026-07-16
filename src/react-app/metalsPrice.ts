export type MetalCode = "GOLD_999" | "GOLD_995" | "SILVER_999";

export type MetalAdjustmentMode = "fixed" | "percentage";

export interface MetalAdjustment {
  mode: MetalAdjustmentMode;
  value: number;
}

export interface MetalManualPrices {
  gold999: number;
  gold995: number;
  silver999: number;
}

export interface MetalSnapshot {
  timestamp: string;
  gold999Price: number;
  gold995Price: number;
  silver999Price: number;
}

export interface MetalApiStatus {
  provider: "Metals.Dev";
  status: "Connected" | "Error";
  lastSuccessfulUpdate: string | null;
  nextScheduledUpdate: string;
  apiUsageCounter: string;
  errorMessage?: string;
}

export interface MetalPriceSettings {
  apiStatus: MetalApiStatus;
  schedule: string;
  timezone: string;
  gold999Adjustment: MetalAdjustment;
  gold995Adjustment: MetalAdjustment;
  silver999Adjustment: MetalAdjustment;
  manualPriceMode: boolean;
  manualPrices: MetalManualPrices;
  currentSnapshot: MetalSnapshot | null;
  previousSnapshot: MetalSnapshot | null;
}

export interface MetalRatesResponse {
  status: string;
  currency?: string;
  unit?: string;
  timestamp?: string;
  data?: Record<string, { price: number } | { value: number }>;
  error_code?: number;
  error_message?: string;
}

export function formatIndianCurrency(value: number) {
  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

export function roundPrice(value: number) {
  return Math.round(value);
}

export function roundPercentage(value: number) {
  return Number(value.toFixed(2));
}

export function getIndiaWallClockDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(`${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}:${map.second}`);
}

export function getScheduleTimes(date = new Date()) {
  const indiaDate = getIndiaWallClockDate(date);
  const REFRESH_INTERVAL_MS = 3_600_000;
  const next2am = new Date(indiaDate.getTime() + REFRESH_INTERVAL_MS);
  return {
    currentSnapshotTime: indiaDate,
    nextUpdateTime: next2am,
  };
}

export function formatScheduleLabel(date: Date) {
  const indiaDate = getIndiaWallClockDate(date);
  const hours = indiaDate.getHours();
  const minutes = indiaDate.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getNextScheduledLabel() {
  return formatScheduleLabel(getScheduleTimes().nextUpdateTime);
}

export function getPriceChange(current: number, previous: number) {
  if (previous <= 0) {
    return {
      difference: 0,
      percentage: 0,
      direction: "neutral" as const,
    };
  }

  const difference = current - previous;
  const percent = (difference / previous) * 100;
  if (difference > 0) {
    return { difference: roundPrice(difference), percentage: roundPercentage(percent), direction: "up" as const };
  }

  if (difference < 0) {
    return { difference: roundPrice(Math.abs(difference)), percentage: roundPercentage(Math.abs(percent)), direction: "down" as const };
  }

  return { difference: 0, percentage: 0, direction: "neutral" as const };
}

function readMetalValue(source: any, key: string) {
  return source?.metals?.[key] ?? source?.data?.[key]?.price ?? source?.data?.[key]?.value ?? source?.[key]?.price ?? source?.[key]?.value ?? source?.rates?.[key]?.price ?? source?.rates?.[key]?.value ?? source?.[key];
}

function convertToGrams(value: number, unit: string) {
  const normalized = unit?.toLowerCase() ?? "g";
  if (normalized === "g" || normalized === "gram" || normalized === "grams") {
    return value;
  }
  if (normalized === "kg" || normalized === "kilogram" || normalized === "kilograms") {
    return value / 1000;
  }
  if (normalized === "toz" || normalized === "troy ounce" || normalized === "troy_oz") {
    return value / 31.1034768;
  }
  return value;
}

export function parseMetalsDevResponse(response: MetalRatesResponse) {
  if (!response || response.status !== "success") {
    throw new Error(response.error_message || "Unable to parse Metals.Dev response.");
  }

  const unit = response.unit ?? "g";
  const goldPerUnit = readMetalValue(response, "gold");
  const silverPerUnit = readMetalValue(response, "silver");

  if (typeof goldPerUnit !== "number" || typeof silverPerUnit !== "number") {
    throw new Error("Metals.Dev response missing gold or silver pricing data.");
  }

  const goldPerGram = convertToGrams(goldPerUnit, unit);
  const silverPerGram = convertToGrams(silverPerUnit, unit);
  const gold999Per10g = goldPerGram * 10;
  const gold995Per10g = gold999Per10g * 0.995;
  const silver999PerKg = silverPerGram * 1000;

  let timestamp: string;
  if (typeof response.timestamp === "number") {
    timestamp = new Date(response.timestamp * 1000).toISOString();
  } else if (typeof response.timestamp === "string") {
    timestamp = response.timestamp;
  } else {
    timestamp = new Date().toISOString();
  }

  return {
    timestamp,
    gold999Price: roundPrice(gold999Per10g),
    gold995Price: roundPrice(gold995Per10g),
    silver999Price: roundPrice(silver999PerKg),
  };
}

export function applyAdjustment(price: number, adjustment: MetalAdjustment) {
  if (adjustment.mode === "percentage") {
    return roundPrice(price * (1 + adjustment.value / 100));
  }
  return roundPrice(price + adjustment.value);
}

export function applyManualOverride(mode: boolean, manual: MetalManualPrices, computed: MetalSnapshot) {
  if (!mode) {
    return computed;
  }

  return {
    timestamp: computed.timestamp,
    gold999Price: manual.gold999,
    gold995Price: manual.gold995,
    silver999Price: manual.silver999,
  };
}

export function formatSnapshotDate(dateString: string | null) {
  if (!dateString) {
    return "-";
  }
  const date = new Date(dateString);
  return date.toLocaleString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}
