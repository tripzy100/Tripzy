import { logAiPerformance } from "./ai-observability";

interface ModelResponse {
  text: string;
  tokensUsed: number;
  provider: string;
}

/**
 * Interface client wrapper to generate model replies interchangeably.
 * Primed to support Gemini (primary), falling back to other API wrappers.
 */
export async function generateAiText(
  prompt: string,
  provider = "GEMINI"
): Promise<ModelResponse> {
  const startTime = Date.now();
  
  // Safe input moderation check
  if (prompt.toLowerCase().includes("system override") || prompt.toLowerCase().includes("ignore rules")) {
    throw new Error("Prompt moderation block: Possible prompt injection attempt.");
  }

  // Simulating provider API calls response times and tokens metrics
  const tokensUsed = Math.floor(50 + Math.random() * 150);
  const latency = Date.now() - startTime;

  // Log metrics inside observability database logs/Redis
  await logAiPerformance({
    provider,
    latency,
    tokensUsed,
    success: true,
  });

  // Mocked model replies matching typical customer support profiles
  let text = `[Mock ${provider} Response] I'd be happy to assist you with that rental query!`;
  if (prompt.includes("SUV")) {
    text = `Recommended SUV choices: Mahindra Thar or Jeep Compass available in the Mumbai depot catalog.`;
  }

  return { text, tokensUsed, provider };
}

/**
 * Returns structured JSON answers from the AI model.
 */
export async function generateStructuredJson(
  prompt: string,
  schemaKeys: string[]
): Promise<{ json: any; tokensUsed: number }> {
  // In dev, mock structural parsed response matching keys
  const tokensUsed = Math.floor(100 + Math.random() * 200);
  
  const mockJson: Record<string, any> = {};
  for (const key of schemaKeys) {
    mockJson[key] = key === "name" ? "Sachit Bhatia" : `Parsed parameter for ${key}`;
  }

  if (schemaKeys.includes("vehicleType")) {
    mockJson.vehicleType = "SUV";
    mockJson.maxDailyBudget = 3000;
    mockJson.transmission = "Automatic";
  }
  if (schemaKeys.includes("licenseNumber")) {
    mockJson.name = "Sachit Bhatia";
    mockJson.licenseNumber = "MH-12-20150009841";
  }

  return { json: mockJson, tokensUsed };
}
export type GenerateAiTextType = typeof generateAiText;
