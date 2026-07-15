import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, getSession } from "@/lib/session";

export async function middleware(request) {
  const sessionId = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await getSession(sessionId);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"]
};
