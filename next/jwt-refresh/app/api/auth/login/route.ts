import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailRegex, passwordRegex } from "@/lib/regexp";
import bcrypt from "bcryptjs";
import { createTokens, setAuthCookies } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "邮箱输入有误！" }, { status: 400 });
    }
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json({ error: "密码输入有误！" }, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true }, // 只选择需要的字段
    });

    if (!user) {
      return NextResponse.json({ error: "用户不存在！" }, { status: 404 });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "密码错误！" }, { status: 401 });
    }

    // 创建tokens
    const { accessToken, refreshToken } = await createTokens(user.id);

    // 更新用户的refreshToken
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 设置cookies
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        message: "登录成功",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
