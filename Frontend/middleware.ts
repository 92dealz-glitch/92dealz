import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { protectedRouteMap } from "@/lib/auth/routes";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run protection for configured prefixes
  const rule = protectedRouteMap.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  // Read token from NextAuth JWT cookie
  const token = await getToken({ req });

  if (!token) {
    // Not signed in -> redirect to sign in
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  const role =
    token && typeof token === "object" && "role" in token
      ? (token as { role?: string }).role
      : undefined;

  if (!role || !rule.roles.includes(role)) {
    // Signed in but wrong role -> redirect to unauthorized page
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Statically list matchers so Next.js can statically analyze the config.
export const config = {
  matcher: [
    "/buyer/:path*",
    "/seller/:path*",
    "/admin/:path*",
  ],
};
