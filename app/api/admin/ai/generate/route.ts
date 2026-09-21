import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/adminAuth";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasValidSession()) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  try {
    const body = await req.json();
    const { task, prompt, context } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // Retrieve Gemini API Key from site_settings or environment
    const settings = await getSiteSettings();
    const apiKey = (settings.geminiApiKey || process.env.GEMINI_API_KEY || "").trim();

    // If API Key is available, call Google Gemini API directly
    if (apiKey) {
      let taskInstruction = "";
      if (task === "project_summary") {
        taskInstruction = "CRITICAL REQUIREMENT: Write EXACTLY ONE concise, punchy sentence (maximum 20-25 words) for a portfolio card description. Do NOT write markdown headings (no ###), do NOT write bullet points, labels, or multi-line text. Output ONLY the single sentence.";
      } else if (task === "project_hero") {
        taskInstruction = "CRITICAL REQUIREMENT: Write EXACTLY ONE bold editorial tagline sentence (maximum 15-20 words) for a project case study header. Do NOT write markdown headings, bullet points, or labels. Output ONLY the single sentence.";
      } else if (task === "project_title") {
        taskInstruction = "Return ONLY a clean 1-4 word project title. No markdown, no punctuation.";
      } else if (task === "blog_draft") {
        taskInstruction = "Write a comprehensive, engaging markdown blog article on the topic.";
      }

      const systemInstruction = "You are an elite creative director and copywriter crafting portfolio content for Shabbir Khan. Tone: crisp, bold, editorial, modern, punchy. Follow formatting and length constraints strictly.";
      const fullPrompt = `${taskInstruction}\n\nTopic / Input: ${prompt}\nContext: ${context || "Portfolio design & engineering"}`;

      const model = "gemini-2.0-flash";
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
              maxOutputTokens: task === "project_summary" || task === "project_hero" ? 80 : 1200,
            }
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiJson = await geminiRes.json();
        const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          let cleaned = text.trim();
          if (task === "project_summary" || task === "project_hero") {
            // Strip any accidental markdown headers, bold labels, quotes
            cleaned = cleaned.replace(/^#+.*$/gm, "").trim();
            cleaned = cleaned.replace(/^\*\*.*?\*\*:\s*/i, "").trim();
            cleaned = cleaned.replace(/^(summary|overview|project|tagline):\s*/i, "").trim();
            const lines = cleaned.split("\n").map((l: string) => l.trim()).filter(Boolean);
            if (lines.length > 0) {
              cleaned = lines[0].replace(/^["'“](.*)["'”]$/, "$1");
            }
          }
          return NextResponse.json({ ok: true, generatedText: cleaned, provider: "gemini" });
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
