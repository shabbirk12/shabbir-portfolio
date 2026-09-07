import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { resetPasswordWithToken } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = checkRateLimit(`reset-password:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const { token, password } = await req.json();

    if (typeof token !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Missing token or password." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const ok = await resetPasswordWithToken(token, password);
    if (!ok) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Request a new one." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reset-password error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
