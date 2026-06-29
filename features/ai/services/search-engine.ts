import { getPromptTemplate } from "@/lib/ai/prompt-registry";
import { generateStructuredJson } from "@/lib/ai/provider-abstraction";

/**
 * Translates natural query strings into Prisma-compatible database filters.
 */
export async function parseNaturalQuery(query: string) {
  try {
    const prompt = getPromptTemplate("natural-search", { query });
    
    // Request structured key parameters matching schema attributes
    const { json } = await generateStructuredJson(prompt, [
      "vehicleType",
      "maxDailyBudget",
      "transmission",
    ]);

    const filters: any = {};
    
    if (json.vehicleType) {
      filters.category = json.vehicleType;
    }
    
    if (json.transmission) {
      filters.transmission = json.transmission.toUpperCase();
    }

    if (json.maxDailyBudget) {
      filters.pricing = {
        some: {
          baseRate: { lte: Number(json.maxDailyBudget) },
        },
      };
    }

    return filters;
  } catch (error) {
    console.error("Natural query parsing failure:", error);
    return {};
  }
}
export type ParseNaturalQueryType = typeof parseNaturalQuery;
