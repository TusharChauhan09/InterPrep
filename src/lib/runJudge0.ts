import {
  Judge0SubmissionResult,
  Verdict,
  b64decode,
  mapStatusToVerdict,
} from "./judge0";

export interface TestcaseResult {
  index: number;
  verdict: Verdict;
  hidden: boolean;
  stdin?: string;
  expected?: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  timeMs: number | null;
  memoryKb: number | null;
}

export interface RunOutcome {
  verdict: Verdict;
  passed: number;
  total: number;
  results: TestcaseResult[];
  maxTimeMs: number | null;
  maxMemoryKb: number | null;
  compileOutput: string;
  stderr: string;
}

export async function submitBatch(params: {
  sourceCode: string;
  languageId: number;
  testcases: { stdin: string; expectedStdout: string; hidden: boolean }[];
  cpuTimeLimit?: number;
  memoryLimit?: number;
}): Promise<string[]> {
  const res = await fetch("/api/judge0/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sourceCode: params.sourceCode,
      languageId: params.languageId,
      testcases: params.testcases.map((t) => ({
        stdin: t.stdin,
        expectedStdout: t.expectedStdout,
      })),
      cpuTimeLimit: params.cpuTimeLimit,
      memoryLimit: params.memoryLimit,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.detail || body?.error || "submit failed");
  }
  const data = await res.json();
  return data.tokens;
}

export async function pollResults(
  tokens: string[],
  opts: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<Judge0SubmissionResult[]> {
  const interval = opts.intervalMs ?? 800;
  const timeout = opts.timeoutMs ?? 60000;
  const start = Date.now();

  while (true) {
    const res = await fetch(
      `/api/judge0/result?tokens=${encodeURIComponent(tokens.join(","))}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || body?.error || "poll failed");
    }
    const data = await res.json();
    const submissions: Judge0SubmissionResult[] = data.submissions ?? data;
    const allDone = submissions.every(
      (s) => s.status && s.status.id !== 1 && s.status.id !== 2
    );
    if (allDone) return submissions;
    if (Date.now() - start > timeout) {
      throw new Error("poll timeout");
    }
    await new Promise((r) => setTimeout(r, interval));
  }
}

export async function runAgainstTestcases(params: {
  sourceCode: string;
  languageId: number;
  testcases: { stdin: string; expectedStdout: string; hidden: boolean }[];
  cpuTimeLimit?: number;
  memoryLimit?: number;
}): Promise<RunOutcome> {
  const tokens = await submitBatch(params);
  const raw = await pollResults(tokens);

  const results: TestcaseResult[] = raw.map((r, i) => {
    const tc = params.testcases[i];
    const verdict = mapStatusToVerdict(r.status.id);
    return {
      index: i,
      verdict,
      hidden: tc.hidden,
      stdin: tc.hidden ? undefined : tc.stdin,
      expected: tc.hidden ? undefined : tc.expectedStdout,
      stdout: b64decode(r.stdout),
      stderr: b64decode(r.stderr),
      compileOutput: b64decode(r.compile_output),
      timeMs: r.time ? Math.round(parseFloat(r.time) * 1000) : null,
      memoryKb: r.memory ?? null,
    };
  });

  const passed = results.filter((r) => r.verdict === "AC").length;
  const total = results.length;
  const firstBad = results.find((r) => r.verdict !== "AC");
  const verdict: Verdict = firstBad ? firstBad.verdict : "AC";

  const maxTimeMs = results.reduce<number | null>(
    (m, r) => (r.timeMs != null ? Math.max(m ?? 0, r.timeMs) : m),
    null
  );
  const maxMemoryKb = results.reduce<number | null>(
    (m, r) => (r.memoryKb != null ? Math.max(m ?? 0, r.memoryKb) : m),
    null
  );

  return {
    verdict,
    passed,
    total,
    results,
    maxTimeMs,
    maxMemoryKb,
    compileOutput: firstBad?.compileOutput ?? "",
    stderr: firstBad?.stderr ?? "",
  };
}
