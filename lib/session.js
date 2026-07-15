import { getRedisClient } from "./redis";

export const SESSION_COOKIE_NAME = "jr_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export async function getSession(sessionId) {
  if (!sessionId) {
    return null;
  }
  const redis = getRedisClient();
  const session = await redis.get(`session:${sessionId}`);
  return session || null;
}
