import { cookies } from "next/headers";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  await destroySession(sessionId);
  cookieStore.delete(SESSION_COOKIE_NAME);

  return Response.json({ ok: true });
}
