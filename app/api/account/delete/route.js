import { cookies } from "next/headers";
import { getRedisClient } from "@/lib/redis";
import { getCurrentUser, destroyAllUserSessions, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const redis = getRedisClient();
  const tokens = await redis.zrange(`user:${user.id}:invitations`, 0, -1);

  if (tokens.length) {
    await Promise.all(tokens.map((token) => redis.del(`invitation:${token}`)));
  }

  await redis.del(`user:${user.id}:invitations`);
  await redis.del(`user:email:${user.email}`);
  await redis.del(`user:${user.id}`);
  await destroyAllUserSessions(user.id);

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  return Response.json({ ok: true });
}
