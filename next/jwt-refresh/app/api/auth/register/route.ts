import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// restful
// 匹配规则，符号数学
// .什么都匹配，匹配一个
// + 一次或多次
const emailRegex = /.+@.+\..+/;// RegExp

export async function POST(request: NextRequest) {
  // 容错处理 稳定为主
  try {
    const { email, password } = await request.json();
    // 正则
    if (!email || !password) {
      return NextResponse.json(
        {
          error: `Email and Password required`,
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
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
