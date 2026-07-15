import { getRedisClient } from "@/lib/redis";
import { isValidPassword, hashPassword, destroyAllUserSessions } from "@/lib/auth";

export async function POST(request) {
  try {
    const data = await request.json();
    const token = typeof data.token === "string" ? data.token : "";
    const password = typeof data.password === "string" ? data.password : "";

    if (!token) {
      return Response.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return Response.json({ ok: false, error: "invalid_password" }, { status: 400 });
    }

    const redis = getRedisClient();
    const resetRecord = await redis.get(`pwreset:${token}`);

    if (!resetRecord || !resetRecord.userId) {
      return Response.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    const userKey = `user:${resetRecord.userId}`;
    const userRecord = await redis.get(userKey);

    if (!userRecord) {
      return Response.json({ ok: false, error: "invalid_token" }, { status: 400 });
    }

    userRecord.passwordHash = await hashPassword(password);
    await redis.set(userKey, userRecord);
    await redis.del(`pwreset:${token}`);
    await destroyAllUserSessions(resetRecord.userId);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
