import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { verifyCredentials, createSessionToken, SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rl = checkRateLimit(`login:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
    }

    const user = await verifyCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const token = createSessionToken(user.id);
    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_MS / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
