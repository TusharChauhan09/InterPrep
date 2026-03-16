import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowRightIcon, ClockIcon, CheckCircle2Icon } from "lucide-react";

type Interview = Doc<"interviews">;

export default function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const status = getMeetingStatus(interview);
  const formattedDate = format(
    new Date(interview.startTime),
    "EEEE, MMMM d · h:mm a"
  );

  return (
    <div className="group border border-border bg-card hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Status bar */}
      <div className={`h-[3px] w-full ${status === "live" ? "bg-emerald" : status === "upcoming" ? "bg-amber" : "bg-border"}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Top row: date + status */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
          >
            <CalendarIcon className="h-3 w-3" />
            {formattedDate}
          </div>

          <span
            className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 font-bold ${
              status === "live"
                ? "bg-emerald text-emerald-foreground"
                : status === "upcoming"
                  ? "bg-amber text-amber-foreground"
                  : "border border-border text-muted-foreground"
            }`}
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
          >
            {status === "live" ? "● Live" : status === "upcoming" ? "Upcoming" : "Done"}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-xl uppercase leading-tight mb-4"
          style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
        >
          {interview.title}
        </h3>

        {/* Action */}
        <div className="mt-auto">
          {status === "live" && (
            <button
              onClick={() => joinMeeting(interview.streamCallId)}
              className="w-full h-10 bg-emerald text-emerald-foreground text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
            >
              Join Meeting
              <ArrowRightIcon className="size-3" />
            </button>
          )}

          {status === "upcoming" && (
            <div
              className="w-full h-10 border border-amber/30 bg-amber/5 text-xs uppercase tracking-[0.1em] text-amber flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
            >
              <ClockIcon className="size-3" />
              Waiting to Start
            </div>
          )}

          {status === "completed" && (
            <div
              className="w-full h-10 border border-border text-xs uppercase tracking-[0.1em] text-muted-foreground flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
            >
              <CheckCircle2Icon className="size-3" />
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
