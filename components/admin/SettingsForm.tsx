"use client";

import { useState } from "react";

const PRESETS = [
  {
    name: "Cyberpunk Lime (Default)",
    primary: "#c6ff3d",
    bg: "#0a0a0a",
    text: "#f2f1ed",
  },
  {
    name: "Electric Blue & Violet",
    primary: "#00f0ff",
    bg: "#050814",
    text: "#f0f4ff",
  },
  {
    name: "Sunset Ember & Amber",
    primary: "#ff5722",
    bg: "#0e0b0a",
    text: "#fdf6f0",
  },
  {
    name: "Emerald Matrix",
    primary: "#10b981",
    bg: "#05130d",
    text: "#f0fdf4",
  },
  {
    name: "Monochrome Studio",
    primary: "#ffffff",
    bg: "#000000",
    text: "#f4f4f5",
  },
];

const GRADIENT_PRESETS = [
  {
    name: "Solid (No Gradient)",
    gradient: "",
  },
  {
    name: "Neon Lime → Emerald",
    gradient: "linear-gradient(135deg, #c6ff3d 0%, #10b981 100%)",
  },
  {
    name: "Electric Cyan → Violet",
    gradient: "linear-gradient(135deg, #00f0ff 0%, #8b5cf6 100%)",
  },
  {
    name: "Sunset Flame",
    gradient: "linear-gradient(135deg, #ff5722 0%, #ffc107 100%)",
  },
  {
    name: "Electric Fuchsia → Purple",
    gradient: "linear-gradient(135deg, #ff007f 0%, #7928ca 100%)",
  },
  {
    name: "Solar Gold → Amber",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)",
  },
  {
    name: "Hyper Chrome Silver",
    gradient: "linear-gradient(135deg, #ffffff 0%, #64748b 100%)",
  },
];

