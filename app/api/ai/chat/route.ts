import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Missing message query" }, { status: 400 });
    }

    // Basic response - AI integration available as add-on
    return NextResponse.json({
      text: "I'm a basic assistant. For AI-powered responses, please configure an AI provider.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process chat" }, { status: 500 });
  }
}
