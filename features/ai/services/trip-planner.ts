import { getPromptTemplate } from "@/lib/ai/prompt-registry";
import { generateStructuredJson } from "@/lib/ai/provider-abstraction";

interface TripPlanRequest {
  destination: string;
  duration: number;
  passengers: number;
  budget: number;
}

/**
 * Compiles a structured roadtrip planner guide containing routes and vehicle choices.
 */
export async function generateRoadtripPlan(req: TripPlanRequest) {
  try {
    const prompt = getPromptTemplate("trip-planner", {
      destination: req.destination,
      duration: String(req.duration),
      passengers: String(req.passengers),
    });

    const { json } = await generateStructuredJson(prompt, [
      "suggestedRoute",
      "estimatedFuelCost",
      "packingTips",
    ]);

    return {
      success: true,
      suggestedRoute: json.suggestedRoute || "Mumbai-Pune Expressway Route",
      estimatedFuelCost: Number(json.estimatedFuelCost) || 3500,
      packingTips: json.packingTips || "Light casuals, umbrellas, monsoon boots.",
      recommendedCarCategory: req.passengers > 4 ? "SUV" : "Hatchback",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export type GenerateRoadtripPlanType = typeof generateRoadtripPlan;
