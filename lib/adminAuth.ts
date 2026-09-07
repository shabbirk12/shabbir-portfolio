import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a random 32+ character value in .env.local."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

type AdminUser = { id: number; username: string; email: string; password_hash: string };

/**
 * Checks a username + password against the database. Both a DB lookup and a
 * bcrypt compare always run (even for an unknown username, against a dummy
 * hash) so response timing doesn't reveal whether the username exists.
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<{ id: number; username: string } | null> {
  const rows = await query<AdminUser>(
    "SELECT id, username, email, password_hash FROM admin_users WHERE username = $1",
    [username]
  );

  const user = rows[0];
  const hashToCheck = user?.password_hash ?? "$2b$12$invalidsaltinvalidsaltinvalidsaltinvalidsa";
  const ok = bcrypt.compareSync(password, hashToCheck);

  if (!user || !ok) return null;
  return { id: user.id, username: user.username };
}

/** Creates a signed, expiring session token carrying the logged-in user's id. */
export function createSessionToken(userId: number): string {
  const payload = JSON.stringify({ uid: userId, exp: Date.now() + SESSION_TTL_MS });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

type SessionPayload = { uid: number; exp: number };

function decodeSessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSig = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (typeof payload.uid === "number" && typeof payload.exp === "number" && payload.exp > Date.now()) {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/** Verifies a session token's signature and expiry. Returns true if valid. */
export function verifySessionToken(token: string | undefined | null): boolean {
  return decodeSessionToken(token) !== null;
}

export { SESSION_COOKIE, SESSION_TTL_MS };

/** Checks whether the current request (route handler or server component) has a valid admin session. */
export function hasValidSession(): boolean {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Returns the logged-in admin's user id, or null if there's no valid session. */
export function getSessionUserId(): number | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return decodeSessionToken(token)?.uid ?? null;
}

// ── Password reset ─────────────────────────────────────────────────────

const RESET_TOKEN_TTL_MS = 1000 * 60 * 60; // 1 hour

function hashToken(token: string): string {
  return createHmac("sha256", getSecret()).update(token).digest("hex");
}

/**
 * Creates a password-reset token for the given email if an account exists.
 * Always looks the same to the caller either way (no "user not found" leak) —
 * returns the raw token (to email) only when a user was actually found.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const rows = await query<{ id: number }>("SELECT id FROM admin_users WHERE email = $1", [email]);
  const user = rows[0];
  if (!user) return null;

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await query(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [user.id, tokenHash, expiresAt]
  );

  return rawToken;
}

/** Verifies a reset token and, if valid, updates the user's password and marks the token used. */
export async function resetPasswordWithToken(rawToken: string, newPassword: string): Promise<boolean> {
  const tokenHash = hashToken(rawToken);

  const rows = await query<{ id: number; user_id: number }>(
    "SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used = false AND expires_at > now()",
    [tokenHash]
  );
  const record = rows[0];
  if (!record) return false;

  const newHash = bcrypt.hashSync(newPassword, 12);
  await query("UPDATE admin_users SET password_hash = $1 WHERE id = $2", [newHash, record.user_id]);
  await query("UPDATE password_reset_tokens SET used = true WHERE id = $1", [record.id]);
  return true;
}
