/**
 * Quick verification for Metals.Dev response parsing and kg→g conversion.
 * Run: node scripts/test-metals-parser.mjs
 */
import { parseMetalsDevResponse } from "../src/react-app/metalsPrice.ts";

const assert = (label, condition) => {
  if (!condition) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
    return;
  }
  console.log(`PASS: ${label}`);
};

// Metals.Dev shape: json.metals.gold / json.metals.silver with unit kg
const kgResponse = {
  status: "success",
  currency: "INR",
  unit: "kg",
  timestamp: 1710000000,
  metals: {
    gold: 8500000,
    silver: 95000,
  },
};

const kgParsed = parseMetalsDevResponse(kgResponse);
assert("kg gold per gram", kgParsed.gold999Price === Math.round((8500000 / 1000) * 10));
assert("kg silver per kg", kgParsed.silver999Price === Math.round((95000 / 1000) * 1000));
assert("numeric timestamp converted", typeof kgParsed.timestamp === "string");

// Gram unit (no conversion)
const gramResponse = {
  status: "success",
  unit: "g",
  metals: { gold: 8500, silver: 95 },
};
const gramParsed = parseMetalsDevResponse(gramResponse);
assert("gram gold per 10g", gramParsed.gold999Price === Math.round(8500 * 10));
assert("gram silver per kg", gramParsed.silver999Price === Math.round(95 * 1000));

// Legacy data.* shape
const legacyResponse = {
  status: "success",
  unit: "g",
  data: { gold: { price: 8000 }, silver: { price: 90 } },
};
const legacyParsed = parseMetalsDevResponse(legacyResponse);
assert("legacy data shape", legacyParsed.gold999Price === Math.round(8000 * 10));

// Error handling
try {
  parseMetalsDevResponse({ status: "error", error_message: "bad key" });
  assert("error response throws", false);
} catch (e) {
  assert("error response throws", e.message === "bad key");
}

try {
  parseMetalsDevResponse({ status: "success", unit: "g", metals: { gold: 1 } });
  assert("missing silver throws", false);
} catch (e) {
  assert("missing silver throws", /missing gold or silver/i.test(e.message));
}

if (process.exitCode) {
  console.error("\nParser tests failed.");
  process.exit(1);
}
console.log("\nAll parser tests passed.");
