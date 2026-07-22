import { NextRequest, NextResponse } from "next/server";
import { b64encode } from "@/lib/judge0";

const JUDGE0_URL = process.env.JUDGE0_URL ?? "http://localhost:2358";
const JUDGE0_AUTH = process.env.JUDGE0_AUTH_TOKEN;
const JUDGE0_HOST = process.env.JUDGE0_RAPIDAPI_HOST;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sourceCode,
      languageId,
      testcases,
      cpuTimeLimit,
      memoryLimit,
    }: {
      sourceCode: string;
      languageId: number;
      testcases: { stdin: string; expectedStdout: string }[];
      cpuTimeLimit?: number;
      memoryLimit?: number;
    } = body;

    if (!sourceCode || !languageId || !Array.isArray(testcases)) {
      return NextResponse.json({ error: "bad request" }, { status: 400 });
    }

    const submissions = testcases.map((tc) => ({
      source_code: b64encode(sourceCode),
      language_id: languageId,
      stdin: b64encode(tc.stdin),
      expected_output: b64encode(tc.expectedStdout),
      cpu_time_limit: cpuTimeLimit,
      memory_limit: memoryLimit,
    }));

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (JUDGE0_HOST) {
      headers["X-RapidAPI-Host"] = JUDGE0_HOST;
      if (JUDGE0_AUTH) headers["X-RapidAPI-Key"] = JUDGE0_AUTH;
    } else if (JUDGE0_AUTH) {
      headers["X-Auth-Token"] = JUDGE0_AUTH;
    }

    const res = await fetch(
      `${JUDGE0_URL}/submissions/batch?base64_encoded=true`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ submissions }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "judge0 submit failed", detail: text },
        { status: 502 }
      );
    }

    const tokens: { token: string }[] = await res.json();
    return NextResponse.json({ tokens: tokens.map((t) => t.token) });
  } catch (e: any) {
    console.error("[judge0/submit] error:", e);
    return NextResponse.json(
      { error: "internal", detail: e?.message ?? String(e), stack: e?.stack },
      { status: 500 }
    );
  }
}
