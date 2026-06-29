import { NextResponse } from "next/server";
import { generateAiText } from "@/lib/ai/provider-abstraction";
import { getPromptTemplate } from "@/lib/ai/prompt-registry";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message query" }, { status: 400 });
    }

    const prompt = getPromptTemplate("customer-assistant", {
      userState: "User query on rental policies",
      query: message,
    });

    const result = await generateAiText(prompt);
    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
export type PostChatType = typeof POST;
