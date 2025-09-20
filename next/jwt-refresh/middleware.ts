import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 检查是否为受保护的路径
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 获取tokens
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // 如果没有tokens，重定向到登录页
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // 验证accessToken
    const accessPayload = await verifyToken(accessToken);
    if (accessPayload && accessPayload.userId) {
      // accessToken有效，添加用户ID到请求头
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", accessPayload.userId as string);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // accessToken无效，尝试使用refreshToken刷新
    const refreshPayload = await verifyToken(refreshToken);
    if (refreshPayload && refreshPayload.userId) {
      // refreshToken有效，重定向到刷新接口
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", request.url);
      return NextResponse.redirect(refreshUrl);
    }
  } catch (error) {
    console.error("Middleware token verification error:", error);
  }

  // 所有token都无效，重定向到登录页
  return NextResponse.redirect(new URL("/login", request.url));
}
