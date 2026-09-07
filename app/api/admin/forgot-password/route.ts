import { NextResponse } from "next/server";
import { Resend } from "resend";
import { headers } from "next/headers";
import { createPasswordResetToken } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "site@shabbirk.com";

function getSiteUrl(): string {
  return process.env.SITE_URL || "http://localhost:3000";
}

export async function POST(req: Request) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(`forgot-password:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const token = await createPasswordResetToken(email);

    // Only actually send an email if the account exists — but always return
    // the same success response either way, so this endpoint can't be used
    // to check which emails have admin accounts.
    if (token && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const resetUrl = `${getSiteUrl()}/admin/reset-password/${token}`;
      await resend.emails.send({
        from: `Portfolio Admin <${FROM_EMAIL}>`,
        to: email,
        subject: "Reset your admin password",
        text: `Reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
      });
    } else if (token) {
      console.error("RESEND_API_KEY not set — password reset email not sent. Token:", token);
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot-password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
