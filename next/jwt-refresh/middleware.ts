import { access } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const protectedPath = ["/dashboard", "profile"];

export async function middleware(request: NextRequest) {
  // pre next
  const path = request.nextUrl.pathname;
  // console.log("打中间件这必须过一下子");
  // 非保护的
  if (!protectedPath.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // login?
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (accessToken) {
    const accessPayload = await verifyToken(accessToken);
    if (accessPayload) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", accessPayload.userId as string);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}
