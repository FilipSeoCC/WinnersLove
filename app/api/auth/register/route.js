import { cookies } from "next/headers";
import { getRedisClient } from "@/lib/redis";
import {
  normalizeEmail,
  isValidPassword,
  isValidPhone,
  hashPassword,
  createSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions
} from "@/lib/auth";
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/consent";

export async function POST(request) {
  try {
    const data = await request.json();
    const email = normalizeEmail(data.email);
    const password = typeof data.password === "string" ? data.password : "";
    const phone = data.phone ? String(data.phone).trim() : "";
    const termsAccepted = Boolean(data.termsAccepted);
    const phoneConsent = Boolean(data.phoneConsent);

    if (!email || !email.includes("@")) {
      return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return Response.json({ ok: false, error: "invalid_password" }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return Response.json({ ok: false, error: "invalid_phone" }, { status: 400 });
    }

    if (!termsAccepted) {
      return Response.json({ ok: false, error: "terms_required" }, { status: 400 });
    }

    const redis = getRedisClient();
    const emailKey = `user:email:${email}`;
    const existingUserId = await redis.get(emailKey);

    if (existingUserId) {
      return Response.json({ ok: false, error: "email_taken" }, { status: 409 });
    }

    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    const userRecord = {
      id: userId,
      email,
      passwordHash,
      phone,
      createdAt: now,
      termsConsentVersion: TERMS_VERSION,
      termsConsentAt: now
    };

    if (phoneConsent) {
      userRecord.phoneConsentVersion = PRIVACY_VERSION;
      userRecord.phoneConsentAt = now;
    }

    await redis.set(`user:${userId}`, userRecord);
    await redis.set(emailKey, userId);

    const sessionId = await createSession(userId);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions());

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Blad rejestracji", error);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
