"use client";

import { QuickActionType } from "@/constants";

const accentMap: Record<string, string> = {
  emerald: "bg-emerald",
  blue: "bg-blue",
  amber: "bg-amber",
  red: "bg-red",
};

const accentIconMap: Record<string, string> = {
  emerald: "text-emerald",
  blue: "text-blue",
  amber: "text-amber",
  red: "text-red",
};

export function ActionCard({ action, onClick }: { action: QuickActionType; onClick: () => void }) {
  const accent = action.accent || "emerald";

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col justify-between p-6 h-[220px] border border-border bg-card hover:bg-foreground hover:text-background transition-all duration-500 cursor-pointer text-left overflow-hidden"
      style={{ transition: "all 0.5s cubic-bezier(0.19, 1, 0.22, 1)" }}
    >
      {/* Top: Icon + Accent dot */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          <action.icon className={`size-5 ${accentIconMap[accent]} group-hover:text-background/60 transition-colors duration-500`} />
        </div>
        <span
          className="text-xs uppercase tracking-[0.15em] text-muted-foreground group-hover:text-background/40 transition-colors duration-500"
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
        >
          Action
        </span>
      </div>

      {/* Bottom: Title + Description */}
      <div>
        <h3
          className="text-2xl uppercase leading-none mb-2 group-hover:text-background transition-colors duration-500"
          style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
        >
          {action.title}
        </h3>
        <p
          className="text-xs tracking-[0.05em] text-muted-foreground group-hover:text-background/60 transition-colors duration-500"
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
        >
          {action.description}
        </p>
      </div>

      {/* Hover line accent - uses the action's accent color */}
      <div className={`absolute bottom-0 left-0 w-full h-[3px] ${accentMap[accent]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </button>
  );
}
