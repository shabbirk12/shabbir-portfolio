import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const { task, prompt, context } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // Retrieve Gemini API Key from environment or site_settings
    let apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      try {
        const rows = await query<{ gemini_api_key?: string }>("SELECT gemini_api_key FROM site_settings WHERE id = 1");
        if (rows[0]?.gemini_api_key) apiKey = rows[0].gemini_api_key.trim();
      } catch {}
    }

    // If API Key is available, call Google Gemini 1.5 Flash API directly
    if (apiKey) {
      const systemInstruction = "You are an elite creative director, brand strategist, and senior full-stack engineer helping craft portfolio content for Shabbir Khan. Tone: crisp, bold, editorial, modern, punchy. Return cleanly formatted output without fluff.";
      const fullPrompt = `Task: ${task}\nContext: ${context || "Portfolio design & engineering"}\nInstructions/Topic: ${prompt}`;

      const model = "gemini-3.6-flash";
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemInstruction + "\n\n" + fullPrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiJson = await geminiRes.json();
        const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ ok: true, generatedText: text.trim(), provider: "gemini" });
        }
      } else {
        console.warn("Gemini API call failed with status", geminiRes.status, await geminiRes.text());
      }
    }

    // Smart Creative Fallback Generator if no key is configured or during quota limits
    let generated = "";
    if (task === "project_title") {
      const words = prompt.trim().split(" ");
      generated = words.map(w => w.toUpperCase()).join(" ") + " PLATFORM";
    } else if (task === "project_hero") {
      generated = `End-to-end brand positioning, kinetic design systems, and full-stack web architecture for ${prompt.trim()}.`;
    } else if (task === "project_summary") {
      generated = `A comprehensive visual identity and high-performance digital build for ${prompt.trim()} — built for high conversion, tactile typography, and sub-second load times.`;
    } else if (task === "blog_draft") {
      generated = `# ${prompt.trim()}\n\n## Introduction\nIn the rapidly evolving landscape of modern creative engineering, the intersection of bespoke brand identity and robust full-stack architecture has never been more critical.\n\n## The Core Philosophy\nWhen crafting digital platforms, visual polish and performance must exist in total symbiosis. Every animation, type hierarchy, and shader effect serves to communicate trust and authority.\n\n## Key Takeaways\n1. **Typography First**: Establish character before adding decorative flair.\n2. **Performance as an Aesthetic**: 60fps responsiveness communicates luxury.\n3. **Modular Scalability**: Design component systems that outlive initial launch.\n\n## Conclusion\nBy aligning brand narrative with intentional engineering, we create products that don't just launch — they endure.`;
    } else {
      generated = `Crafting distinct identity and digital platforms centered around ${prompt.trim()}.`;
    }

    return NextResponse.json({
      ok: true,
      generatedText: generated,
      provider: "smart-fallback",
      note: apiKey ? undefined : "Tip: You can add a GEMINI_API_KEY in your .env.local or Admin Settings to unlock custom real-time Gemini generation!",
    });
  } catch (err: any) {
    console.error("AI Generation error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate AI content" }, { status: 500 });
  }
}