export default function SettingsForm({
  initialTitle,
  initialLogoUrl,
  initialAvatarUrl,
  initialPrimaryColor,
  initialSecondaryColor,
  initialBgColor,
  initialTextColor,
  initialAccentGradient,
  initialGeminiApiKey,
}: {
  initialTitle: string;
  initialLogoUrl: string | null;
  initialAvatarUrl: string | null;
  initialPrimaryColor?: string | null;
  initialSecondaryColor?: string | null;
  initialBgColor?: string | null;
  initialTextColor?: string | null;
  initialAccentGradient?: string | null;
  initialGeminiApiKey?: string | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  // Theme 3-colors state
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor || "#c6ff3d");
  const [secondaryColor, setSecondaryColor] = useState(initialSecondaryColor || initialPrimaryColor || "#c6ff3d");
  const [bgColor, setBgColor] = useState(initialBgColor || "#0a0a0a");
  const [textColor, setTextColor] = useState(initialTextColor || "#f2f1ed");
  const [accentGradient, setAccentGradient] = useState(initialAccentGradient || "");
  const [geminiApiKey, setGeminiApiKey] = useState(initialGeminiApiKey || "");

  const [savingTitle, setSavingTitle] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingColors, setSavingColors] = useState(false);
  const [savingGemini, setSavingGemini] = useState(false);

  const [titleMsg, setTitleMsg] = useState("");
  const [logoMsg, setLogoMsg] = useState("");
  const [avatarMsg, setAvatarMsg] = useState("");
  const [colorMsg, setColorMsg] = useState("");
  const [geminiMsg, setGeminiMsg] = useState("");

  async function saveGeminiKey() {
    setSavingGemini(true);
    setGeminiMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: geminiApiKey.trim() }),
      });
      setGeminiMsg(res.ok ? "Gemini API Key saved successfully! AI drafting active." : "Failed to save.");
    } catch {
      setGeminiMsg("Network error.");
    } finally {
      setSavingGemini(false);
    }
  }

  async function saveTitle() {
    setSavingTitle(true);
    setTitleMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      setTitleMsg(res.ok ? "Saved." : json.error || "Failed to save.");
    } catch {
      setTitleMsg("Network error.");
    } finally {
      setSavingTitle(false);
    }
  }

  async function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setLogoMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setLogoMsg(json.error || "Upload failed.");
        return;
      }
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl: json.url }),
      });
      setLogoUrl(json.url);
      setLogoMsg("Logo updated.");
    } catch {
      setLogoMsg("Network error.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setAvatarMsg(json.error || "Upload failed.");
        return;
      }
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: json.url }),
      });
      setAvatarUrl(json.url);
      setAvatarMsg("Profile picture updated.");
    } catch {
      setAvatarMsg("Network error.");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  }

  async function onResetAvatar() {
    setAvatarMsg("Resetting…");
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: "" }),
      });
      setAvatarUrl(null);
      setAvatarMsg("Reset to default portrait.");
    } catch {
      setAvatarMsg("Network error.");
    }
  }

  async function saveColors() {
    setSavingColors(true);
    setColorMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor,
          secondaryColor: primaryColor, // Sync to enforce uniform 3-color theme
          bgColor,
          textColor,
          accentGradient: accentGradient.trim(),
        }),
      });
      const json = await res.json();
      setColorMsg(res.ok ? "Theme colors & gradient updated! Live across entire site." : json.error || "Failed to save.");
    } catch {
      setColorMsg("Network error.");
    } finally {
      setSavingColors(false);
    }
  }

  function applyPreset(preset: typeof PRESETS[number]) {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.primary); // enforce 3-color uniformity
    setBgColor(preset.bg);
    setTextColor(preset.text);
    setAccentGradient(""); // Clear gradient so solid color applies uniformly
    setColorMsg(`Selected preset: "${preset.name}" (Solid color). Click SAVE COLORS to apply.`);
  }

  function applyGradient(grad: string) {
    setAccentGradient(grad);
    if (grad) {
      setColorMsg("Gradient selected! Click SAVE COLORS to apply.");
    } else {
      setColorMsg("Gradient removed! Normal solid color will be applied. Click SAVE COLORS to apply.");
    }
  }

  async function resetColors() {
    setAccentGradient("");
    applyPreset(PRESETS[0]);
  }

  return (
    <div className="max-w-xl flex flex-col gap-14">
      {/* SITE TITLE */}
      <div>
        <p className="font-mono text-xs tracking-widest2 text-muted mb-3">SITE TITLE</p>
        <p className="text-muted text-xs mb-4">
          Shown in the browser tab and search results.
        </p>
        <div className="flex flex-col gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-b border-line py-2.5 text-paper focus-visible:outline-none outline-none focus:border-lime transition-colors w-full text-sm"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={saveTitle}
              disabled={savingTitle}
              className="rounded-full bg-lime text-lime-ink px-5 py-2.5 font-mono text-xs tracking-widest2 disabled:opacity-50 w-fit"
            >
              {savingTitle ? "SAVING…" : "SAVE TITLE"}
            </button>
            {titleMsg && <span className="font-mono text-xs text-muted">{titleMsg}</span>}
          </div>
        </div>
      </div>

      {/* THEME COLORS (3 Uniform Colors + Gradients) */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-xs tracking-widest2 text-lime mb-2">UNIFIED 3-COLOR THEME &amp; GRADIENTS</p>
        <p className="text-muted text-xs mb-6">
          Consistent 3-color palette (Background, Text, and Accent) across the entire portfolio, with optional gradient accents.
        </p>

        {/* 3-Color Presets */}
        <div className="mb-6">
          <span className="font-mono text-[0.65rem] tracking-widest2 text-muted block mb-3">QUICK 3-COLOR PRESETS</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p)}
                className="flex items-center gap-2 border border-line px-3 py-1.5 rounded-full text-xs font-mono hover:border-lime transition-colors text-muted hover:text-paper"
              >
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.primary }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color pickers grid (3 uniform colors) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Primary Accent */}
          <div className="flex flex-col gap-2 p-3 border border-line rounded">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">
              1. ACCENT COLOR
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  setSecondaryColor(e.target.value);
                }}
                className="w-8 h-8 rounded cursor-pointer border border-line bg-transparent p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => {
                  setPrimaryColor(e.target.value);
                  setSecondaryColor(e.target.value);
                }}
                className="bg-transparent border-b border-line py-1 text-paper font-mono text-xs w-24 uppercase focus-visible:outline-none focus:border-lime"
              />
            </div>
          </div>

          {/* Background Canvas */}
          <div className="flex flex-col gap-2 p-3 border border-line rounded">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">
              2. BACKGROUND
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-line bg-transparent p-0.5"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="bg-transparent border-b border-line py-1 text-paper font-mono text-xs w-24 uppercase focus-visible:outline-none focus:border-lime"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="flex flex-col gap-2 p-3 border border-line rounded">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">
              3. TEXT COLOR
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-line bg-transparent p-0.5"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="bg-transparent border-b border-line py-1 text-paper font-mono text-xs w-24 uppercase focus-visible:outline-none focus:border-lime"
              />
            </div>
          </div>
        </div>

        {/* GRADIENT ACCENT OPTIONS */}
        <div className="mb-6 p-4 border border-line rounded bg-surface/50">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-lime uppercase">
              GRADIENT OPTIONS (APPLIED TO BUTTONS &amp; HIGHLIGHTS)
            </span>
            {accentGradient ? (
              <button
                type="button"
                onClick={() => applyGradient("")}
                className="font-mono text-[0.65rem] tracking-wider text-muted hover:text-red-400 border border-line px-2.5 py-1 rounded"
              >
                ✕ REMOVE GRADIENT (USE NORMAL COLOR)
              </button>
            ) : (
              <span className="font-mono text-[0.65rem] tracking-wider text-lime/80 bg-lime/10 px-2.5 py-0.5 rounded">
                NORMAL COLOR ACTIVE
              </span>
            )}
          </div>
          <p className="text-muted text-xs mb-3">
            Choose a gradient preset below, or select &quot;Solid (No Gradient)&quot; to use your normal primary color sitewide:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {GRADIENT_PRESETS.map((g) => {
              const isSelected = accentGradient === g.gradient;
              return (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => applyGradient(g.gradient)}
                  className={`flex items-center gap-2 border px-3 py-1.5 rounded-full text-xs font-mono transition-colors ${
                    isSelected
                      ? "border-lime text-paper bg-surface"
                      : "border-line text-muted hover:text-paper hover:border-line/80"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                    style={{
                      background: g.gradient || primaryColor,
                    }}
                  />
                  {g.name}
                </button>
              );
            })}
          </div>

          {/* Custom gradient input */}
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">
              CUSTOM GRADIENT CSS (OPTIONAL)
            </span>
            <input
              type="text"
              placeholder="e.g. linear-gradient(135deg, #c6ff3d 0%, #10b981 100%)"
              value={accentGradient}
              onChange={(e) => setAccentGradient(e.target.value)}
              className="bg-transparent border-b border-line py-1 text-paper font-mono text-xs w-full focus-visible:outline-none focus:border-lime"
            />
          </div>
        </div>

        {/* Live Mini Preview */}
        <div
          className="p-4 rounded border border-line mb-6 flex items-center justify-between"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <div>
            <span
              className="font-mono text-xs mr-2"
              style={{
                background: accentGradient || undefined,
                color: accentGradient ? "transparent" : primaryColor,
                WebkitBackgroundClip: accentGradient ? "text" : undefined,
                WebkitTextFillColor: accentGradient ? "transparent" : undefined,
              }}
            >
              01 /
            </span>
            <span
              className="font-display uppercase text-sm font-semibold"
              style={{
                background: accentGradient || undefined,
                color: accentGradient ? "transparent" : undefined,
                WebkitBackgroundClip: accentGradient ? "text" : undefined,
                WebkitTextFillColor: accentGradient ? "transparent" : undefined,
              }}
            >
              Unified Portfolio Preview
            </span>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full font-mono text-[0.65rem] tracking-widest2 font-semibold transition-transform hover:scale-105"
            style={{
              background: accentGradient || primaryColor,
              color: bgColor,
            }}
          >
            SEND BRIEF ↗
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={saveColors}
            disabled={savingColors}
            className="rounded-full bg-lime text-lime-ink px-6 py-2.5 font-mono text-xs tracking-widest2 disabled:opacity-50"
          >
            {savingColors ? "SAVING…" : "SAVE COLORS &amp; GRADIENT"}
          </button>
          <button
            type="button"
            onClick={resetColors}
            className="border border-line px-4 py-2.5 font-mono text-xs tracking-widest2 text-muted hover:text-paper transition-colors"
          >
            RESET TO ORIGINAL
          </button>
          {colorMsg && <span className="font-mono text-xs text-lime block w-full mt-1">{colorMsg}</span>}
        </div>
      </div>

      {/* LOGO */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-xs tracking-widest2 text-muted mb-3">LOGO</p>
        <p className="text-muted text-xs mb-4">
          PNG, JPEG, WebP, or SVG — 5MB max. Replaces the &ldquo;S&rdquo; badge in the nav.
        </p>

        {logoUrl && (
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-12 w-12 border border-line bg-surface overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Current logo" className="w-full h-full object-contain p-1" />
            </div>
            <span className="text-muted text-xs">Current logo</span>
          </div>
        )}

        <label className="inline-block border border-line px-5 py-2.5 font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors cursor-pointer">
          {uploadingLogo ? "UPLOADING…" : "UPLOAD NEW LOGO"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onLogoChange}
            disabled={uploadingLogo}
            className="hidden"
          />
        </label>
        {logoMsg && <p className="font-mono text-xs text-muted mt-3">{logoMsg}</p>}
      </div>

      {/* ABOUT PROFILE PICTURE */}
      <div className="border-t border-line pt-8">
        <p className="font-mono text-xs tracking-widest2 text-muted mb-3">ABOUT SECTION PICTURE</p>
        <p className="text-muted text-xs mb-4">
          Your portrait photo used in the 3D dot-particle effect in the About section.
        </p>

        <div className="mb-6 flex items-center gap-6">
          <div className="relative h-28 w-24 border border-line bg-surface overflow-hidden rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl || "/images/profile.jpg"}
              alt="About portrait preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-paper">
              {avatarUrl ? "Custom portrait active" : "Default portrait (/images/profile.jpg)"}
            </span>
            <span className="text-muted text-xs">
              Looks best with high-contrast portrait photos (faces/silhouettes).
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="inline-block border border-line px-5 py-2.5 font-mono text-xs tracking-widest2 text-paper hover:border-lime hover:text-lime transition-colors cursor-pointer">
            {uploadingAvatar ? "UPLOADING…" : "UPLOAD NEW PICTURE"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={onAvatarChange}
              disabled={uploadingAvatar}
              className="hidden"
            />
          </label>

          {avatarUrl && (
            <button
              onClick={onResetAvatar}
              className="border border-line/60 px-4 py-2.5 font-mono text-xs tracking-widest2 text-muted hover:text-red-400 hover:border-red-400/50 transition-colors"
            >
              RESET TO DEFAULT
            </button>
          )}
        </div>
        {avatarMsg && <p className="font-mono text-xs text-muted mt-3">{avatarMsg}</p>}
      </div>

      {/* 5. GEMINI AI WRITING ASSISTANT */}
      <div className="border border-line p-6 bg-surface/30 rounded">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lime text-base">✨</span>
          <p className="font-mono text-xs tracking-widest2 text-lime font-bold uppercase">
            GEMINI AI WRITING ASSISTANT
          </p>
        </div>
        <p className="text-muted text-xs mb-4 leading-relaxed">
          Power the &quot;✨ Write with Gemini&quot; buttons across Project and Blog editors with your Google Gemini API key.
          You can get a free API key from{" "}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="text-lime underline hover:opacity-80"
          >
            Google AI Studio ↗
          </a>
          . (If left blank, the app will use smart built-in generator fallbacks).
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="password"
            placeholder="AIzaSy..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="flex-1 bg-ink border border-line py-2.5 px-3 rounded text-sm text-paper placeholder:text-muted/40 font-mono focus:border-lime"
          />
          <button
            type="button"
            onClick={saveGeminiKey}
            disabled={savingGemini}
            className="rounded-full bg-lime text-lime-ink px-6 py-2.5 font-mono text-xs tracking-widest2 font-semibold hover:scale-105 transition-transform disabled:opacity-50 shrink-0"
          >
            {savingGemini ? "SAVING…" : "SAVE AI KEY"}
          </button>
        </div>
        {geminiMsg && <p className="font-mono text-xs text-lime mt-3">{geminiMsg}</p>}
      </div>
    </div>
  );
}
