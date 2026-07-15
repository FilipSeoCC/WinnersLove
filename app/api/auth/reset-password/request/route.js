import { getRedisClient } from "@/lib/redis";
import { normalizeEmail, generateToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TTL_SECONDS = 60 * 60;

export async function POST(request) {
  try {
    const data = await request.json();
    const email = normalizeEmail(data.email);

    if (!email) {
      return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const redis = getRedisClient();
    const userId = await redis.get(`user:email:${email}`);

    if (userId) {
      const resetToken = generateToken();
      await redis.set(`pwreset:${resetToken}`, { userId }, { ex: RESET_TTL_SECONDS });

      const origin = request.headers.get("origin") || new URL(request.url).origin;
      const resetUrl = `${origin}/reset-password?token=${resetToken}`;

      try {
        await sendPasswordResetEmail({ toEmail: email, resetUrl });
      } catch (error) {
        console.error("Nie udalo sie wyslac maila resetujacego haslo", error);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Blad resetu hasla (request)", error);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
