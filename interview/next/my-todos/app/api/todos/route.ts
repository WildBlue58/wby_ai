import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { title } = await request.json();
  const todo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(todo);
}

export async function GET() {
  // 取所有的
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(todos);
}
