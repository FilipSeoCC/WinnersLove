import { getRedisClient } from "@/lib/redis";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const redis = getRedisClient();
  const tokens = await redis.zrange(`user:${user.id}:invitations`, 0, -1, { rev: true });
  const invitations = tokens.length
    ? await Promise.all(tokens.map((token) => redis.get(`invitation:${token}`)))
    : [];

  const { passwordHash, ...safeUser } = user;

  return Response.json({
    ok: true,
    exportedAt: new Date().toISOString(),
    user: safeUser,
    invitations: invitations.filter(Boolean)
  });
}
