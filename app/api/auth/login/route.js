import { cookies } from "next/headers";
import { getRedisClient } from "@/lib/redis";
import {
  normalizeEmail,
  verifyPassword,
  createSession,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
  recordLoginFailure,
  clearLoginFailures,
  isLoginLocked
} from "@/lib/auth";

export async function POST(request) {
  try {
    const data = await request.json();
    const email = normalizeEmail(data.email);
    const password = typeof data.password === "string" ? data.password : "";

    if (!email || !password) {
      return Response.json({ ok: false, error: "invalid_credentials" }, { status: 400 });
    }

    if (await isLoginLocked(email)) {
      return Response.json({ ok: false, error: "too_many_attempts" }, { status: 429 });
    }

    const redis = getRedisClient();
    const userId = await redis.get(`user:email:${email}`);
    const userRecord = userId ? await redis.get(`user:${userId}`) : null;
    const passwordOk = userRecord ? await verifyPassword(password, userRecord.passwordHash) : false;

    if (!userRecord || !passwordOk) {
      await recordLoginFailure(email);
      return Response.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
    }

    await clearLoginFailures(email);

    const sessionId = await createSession(userRecord.id);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions());

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
