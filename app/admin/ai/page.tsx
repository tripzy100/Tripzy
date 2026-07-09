import { Sparkles } from "lucide-react";

export default async function AdminAiPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-foreground">
          <Sparkles className="h-6 w-6 text-primary" /> AI Features
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AI-powered features are available as an add-on. Configure your preferred AI provider to
          enable recommendations, trip planning, and intelligent search.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
        AI services are not configured. Integrate OpenAI, Gemini, or your preferred provider to
        unlock AI capabilities.
      </div>
    </div>
  );
}
