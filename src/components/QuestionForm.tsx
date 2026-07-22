"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { PlusIcon, TrashIcon } from "lucide-react";

export interface QuestionFormData {
  title: string;
  description: string;
  constraints: string[];
  timeLimitMs: number;
  memoryLimitKb: number;
  starterCode: { javascript: string; python: string; java: string };
  examples: { input: string; output: string; explanation?: string }[];
  testcases: { stdin: string; expectedStdout: string; hidden: boolean }[];
}

const EMPTY: QuestionFormData = {
  title: "",
  description: "",
  constraints: [],
  timeLimitMs: 2000,
  memoryLimitKb: 128000,
  starterCode: { javascript: "", python: "", java: "" },
  examples: [{ input: "", output: "" }],
  testcases: [{ stdin: "", expectedStdout: "", hidden: false }],
};

const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };

interface Props {
  initial?: Partial<QuestionFormData>;
  onCancel: () => void;
  onSave: (data: QuestionFormData) => Promise<void> | void;
  submitLabel?: string;
}

export default function QuestionForm({
  initial,
  onCancel,
  onSave,
  submitLabel = "Save Question",
}: Props) {
  const [data, setData] = useState<QuestionFormData>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"javascript" | "python" | "java">("javascript");

  const update = <K extends keyof QuestionFormData>(
    key: K,
    value: QuestionFormData[K]
  ) => setData((d) => ({ ...d, [key]: value }));

  const submit = async () => {
    if (!data.title.trim() || !data.description.trim()) return;
    if (data.testcases.length === 0) return;
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="mono-label">Title</label>
          <Input
            placeholder="Custom question title"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="mono-label">Description</label>
          <Textarea
            placeholder="Describe the problem. Include input/output format."
            rows={5}
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="mono-label">Time Limit (ms)</label>
            <Input
              type="number"
              min={100}
              max={15000}
              value={data.timeLimitMs}
              onChange={(e) => update("timeLimitMs", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="mono-label">Memory Limit (KB)</label>
            <Input
              type="number"
              min={16000}
              max={512000}
              value={data.memoryLimitKb}
              onChange={(e) => update("memoryLimitKb", Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="mono-label">Constraints</label>
          <button
            type="button"
            onClick={() =>
              update("constraints", [...data.constraints, ""])
            }
            className="text-xs uppercase tracking-[0.1em] flex items-center gap-1"
            style={monoFont}
          >
            <PlusIcon className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {data.constraints.map((c, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={c}
                placeholder="e.g. 1 <= n <= 10^5"
                onChange={(e) => {
                  const next = [...data.constraints];
                  next[i] = e.target.value;
                  update("constraints", next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  update(
                    "constraints",
                    data.constraints.filter((_, j) => j !== i)
                  )
                }
                className="h-9 w-9 border border-border flex items-center justify-center hover:bg-muted"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Starter code */}
      <div className="space-y-2">
        <label className="mono-label">Starter Code</label>
        <div className="flex gap-1">
          {(["javascript", "python", "java"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] border ${
                lang === l
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:bg-muted"
              }`}
              style={monoFont}
            >
              {l}
            </button>
          ))}
        </div>
        <Textarea
          rows={8}
          value={data.starterCode[lang]}
          onChange={(e) =>
            update("starterCode", {
              ...data.starterCode,
              [lang]: e.target.value,
            })
          }
          placeholder={`${lang} starter (read stdin, print stdout)`}
          style={monoFont}
        />
      </div>

      {/* Examples */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="mono-label">Visible Examples</label>
          <button
            type="button"
            onClick={() =>
              update("examples", [...data.examples, { input: "", output: "" }])
            }
            className="text-xs uppercase tracking-[0.1em] flex items-center gap-1"
            style={monoFont}
          >
            <PlusIcon className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {data.examples.map((ex, i) => (
            <div key={i} className="border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="mono-label">Example {i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    update(
                      "examples",
                      data.examples.filter((_, j) => j !== i)
                    )
                  }
                  className="h-7 w-7 flex items-center justify-center hover:bg-muted"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
              <Input
                placeholder="Input label"
                value={ex.input}
                onChange={(e) => {
                  const next = [...data.examples];
                  next[i] = { ...next[i], input: e.target.value };
                  update("examples", next);
                }}
              />
              <Input
                placeholder="Output label"
                value={ex.output}
                onChange={(e) => {
                  const next = [...data.examples];
                  next[i] = { ...next[i], output: e.target.value };
                  update("examples", next);
                }}
              />
              <Input
                placeholder="Explanation (optional)"
                value={ex.explanation ?? ""}
                onChange={(e) => {
                  const next = [...data.examples];
                  next[i] = { ...next[i], explanation: e.target.value };
                  update("examples", next);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Testcases */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="mono-label">Testcases (run by Judge0)</label>
          <button
            type="button"
            onClick={() =>
              update("testcases", [
                ...data.testcases,
                { stdin: "", expectedStdout: "", hidden: true },
              ])
            }
            className="text-xs uppercase tracking-[0.1em] flex items-center gap-1"
            style={monoFont}
          >
            <PlusIcon className="h-3 w-3" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {data.testcases.map((tc, i) => (
            <div key={i} className="border border-border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="mono-label">Test {i + 1}</span>
                <div className="flex items-center gap-3">
                  <label
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em]"
                    style={monoFont}
                  >
                    <input
                      type="checkbox"
                      checked={tc.hidden}
                      onChange={(e) => {
                        const next = [...data.testcases];
                        next[i] = { ...next[i], hidden: e.target.checked };
                        update("testcases", next);
                      }}
                    />
                    Hidden
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "testcases",
                        data.testcases.filter((_, j) => j !== i)
                      )
                    }
                    className="h-7 w-7 flex items-center justify-center hover:bg-muted"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <Textarea
                rows={3}
                placeholder="stdin"
                value={tc.stdin}
                onChange={(e) => {
                  const next = [...data.testcases];
                  next[i] = { ...next[i], stdin: e.target.value };
                  update("testcases", next);
                }}
                style={monoFont}
              />
              <Textarea
                rows={3}
                placeholder="expected stdout"
                value={tc.expectedStdout}
                onChange={(e) => {
                  const next = [...data.testcases];
                  next[i] = { ...next[i], expectedStdout: e.target.value };
                  update("testcases", next);
                }}
                style={monoFont}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onCancel}
          className="h-10 px-6 border border-border bg-background text-xs font-bold uppercase tracking-[0.1em] hover:bg-muted"
          style={monoFont}
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="h-10 px-6 bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50"
          style={monoFont}
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
