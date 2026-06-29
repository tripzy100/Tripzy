import { redis } from "@/lib/redis";
import { generateAiText } from "./provider-abstraction";

/**
 * Executes model queries with fallback providers and feature flag verification.
 */
export async function generateAiWithFallback(
  prompt: string,
  featureFlagName: string
): Promise<{ text: string; provider: string }> {
  // 1. Verify feature flag in Redis
  const flagKey = `tripzy:feature:ai:${featureFlagName}`;
  const isFlagActive = await redis.get(flagKey);
  
  if (isFlagActive === "false") {
    return {
      text: "AI service is currently suspended for this feature.",
      provider: "SYSTEM_FALLBACK",
    };
  }

  // 2. Primary Execution (Gemini)
  try {
    const primary = await generateAiText(prompt, "GEMINI");
    return { text: primary.text, provider: primary.provider };
  } catch (error) {
    console.warn("Primary AI provider (Gemini) failed. Launching fallback strategy...", error);
    
    // 3. Fallback Execution (OpenAI)
    try {
      const fallback = await generateAiText(prompt, "OPENAI");
      return { text: fallback.text, provider: fallback.provider };
    } catch (fallbackError) {
      console.error("All AI providers failed execution:", fallbackError);
      return {
        text: "We are currently experiencing AI latency issues. Please try again shortly.",
        provider: "NONE",
      };
    }
  }
}
export type GenerateAiWithFallbackType = typeof generateAiWithFallback;
