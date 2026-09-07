"use client";

import { useState } from "react";
import Image from "next/image";

export default function SettingsForm({
  initialTitle,
  initialLogoUrl,
}: {
  initialTitle: string;
  initialLogoUrl: string | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [savingTitle, setSavingTitle] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [titleMsg, setTitleMsg] = useState("");
  const [logoMsg, setLogoMsg] = useState("");

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
      const res = await fetch("/api/admin/settings/logo", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setLogoMsg(json.error || "Upload failed.");
        return;
      }
      setLogoUrl(json.logoUrl);
      setLogoMsg("Logo updated.");
    } catch {
      setLogoMsg("Network error.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  }

  return (
    <div className="max-w-xl flex flex-col gap-12">
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

      <div>
        <p className="font-mono text-xs tracking-widest2 text-muted mb-3">LOGO</p>
        <p className="text-muted text-xs mb-4">
          PNG, JPEG, WebP, or SVG — 2MB max. Replaces the &ldquo;S&rdquo; badge in the nav.
        </p>

        {logoUrl && (
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-12 w-12 border border-line bg-surface">
              <Image src={logoUrl} alt="Current logo" fill className="object-contain p-1" />
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
    </div>
  );
}
