import { NextResponse } from "next/server";

// 统一的错误响应处理
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
) {
  console.error(`API Error [${status}]:`, message, details);

  return NextResponse.json(
    {
      error: message,
      ...(process.env.NODE_ENV === "development" && details && { details }),
    },
    { status }
  );
}

// 统一的成功响应处理
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    {
      message,
      ...data,
    },
    { status }
  );
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证密码强度
export function isValidPassword(password: string): boolean {
  // 6-18位，不能全为数字，包含字母和数字
  const passwordRegex = /^(?!^\d+$)^[a-zA-Z0-9!@#$%^&*]{6,18}$/;
  return passwordRegex.test(password);
}

// 清理用户数据，移除敏感信息
export function sanitizeUser(user: any) {
  const { password, refreshToken, ...sanitized } = user;
  return sanitized;
}

// 生成随机字符串（用于CSRF token等）
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
