import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasValidSession()) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    }

    // Get API key from Supabase settings, fall back to env var
    const settings = await getSiteSettings();
    const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add it in Admin → Settings." },
        { status: 500 }
      );
    }

    const model = "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt.trim() }],
          },
        ],
        generationConfig: {
          temperature: 0.85,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = geminiData?.error?.message || "Gemini API error.";
      console.error("Gemini API error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No output was returned.";

    return NextResponse.json({ ok: true, text });
  } catch (err: any) {
    console.error("Gemini route error:", err);
    return NextResponse.json({ error: err.message || "Server error." }, { status: 500 });
  }
}

