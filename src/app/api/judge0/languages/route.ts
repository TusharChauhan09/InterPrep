import { NextResponse } from "next/server";

const JUDGE0_URL = process.env.JUDGE0_URL ?? "http://localhost:2358";
const JUDGE0_AUTH = process.env.JUDGE0_AUTH_TOKEN;

export async function GET() {
  try {
    const headers: Record<string, string> = {};
    if (JUDGE0_AUTH) headers["X-Auth-Token"] = JUDGE0_AUTH;
    const res = await fetch(`${JUDGE0_URL}/languages`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "judge0 languages failed" },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: "internal", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
