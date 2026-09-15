import { redirect } from "next/navigation";
import Link from "next/link";
import { hasValidSession } from "@/lib/adminAuth";
import { getSiteSettings } from "@/lib/siteSettings";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!hasValidSession()) redirect("/admin/login");

  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-ink px-6 md:px-10 py-10">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-lime transition-colors">
        ← BACK TO DASHBOARD
      </Link>
      <p className="font-mono text-[0.65rem] tracking-widest2 text-lime mb-2 mt-6">ADMIN</p>
      <h1 className="font-display text-3xl uppercase text-paper mb-10">Site Settings</h1>

      <SettingsForm
        initialTitle={settings.title}
        initialLogoUrl={settings.logoUrl}
        initialAvatarUrl={settings.avatarUrl}
        initialPrimaryColor={settings.primaryColor}
        initialSecondaryColor={settings.secondaryColor}
        initialBgColor={settings.bgColor}
        initialTextColor={settings.textColor}
        initialAccentGradient={settings.accentGradient}
      />
    </main>
  );
}
