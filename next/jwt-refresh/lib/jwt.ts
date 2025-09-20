import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) throw new Error("JWT_SECRET_KEY is not set");
  // 二进制的secret
  return new TextEncoder().encode(secret);
};

export const createTokens = async (userId: number) => {
  const accessToken = await new SignJWT({ userId })
    // 创建JWT 载荷
    // 设置头部，指定使用HS256算法签名
    .setProtectedHeader({ alg: "HS256" })
    // 颁发的时间 当前时间
    .setIssuedAt()
    // 使用process.env.JWT_SECRET作为密钥，进行签名
    .setExpirationTime("15m")
    .sign(getJwtSecretKey());

  const refreshToken = await new SignJWT({ userId })
    // 创建JWT 载荷
    // 设置头部，指定使用HS256算法签名
    .setProtectedHeader({ alg: "HS256" })
    // 颁发的时间 当前时间
    .setIssuedAt()
    // 使用process.env.JWT_SECRET作为密钥，进行签名
    .setExpirationTime("7d")
    .sign(getJwtSecretKey());

  return { accessToken, refreshToken };
};

export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string
) => {
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    // 黑客XSS 攻击js 试图获得cookie
    httpOnly: true, // 不能用JavaScript 操作cookie
    maxAge: 60 * 15,
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production", // 生产环境使用HTTPS
  });
  cookieStore.set("refresh_token", refreshToken, {
    // 黑客XSS 攻击js 试图获得cookie
    httpOnly: true, // 不能用JavaScript 操作cookie
    maxAge: 60 * 60 * 24 * 7, // 7天
    sameSite: "strict",
    path: "/",
    secure: process.env.NODE_ENV === "production", // 生产环境使用HTTPS
  });
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};
