import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const response = await fetch(
      "https://api.github.com/users/WildBlue58/repos"
    );
    const repos = await response.json();
    return NextResponse.json(repos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 500 }
    );
  }
}
