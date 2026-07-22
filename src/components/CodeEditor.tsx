"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertCircleIcon,
  BookIcon,
  LightbulbIcon,
  PlayIcon,
  SendIcon,
  Loader2Icon,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMedia } from "use-media";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  JUDGE0_LANGUAGE_IDS,
  LANGUAGES,
  SupportedLanguage,
} from "@/lib/judge0";
import { runAgainstTestcases, RunOutcome } from "@/lib/runJudge0";
import SubmissionPanel from "./SubmissionPanel";
import toast from "react-hot-toast";

interface Props {
  interviewId?: Id<"interviews">;
}

interface LoadedQuestion {
  _id: string;
  source: "platform" | "user";
  title: string;
  description: string;
  constraints?: string[];
  timeLimitMs: number;
  memoryLimitKb: number;
  starterCode: { javascript: string; python: string; java: string };
  examples: { input: string; output: string; explanation?: string }[];
  testcases: { stdin: string; expectedStdout: string; hidden: boolean }[];
}

const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };
const antonFont = { fontFamily: "var(--font-anton, 'Anton', sans-serif)" };

const CodeEditor = ({ interviewId }: Props) => {
  const isSmallScreen = useMedia({ maxWidth: 640 });

  const platformList = useQuery(api.questions.listPlatform) ?? [];
  const mineList = useQuery(api.questions.listMine) ?? [];
  const allInterviews = useQuery(api.interviews.getAllInterviews);

  const currentInterview = useMemo(() => {
    if (!interviewId || !allInterviews) return null;
    return allInterviews.find((i) => i._id === interviewId) ?? null;
  }, [interviewId, allInterviews]);

  const assignedQuestions: LoadedQuestion[] = useMemo(() => {
    const refs = currentInterview?.questions ?? [];
    const resolved: LoadedQuestion[] = [];
    for (const ref of refs) {
      const src = ref.source === "platform" ? platformList : mineList;
      const doc: any = src.find((q: any) => q._id === ref.id);
      if (doc) {
        resolved.push({
          _id: doc._id,
          source: ref.source,
          title: doc.title,
          description: doc.description,
          constraints: doc.constraints,
          timeLimitMs: doc.timeLimitMs,
          memoryLimitKb: doc.memoryLimitKb,
          starterCode: doc.starterCode,
          examples: doc.examples ?? [],
          testcases: doc.testcases ?? [],
        });
      }
    }
    return resolved;
  }, [currentInterview, platformList, mineList]);

  const fallbackQuestions: LoadedQuestion[] = useMemo(() => {
    return platformList.map((q: any) => ({
      _id: q._id,
      source: "platform" as const,
      title: q.title,
      description: q.description,
      constraints: q.constraints,
      timeLimitMs: q.timeLimitMs,
      memoryLimitKb: q.memoryLimitKb,
      starterCode: q.starterCode,
      examples: q.examples ?? [],
      testcases: q.testcases ?? [],
    }));
  }, [platformList]);

  const questions = assignedQuestions.length > 0 ? assignedQuestions : fallbackQuestions;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState("");

  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"idle" | "run" | "submit">("idle");
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected =
    questions.find((q) => q._id === selectedId) ?? questions[0] ?? null;

  useEffect(() => {
    if (!selected) return;
    if (!selectedId) setSelectedId(selected._id);
    setCode(selected.starterCode[language] ?? "");
    setOutcome(null);
    setError(null);
  }, [selected?._id, language]);

  const createSubmission = useMutation(api.submissions.create);

  const handleRun = async () => {
    if (!selected) return;
    setRunning(true);
    setMode("run");
    setError(null);
    setOutcome(null);
    try {
      const visible = selected.testcases.filter((t) => !t.hidden);
      if (visible.length === 0) {
        toast.error("No visible testcases to run");
        setRunning(false);
        return;
      }
      const result = await runAgainstTestcases({
        sourceCode: code,
        languageId: JUDGE0_LANGUAGE_IDS[language],
        testcases: visible,
        cpuTimeLimit: selected.timeLimitMs / 1000,
        memoryLimit: selected.memoryLimitKb,
      });
      setOutcome(result);
    } catch (e: any) {
      setError(e?.message ?? "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setRunning(true);
    setMode("submit");
    setError(null);
    setOutcome(null);
    try {
      const result = await runAgainstTestcases({
        sourceCode: code,
        languageId: JUDGE0_LANGUAGE_IDS[language],
        testcases: selected.testcases,
        cpuTimeLimit: selected.timeLimitMs / 1000,
        memoryLimit: selected.memoryLimitKb,
      });
      setOutcome(result);

      if (interviewId) {
        try {
          await createSubmission({
            interviewId,
            questionRef: { source: selected.source, id: selected._id },
            language,
            code,
            verdict: result.verdict,
            passed: result.passed,
            total: result.total,
            runtimeMs: result.maxTimeMs ?? undefined,
            memoryKb: result.maxMemoryKb ?? undefined,
            compileOutput: result.compileOutput || undefined,
            stderr: result.stderr || undefined,
          });
        } catch (e) {
          console.error("persist submission failed", e);
        }
      }

      if (result.verdict === "AC") {
        toast.success(`Accepted — ${result.passed}/${result.total}`);
      } else {
        toast.error(`${result.verdict} — ${result.passed}/${result.total}`);
      }
    } catch (e: any) {
      setError(e?.message ?? "Submit failed");
    } finally {
      setRunning(false);
    }
  };

  if (!selected) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="mono-label">
          {platformList.length === 0
            ? "No questions available. Seed the platform question bank."
            : "Loading question..."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResizablePanelGroup direction={isSmallScreen ? "vertical" : "horizontal"}>
        <ResizablePanel
          defaultSize={45}
          minSize={30}
          maxSize={100}
          className="relative"
        >
          <ScrollArea className="h-full">
            <div className="h-full min-h-0 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-3xl uppercase leading-tight" style={antonFont}>
                      {selected.title}
                    </h2>
                    <p className="mono-label">
                      {selected.source === "user" ? "Custom question" : "Platform question"} ·{" "}
                      {selected.testcases.length} testcases
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={selected._id}
                      onValueChange={(id) => setSelectedId(id)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select question" />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((q) => (
                          <SelectItem key={q._id} value={q._id}>
                            {q.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={language}
                      onValueChange={(v) => setLanguage(v as SupportedLanguage)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${language}.png`}
                              alt={language}
                              className="w-5 h-5 object-contain"
                            />
                            {LANGUAGES.find((l) => l.id === language)?.name}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={`/${lang.id}.png`}
                                alt={lang.name}
                                className="w-5 h-5 object-contain"
                              />
                              {lang.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* PROBLEM DESC */}
                <div className="border border-border">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                    <BookIcon className="h-4 w-4" />
                    <span className="mono-label">Problem Description</span>
                  </div>
                  <div className="px-5 py-4 text-sm leading-relaxed">
                    <p className="whitespace-pre-line">{selected.description}</p>
                  </div>
                </div>

                {/* EXAMPLES */}
                {selected.examples.length > 0 && (
                  <div className="border border-border">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                      <LightbulbIcon className="h-4 w-4" />
                      <span className="mono-label">Examples</span>
                    </div>
                    <div className="px-5 py-4">
                      <div className="space-y-4">
                        {selected.examples.map((example, index) => (
                          <div key={index} className="space-y-2">
                            <p
                              className="text-xs font-bold uppercase tracking-[0.1em]"
                              style={monoFont}
                            >
                              Example {index + 1}:
                            </p>
                            <pre
                              className="bg-muted p-3 text-sm whitespace-pre-wrap border border-border"
                              style={monoFont}
                            >
                              <div>Input: {example.input}</div>
                              <div>Output: {example.output}</div>
                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">
                                  Explanation: {example.explanation}
                                </div>
                              )}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* CONSTRAINTS */}
                {selected.constraints && selected.constraints.length > 0 && (
                  <div className="border border-border">
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card">
                      <AlertCircleIcon className="h-4 w-4" />
                      <span className="mono-label">Constraints</span>
                    </div>
                    <div className="px-5 py-4">
                      <ul className="space-y-1.5">
                        {selected.constraints.map((constraint, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-foreground/30 mt-0.5">-</span>
                            <span style={monoFont}>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* LIMITS */}
                <div className="flex gap-4 text-xs" style={monoFont}>
                  <span className="mono-label">TL: {selected.timeLimitMs}ms</span>
                  <span className="mono-label">ML: {selected.memoryLimitKb}KB</span>
                </div>

                {/* RESULT */}
                <SubmissionPanel
                  running={running}
                  mode={mode}
                  outcome={outcome}
                  error={error}
                />
              </div>
            </div>
            <ScrollBar />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={55}
          minSize={35}
          className="border border-border m-1 bg-[#0A0A0A] overflow-hidden flex flex-col"
        >
          {/* Editor header */}
          <div className="h-10 border-b border-[#222] bg-[#0A0A0A] flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <div className="w-2 h-2 rounded-full bg-[#333]" />
            <span
              className="ml-3 text-[10px] uppercase tracking-[0.1em] text-[#555]"
              style={monoFont}
            >
              {selected.title}.
              {language === "javascript" ? "js" : language === "python" ? "py" : "java"}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="h-7 px-3 bg-transparent border border-[#333] text-[#ddd] text-[10px] uppercase tracking-[0.12em] hover:bg-[#1a1a1a] disabled:opacity-50 flex items-center gap-1.5"
                style={monoFont}
              >
                {running && mode === "run" ? (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                ) : (
                  <PlayIcon className="h-3 w-3" />
                )}
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="h-7 px-3 bg-emerald text-emerald-foreground text-[10px] uppercase tracking-[0.12em] hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                style={monoFont}
              >
                {running && mode === "submit" ? (
                  <Loader2Icon className="h-3 w-3 animate-spin" />
                ) : (
                  <SendIcon className="h-3 w-3" />
                )}
                Submit
              </button>
            </div>
          </div>
          <Editor
            height="calc(100% - 40px)"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
              fontFamily: "'Space Mono', monospace",
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
