import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getRedisClient } from "./redis";
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS, getSession } from "./session";

const LOGIN_FAIL_LIMIT = 8;
const LOGIN_FAIL_WINDOW_SECONDS = 15 * 60;

export { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS, getSession };

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function generateToken() {
  return crypto.randomUUID();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, passwordHash) {
  if (!passwordHash) {
    return false;
  }
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId) {
  const redis = getRedisClient();
  const sessionId = generateToken();
  await redis.set(
    `session:${sessionId}`,
    { userId, createdAt: new Date().toISOString() },
    { ex: SESSION_TTL_SECONDS }
  );
  await redis.sadd(`user:${userId}:sessions`, sessionId);
  return sessionId;
}

export async function destroySession(sessionId) {
  if (!sessionId) {
    return;
  }
  const redis = getRedisClient();
  const session = await getSession(sessionId);
  await redis.del(`session:${sessionId}`);
  if (session && session.userId) {
    await redis.srem(`user:${session.userId}:sessions`, sessionId);
  }
}

export async function destroyAllUserSessions(userId) {
  const redis = getRedisClient();
  const sessionIds = await redis.smembers(`user:${userId}:sessions`);
  if (sessionIds && sessionIds.length) {
    await Promise.all(sessionIds.map((id) => redis.del(`session:${id}`)));
  }
  await redis.del(`user:${userId}:sessions`);
}

export async function recordLoginFailure(email) {
  const redis = getRedisClient();
  const key = `login:fails:${normalizeEmail(email)}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, LOGIN_FAIL_WINDOW_SECONDS);
  }
  return count;
}

export async function clearLoginFailures(email) {
  const redis = getRedisClient();
  await redis.del(`login:fails:${normalizeEmail(email)}`);
}

export async function isLoginLocked(email) {
  const redis = getRedisClient();
  const count = await redis.get(`login:fails:${normalizeEmail(email)}`);
  return Number(count || 0) >= LOGIN_FAIL_LIMIT;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await getSession(sessionId);

  if (!session) {
    return null;
  }

  const redis = getRedisClient();
  const userRecord = await redis.get(`user:${session.userId}`);
  return userRecord || null;
}
