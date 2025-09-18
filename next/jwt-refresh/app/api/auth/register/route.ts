import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { emailRegex, passwordRegex } from "@/lib/regexp";

// restful
// 匹配规则，符号数学
// .什么都匹配，匹配一个
// + 一次或多次
// @ email 必须要有的字符
// .+@ 在@前面至少要有一个字符
// \. 一定要有一个. 2398205893@qq.com

export async function POST(request: NextRequest) {
  // 容错处理 稳定为主
  try {
    const { email, password } = await request.json();

    // 验证邮箱格式
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: `邮箱格式无效`,
        },
        {
          status: 400,
        }
      );
    }

    // 验证密码格式
    if (!password || !passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error: `密码需6-18位，且不能全为数字`,
        },
        {
          status: 400,
        }
      );
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "用户已存在",
        },
        {
          status: 409,
        }
      );
    }

    // 密码的单向加密
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, "----hashedPassword");

    // 创建新用户
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // 注意：实际项目中应该对密码进行哈希处理
      },
    });

    // 返回成功响应
    return NextResponse.json(
      {
        message: "注册成功",
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  } finally {
    // 释放数据库对象
    await prisma.$disconnect();
  }
}
