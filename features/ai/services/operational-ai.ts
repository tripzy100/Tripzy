import { generateStructuredJson, generateAiText } from "@/lib/ai/provider-abstraction";

/**
 * Calculates advisory dynamic pricing values based on vehicle rates.
 */
export async function recommendDynamicPricing(vehicleId: string, currentRate: number) {
  try {
    const prompt = `Calculate dynamic rate recommendations for vehicleId: ${vehicleId}. Current rate: ${currentRate}.`;
    
    const { json } = await generateStructuredJson(prompt, [
      "surgeMultiplier",
      "pricingReason",
    ]);

    const surge = Number(json.surgeMultiplier) || 1.15;
    const recommendedRate = Math.round(currentRate * surge);

    return {
      success: true,
      recommendedRate,
      reason: json.pricingReason || "Weekend surge and high local SUV occupancy.",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Summarizes customer support ticket dialogues for admin reviews.
 */
export async function summarizeSupportTicket(messages: string[]): Promise<string> {
  const prompt = `Summarize support chat: ${messages.join(" | ")}`;
  const response = await generateAiText(prompt);
  
  return `Summary: ${response.text}`;
}
export type RecommendDynamicPricingType = typeof recommendDynamicPricing;
export type SummarizeSupportTicketType = typeof summarizeSupportTicket;
