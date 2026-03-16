"use client";

import { Toaster, ToastBar, toast } from "react-hot-toast";
import { CheckCircle2Icon, XCircleIcon, XIcon } from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0",
          padding: "0",
          maxWidth: "420px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          fontFamily: "var(--font-space-mono, 'Space Mono', monospace)",
          fontSize: "0.75rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
        },
        success: {
          style: {
            borderLeft: "3px solid var(--emerald)",
          },
        },
        error: {
          style: {
            borderLeft: "3px solid var(--red)",
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t} style={{ padding: 0, ...t.style }}>
          {({ message }) => (
            <div className="flex items-center gap-3 px-4 py-3 w-full">
              {/* Icon */}
              {t.type === "success" && (
                <div className="flex-shrink-0 h-7 w-7 bg-emerald/10 border border-emerald/30 flex items-center justify-center">
                  <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald" />
                </div>
              )}
              {t.type === "error" && (
                <div className="flex-shrink-0 h-7 w-7 bg-red/10 border border-red/30 flex items-center justify-center">
                  <XCircleIcon className="h-3.5 w-3.5 text-red" />
                </div>
              )}

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] leading-tight">
                  {t.type === "success" ? "Success" : t.type === "error" ? "Error" : "Info"}
                </p>
                <div className="text-[11px] tracking-[0.05em] text-muted-foreground mt-0.5 normal-case leading-snug">
                  {message}
                </div>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 h-6 w-6 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all cursor-pointer"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
