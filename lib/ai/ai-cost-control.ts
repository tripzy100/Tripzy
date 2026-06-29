import { redis } from "@/lib/redis";

const MONTHLY_TOKEN_BUDGET_LIMIT = 5000000;

/**
 * Validates if the monthly token usage remains within allowed budget ceilings.
 */
export async function isWithinMonthlyBudget(tokensEstimate: number): Promise<boolean> {
  try {
    const rawTokens = await redis.get("tripzy:ai:tokens");
    const currentTokens = Number(rawTokens) || 0;
    
    return currentTokens + tokensEstimate <= MONTHLY_TOKEN_BUDGET_LIMIT;
  } catch (error) {
    console.error("AI Budget check failure:", error);
    return true; // Fallback to allow calls in case of Redis outages
  }
}
export type IsWithinMonthlyBudgetType = typeof isWithinMonthlyBudget;
