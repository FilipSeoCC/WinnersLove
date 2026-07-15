import { getRedisClient } from "@/lib/redis";
import { getCurrentUser, generateToken } from "@/lib/auth";

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

  return Response.json({ ok: true, invitations: invitations.filter(Boolean) });
}

export async function POST(request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const data = await request.json().catch(() => ({}));
  const recipientLabel = data.recipientLabel ? String(data.recipientLabel).trim().slice(0, 80) : "";

  const redis = getRedisClient();
  const token = generateToken();
  const now = Date.now();

  const invitation = {
    token,
    userId: user.id,
    recipientLabel,
    status: "pending",
    createdAt: new Date(now).toISOString()
  };

  await redis.set(`invitation:${token}`, invitation);
  await redis.zadd(`user:${user.id}:invitations`, { score: now, member: token });

  return Response.json({ ok: true, invitation });
}
