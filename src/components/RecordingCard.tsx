import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://" + recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown duration";

  return (
    <div className="group border border-border bg-card hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Video thumbnail */}
      <div
        className="w-full aspect-video bg-muted flex items-center justify-center cursor-pointer relative"
        onClick={() => window.open(recording.url, "_blank")}
      >
        <div className="size-14 border-2 border-foreground/20 group-hover:border-foreground flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <PlayIcon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
        </div>
        {/* Duration overlay */}
        <span
          className="absolute bottom-2 right-2 text-[10px] uppercase tracking-[0.1em] bg-background/90 px-2 py-0.5 border border-border"
          style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
        >
          {duration}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <div
            className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
          >
            <CalendarIcon className="h-3 w-3" />
            <span>{formattedStartTime}</span>
          </div>
          <div
            className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted-foreground"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
          >
            <ClockIcon className="h-3 w-3" />
            <span>{duration}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 h-9 bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
            onClick={() => window.open(recording.url, "_blank")}
          >
            <PlayIcon className="size-3" />
            Play
          </button>
          <button
            className="h-9 w-9 border border-border bg-background hover:bg-foreground hover:text-background transition-all flex items-center justify-center cursor-pointer"
            onClick={handleCopyLink}
          >
            <CopyIcon className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default RecordingCard;
