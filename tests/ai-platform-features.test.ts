import { describe, it, expect, vi } from "vitest";

// Mock the Redis database client to run locally in memory
vi.mock("@/lib/redis", () => ({
  redis: {
    incrby: vi.fn(async () => 100),
    lpush: vi.fn(async () => 1),
    ltrim: vi.fn(async () => "OK"),
    get: vi.fn(async () => "12000"),
  },
}));

import { parseNaturalQuery } from "../features/ai/services/search-engine";
import { parseDocumentOcr } from "../features/ai/services/ocr-service";
import { generateRoadtripPlan } from "../features/ai/services/trip-planner";
import { isWithinMonthlyBudget } from "../lib/ai/ai-cost-control";
import { recommendDynamicPricing } from "../features/ai/services/operational-ai";

describe("Tripzy Natural Search Engine", () => {
  it("converts natural query sentences into structured Prisma filters", async () => {
    const query = "I need an automatic SUV under ₹3000/day";
    const filters = await parseNaturalQuery(query);

    expect(filters.category).toBe("SUV");
    expect(filters.transmission).toBe("AUTOMATIC");
    expect(filters.pricing).toBeDefined();
  });
});

describe("Tripzy Document OCR Parser", () => {
  it("extracts structured licence details from image references", async () => {
    const docUrl = "https://cloudinary.com/id-scans/dl_front.png";
    const details = await parseDocumentOcr(docUrl);

    expect(details.name).toBe("Sachit Bhatia");
    expect(details.licenseNumber).toContain("MH-12-");
    expect(details.confidence).toBeGreaterThan(0.9);
  });
});

describe("Tripzy AI Trip Planner", () => {
  it("compiles fuel budget guidelines and recommends vehicle category sizes", async () => {
    const res = await generateRoadtripPlan({
      destination: "Goa",
      duration: 4,
      passengers: 5,
      budget: 8000,
    });

    expect(res.success).toBe(true);
    expect(res.recommendedCarCategory).toBe("SUV");
    expect(res.estimatedFuelCost).toBeGreaterThan(1000);
  });
});

describe("Tripzy AI Governance & Budget", () => {
  it("confirms token costs remain within monthly ceilings", async () => {
    const ok = await isWithinMonthlyBudget(500);
    expect(ok).toBe(true);
  });

  it("calculates advisory dynamic rates multiplier thresholds", async () => {
    const res = await recommendDynamicPricing("car-123", 2500);
    expect(res.success).toBe(true);
    expect(res.recommendedRate).toBeGreaterThan(2500);
  });
});
