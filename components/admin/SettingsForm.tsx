"use client";

import { useState } from "react";
import Image from "next/image";

export default function SettingsForm({
  initialTitle,
  initialLogoUrl,
  initialAvatarUrl,
}: {
  initialTitle: string;
  initialLogoUrl: string | null;
  initialAvatarUrl: string | null;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [savingTitle, setSavingTitle] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [titleMsg, setTitleMsg] = useState("");
  const [logoMsg, setLogoMsg] = useState("");
  const [avatarMsg, setAvatarMsg] = useState("");

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
      // Save logo to site_settings
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
      // Save avatar to site_settings
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

  return (
    <div className="max-w-xl flex flex-col gap-12">
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

      {/* LOGO */}
      <div>
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
    </div>
  );
}
