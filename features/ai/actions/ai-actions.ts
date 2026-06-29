"use client";

import { generateAiText } from "@/lib/ai/provider-abstraction";
import { getPromptTemplate } from "@/lib/ai/prompt-registry";
import { generateRoadtripPlan } from "../services/trip-planner";
import { parseDocumentOcr } from "../services/ocr-service";

/**
 * Submits support queries to the AI Customer Assistant model.
 */
export async function submitSupportChat(message: string) {
  try {
    const prompt = getPromptTemplate("customer-assistant", {
      userState: "Authenticated, No Active Booking",
      query: message,
    });

    const response = await generateAiText(prompt);
    return { success: true, text: response.text };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to process message" };
  }
}

/**
 * Calculates fuel cost and route details via the Trip Planner.
 */
export async function calculateTripPlan(
  destination: string,
  duration: number,
  passengers: number,
  budget: number
) {
  return generateRoadtripPlan({ destination, duration, passengers, budget });
}

/**
 * OCR extraction trigger helper.
 */
export async function uploadLicenceOcr(imageUrl: string) {
  return parseDocumentOcr(imageUrl);
}
export type SubmitSupportChatType = typeof submitSupportChat;
export type CalculateTripPlanType = typeof calculateTripPlan;
export type UploadLicenceOcrType = typeof uploadLicenceOcr;
