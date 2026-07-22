import { NextRequest, NextResponse } from "next/server";

const JUDGE0_URL = process.env.JUDGE0_URL ?? "http://localhost:2358";
const JUDGE0_AUTH = process.env.JUDGE0_AUTH_TOKEN;

const FIELDS =
  "token,status,stdout,stderr,compile_output,message,time,memory,exit_code,exit_signal";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokens = searchParams.get("tokens");
    if (!tokens) {
      return NextResponse.json({ error: "missing tokens" }, { status: 400 });
    }

    const headers: Record<string, string> = {};
    if (JUDGE0_AUTH) headers["X-Auth-Token"] = JUDGE0_AUTH;

    const res = await fetch(
      `${JUDGE0_URL}/submissions/batch?tokens=${encodeURIComponent(
        tokens
      )}&base64_encoded=true&fields=${FIELDS}`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "judge0 result failed", detail: text },
        { status: 502 }
      );
    }

    const data = await res.json();
    console.log("[judge0/result] raw:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: "internal", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
