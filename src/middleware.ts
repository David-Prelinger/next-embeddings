// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, {
    cookieName: "myapp_cookiename",
    password: process.env.SECRET_COOKIE_PASSWORD!,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  // do anything with session here:
  const { user } = session;

  // demo:
  if (user?.isLoggedIn !== true) {
    // unauthorized to see pages inside admin/
    return NextResponse.redirect(new URL('/login', req.url)) // redirect to /unauthorized page
  }

  return res;
};

export const config = {
    matcher: ["/chat/:path*", "/api/chat/:path*"],
};