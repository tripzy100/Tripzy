const promptTemplates: Record<string, { body: string; version: string }> = {
  "customer-assistant": {
    version: "1.2.0",
    body: "You are a Tripzy Support Assistant. Help customers rent self-drive vehicles. Current user state: {userState}. Query: {query}",
  },
  "trip-planner": {
    version: "2.0.1",
    body: "You are a Tripzy Roadtrip Organizer. Plan routes for {destination} over {duration} days for {passengers} passengers.",
  },
  "natural-search": {
    version: "1.0.0",
    body: "Extract vehicle filter keys from query: '{query}'. Schema keys requested: vehicleType, maxDailyBudget, transmission.",
  },
};

/**
 * Returns formatted prompt templates with injected variables.
 */
export function getPromptTemplate(
  name: string,
  variables: Record<string, string>
): string {
  const template = promptTemplates[name];
  if (!template) throw new Error(`Prompt template ${name} not found in registry`);

  let body = template.body;
  for (const [key, val] of Object.entries(variables)) {
    body = body.replace(`{${key}}`, val);
  }

  return body;
}

/**
 * Returns prompt version info.
 */
export function getPromptVersion(name: string): string {
  return promptTemplates[name]?.version || "N/A";
}
