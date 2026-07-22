"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import QuestionForm from "./QuestionForm";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

export type QuestionRef = {
  source: "platform" | "user";
  id: string;
};

const monoFont = {
  fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
};

interface Props {
  selected: QuestionRef[];
  onChange: (refs: QuestionRef[]) => void;
}

export default function QuestionPicker({ selected, onChange }: Props) {
  const platform = useQuery(api.questions.listPlatform) ?? [];
  const mine = useQuery(api.questions.listMine) ?? [];
  const createUserQuestion = useMutation(api.questions.createUserQuestion);

  const [customOpen, setCustomOpen] = useState(false);
  const [tab, setTab] = useState<"platform" | "mine">("platform");

  const isSelected = (ref: QuestionRef) =>
    selected.some((s) => s.source === ref.source && s.id === ref.id);

  const toggle = (ref: QuestionRef) => {
    if (isSelected(ref)) {
      onChange(
        selected.filter((s) => !(s.source === ref.source && s.id === ref.id))
      );
    } else {
      onChange([...selected, ref]);
    }
  };

  const list = tab === "platform" ? platform : mine;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="mono-label">Questions</label>
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          className="text-xs uppercase tracking-[0.1em] flex items-center gap-1 border border-border px-3 py-1 hover:bg-muted"
          style={monoFont}
        >
          <PlusIcon className="h-3 w-3" /> Custom
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((ref) => {
            const all = [...platform, ...mine];
            const doc: any = all.find((q: any) => q._id === ref.id);
            const title = doc?.title ?? "(unknown)";
            return (
              <div
                key={`${ref.source}:${ref.id}`}
                className="inline-flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 text-sm"
              >
                <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground" style={monoFont}>
                  {ref.source}
                </span>
                {title}
                <button
                  onClick={() => toggle(ref)}
                  className="hover:text-destructive"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setTab("platform")}
          className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] border ${
            tab === "platform"
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:bg-muted"
          }`}
          style={monoFont}
        >
          Platform
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`px-3 py-1 text-[10px] uppercase tracking-[0.1em] border ${
            tab === "mine"
              ? "bg-foreground text-background border-foreground"
              : "border-border hover:bg-muted"
          }`}
          style={monoFont}
        >
          My Bank ({mine.length})
        </button>
      </div>

      <div className="border border-border divide-y divide-border max-h-60 overflow-y-auto">
        {list.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground" style={monoFont}>
            {tab === "platform"
              ? "No platform questions. Run seedPlatform mutation."
              : "No custom questions yet. Click Custom to add one."}
          </div>
        )}
        {list.map((q: any) => {
          const ref: QuestionRef = { source: tab === "mine" ? "user" : "platform", id: q._id };
          const active = isSelected(ref);
          return (
            <button
              key={q._id}
              type="button"
              onClick={() => toggle(ref)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted ${
                active ? "bg-muted" : ""
              }`}
            >
              <div>
                <div className="text-sm font-semibold">{q.title}</div>
                <div
                  className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
                  style={monoFont}
                >
                  {q.testcases?.length ?? 0} testcases · {q.timeLimitMs}ms
                </div>
              </div>
              {active && <CheckIcon className="h-4 w-4" />}
            </button>
          );
        })}
      </div>

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-[600px] md:min-w-[800px] h-[calc(100vh-100px)] overflow-auto">
          <DialogHeader>
            <DialogTitle
              className="text-2xl uppercase"
              style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
            >
              Custom Question
            </DialogTitle>
          </DialogHeader>
          <QuestionForm
            onCancel={() => setCustomOpen(false)}
            onSave={async (data) => {
              try {
                const id = await createUserQuestion(data);
                onChange([...selected, { source: "user", id: id as any }]);
                setTab("mine");
                setCustomOpen(false);
                toast.success("Question saved to your bank");
              } catch (e: any) {
                toast.error(e?.message ?? "Failed to save");
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
