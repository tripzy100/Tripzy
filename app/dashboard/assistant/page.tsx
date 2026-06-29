"use client";

import * as React from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CustomerAssistantPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = React.useState<Message[]>([
    { role: "assistant", content: "Hi! I am your Tripzy Copilot. Ask me about car rules, pickup hours, or extensions." },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error("Failed to get chat response");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      showToast(err.message || "Chat failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gradient flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" /> Tripzy AI Copilot
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Get real-time answers about driving policies, speed limits, and billing questions.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/30 p-6 flex flex-col h-[450px]">
        {/* Messages body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed max-w-[85%] ${
                m.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border ${
                m.role === "user" ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border text-muted-foreground"
              }`}>
                {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              </div>
              <div className={`rounded-xl p-4 border ${
                m.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-card/50 border-border text-foreground"
              }`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={sendMessage} className="mt-4 flex gap-2 pt-4 border-t border-border/60">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Ask about rental limits, safety checklist..."
            className="flex-1 rounded-lg border border-border bg-card/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={loading}
          />
          <Button type="submit" size="sm" isLoading={loading}>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
export type CustomerAssistantPageType = typeof CustomerAssistantPage;
