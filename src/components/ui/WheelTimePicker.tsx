"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface WheelColumnProps {
  values: string[];
  value: number;
  onChange: (index: number) => void;
  label?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE = 5;

function WheelColumn({ values, value, onChange, label }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const [offset, setOffset] = useState(-value * ITEM_HEIGHT);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!draggingRef.current) {
      setOffset(-value * ITEM_HEIGHT);
    }
  }, [value]);

  const clampIndex = (i: number) =>
    Math.max(0, Math.min(values.length - 1, i));

  const snap = (rawOffset: number) => {
    const rawIndex = Math.round(-rawOffset / ITEM_HEIGHT);
    const idx = clampIndex(rawIndex);
    setOffset(-idx * ITEM_HEIGHT);
    if (idx !== value) onChange(idx);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    startYRef.current = e.clientY;
    startOffsetRef.current = offset;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    const max = 0;
    const min = -(values.length - 1) * ITEM_HEIGHT;
    const next = Math.max(min, Math.min(max, startOffsetRef.current + delta));
    setOffset(next);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    snap(offset);
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const step = e.deltaY > 0 ? 1 : -1;
    const next = clampIndex(value + step);
    if (next !== value) onChange(next);
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => {}, 100);
  };

  return (
    <div className="flex flex-col items-center select-none">
      {label && (
        <span
          className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2"
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
        >
          {label}
        </span>
      )}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        className="relative w-20 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
        style={{ height: ITEM_HEIGHT * VISIBLE }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to bottom, var(--background) 0%, transparent 30%, transparent 70%, var(--background) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute left-0 right-0 z-10 border-y border-border"
          style={{
            top: ITEM_HEIGHT * Math.floor(VISIBLE / 2),
            height: ITEM_HEIGHT,
          }}
        />
        <ul
          className="absolute left-0 right-0"
          style={{
            top: ITEM_HEIGHT * Math.floor(VISIBLE / 2),
            transform: `translateY(${offset}px)`,
            transition: draggingRef.current ? "none" : "transform 150ms ease-out",
          }}
        >
          {values.map((v, i) => {
            const distance = Math.abs(i - value);
            const opacity = distance === 0 ? 1 : distance === 1 ? 0.55 : 0.25;
            return (
              <li
                key={v}
                onClick={() => onChange(i)}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  height: ITEM_HEIGHT,
                  fontFamily:
                    "var(--font-space-mono, 'Space Mono', monospace)",
                  fontSize: 22,
                  fontWeight: 700,
                  opacity,
                }}
              >
                {v}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

interface WheelTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function WheelTimePicker({
  value,
  onChange,
  className,
}: WheelTimePickerProps) {
  const [hh, mm] = value.split(":").map((x) => parseInt(x, 10));
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const mins = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const emit = (h: number, m: number) => {
    onChange(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 border border-border bg-card p-4",
        className
      )}
    >
      <WheelColumn
        label="HH"
        values={hours}
        value={isNaN(hh) ? 9 : hh}
        onChange={(i) => emit(i, isNaN(mm) ? 0 : mm)}
      />
      <span
        className="text-2xl font-bold"
        style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
      >
        :
      </span>
      <WheelColumn
        label="MM"
        values={mins}
        value={isNaN(mm) ? 0 : mm}
        onChange={(i) => emit(isNaN(hh) ? 9 : hh, i)}
      />
    </div>
  );
}
