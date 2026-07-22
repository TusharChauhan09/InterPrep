"use client";

import { RunOutcome, TestcaseResult } from "@/lib/runJudge0";
import { VERDICT_LABEL, Verdict } from "@/lib/judge0";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  CpuIcon,
  Loader2Icon,
  AlertTriangleIcon,
} from "lucide-react";

const monoFont = {
  fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
};

const VERDICT_COLOR: Record<Verdict, string> = {
  AC: "text-emerald",
  WA: "text-red",
  TLE: "text-amber-500",
  MLE: "text-amber-500",
  CE: "text-red",
  RE: "text-red",
  IE: "text-red",
  PENDING: "text-muted-foreground",
};

interface Props {
  running: boolean;
  mode: "idle" | "run" | "submit";
  outcome: RunOutcome | null;
  error: string | null;
}

export default function SubmissionPanel({ running, mode, outcome, error }: Props) {
  if (running) {
    return (
      <div className="border border-border p-5 flex items-center gap-3">
        <Loader2Icon className="h-4 w-4 animate-spin" />
        <span className="mono-label">
          {mode === "submit" ? "Submitting..." : "Running..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red/30 bg-red/5 p-5 space-y-2">
        <div className="flex items-center gap-2 text-red">
          <AlertTriangleIcon className="h-4 w-4" />
          <span className="mono-label !text-red">Error</span>
        </div>
        <pre className="text-xs whitespace-pre-wrap" style={monoFont}>
          {error}
        </pre>
      </div>
    );
  }

  if (!outcome) {
    return (
      <div className="border border-border p-5">
        <p className="mono-label">Press Run to test visible cases. Submit to judge all.</p>
      </div>
    );
  }

  const { verdict, passed, total, results, maxTimeMs, maxMemoryKb, compileOutput, stderr } = outcome;

  return (
    <div className="border border-border">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-card flex flex-wrap items-center gap-4">
        <div>
          <div
            className={`text-2xl uppercase ${VERDICT_COLOR[verdict]}`}
            style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
          >
            {VERDICT_LABEL[verdict]}
          </div>
          <div className="mono-label">
            {passed} / {total} testcases passed
          </div>
        </div>
        <div className="ml-auto flex items-center gap-5 text-sm" style={monoFont}>
          {maxTimeMs != null && (
            <div className="flex items-center gap-1.5">
              <ClockIcon className="h-3.5 w-3.5" />
              {maxTimeMs}ms
            </div>
          )}
          {maxMemoryKb != null && (
            <div className="flex items-center gap-1.5">
              <CpuIcon className="h-3.5 w-3.5" />
              {Math.round(maxMemoryKb)}KB
            </div>
          )}
        </div>
      </div>

      {/* Compile / stderr */}
      {(compileOutput || stderr) && (
        <div className="px-5 py-3 border-b border-border bg-red/5">
          {compileOutput && (
            <details open>
              <summary className="mono-label !text-red cursor-pointer">Compile Output</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap" style={monoFont}>
                {compileOutput}
              </pre>
            </details>
          )}
          {stderr && (
            <details open>
              <summary className="mono-label !text-red cursor-pointer">Stderr</summary>
              <pre className="text-xs mt-2 whitespace-pre-wrap" style={monoFont}>
                {stderr}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Per-testcase */}
      <div className="divide-y divide-border">
        {results.map((r) => (
          <TestcaseRow key={r.index} r={r} />
        ))}
      </div>
    </div>
  );
}

function TestcaseRow({ r }: { r: TestcaseResult }) {
  const ok = r.verdict === "AC";
  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {ok ? (
            <CheckCircle2Icon className="h-4 w-4 text-emerald" />
          ) : (
            <XCircleIcon className={`h-4 w-4 ${VERDICT_COLOR[r.verdict]}`} />
          )}
          <span className="text-sm font-semibold">
            {r.hidden ? `Hidden #${r.index + 1}` : `Test #${r.index + 1}`}
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.1em] ${VERDICT_COLOR[r.verdict]}`}
            style={monoFont}
          >
            {VERDICT_LABEL[r.verdict]}
          </span>
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          style={monoFont}
        >
          {r.timeMs != null && `${r.timeMs}ms · `}
          {r.memoryKb != null && `${Math.round(r.memoryKb)}KB`}
        </div>
      </div>

      {!r.hidden && !ok && (
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <Block label="Input" value={r.stdin ?? ""} />
          <Block label="Expected" value={r.expected ?? ""} />
          <Block label="Got" value={r.stdout} accent={!ok} />
        </div>
      )}
    </div>
  );
}

function Block({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="mono-label mb-1">{label}</div>
      <pre
        className={`bg-muted p-2 whitespace-pre-wrap border border-border ${
          accent ? "!border-red/40" : ""
        }`}
        style={monoFont}
      >
        {value || "(empty)"}
      </pre>
    </div>
  );
}
