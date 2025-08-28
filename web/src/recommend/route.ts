import { NextRequest, NextResponse } from "next/server";
import { spawnSync } from "child_process";
import path from "path";

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const scriptPath = path.join(process.cwd(), "ml", "recommend.py");

  // Python 스크립트 실행
  const result = spawnSync("python", [scriptPath, query], {
    encoding: "utf-8",
  });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  try {
    const recommendations = JSON.parse(result.stdout);
    return NextResponse.json({ recommendations });
  } catch {
    return NextResponse.json({ error: "Failed to parse Python output" }, { status: 500 });
  }
}
