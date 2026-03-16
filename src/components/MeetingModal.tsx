import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

import useMeetingActions from "@/hooks/useMeetingActions";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isJoinMeeting: boolean;
}

function MeetingModal({
  isOpen,
  onClose,
  title,
  isJoinMeeting,
}: MeetingModalProps) {
  const [meetingUrl, setMeetingUrl] = useState("");

  const { createInstantMeeting, joinMeeting } = useMeetingActions();

  const handleStart = () => {
    if (isJoinMeeting) {
      const meetingId = meetingUrl.split("/").pop();
      if (meetingUrl) joinMeeting(meetingId!);
    } else {
      createInstantMeeting();
    }

    setMeetingUrl("");
    onClose();
  };

  const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle
            className="text-2xl uppercase"
            style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {isJoinMeeting && (
            <div className="space-y-2">
              <label className="mono-label">Meeting Link</label>
              <Input
                placeholder="Paste meeting link here..."
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              className="h-10 px-5 border border-border bg-background text-xs font-bold uppercase tracking-[0.1em] hover:bg-muted transition-colors cursor-pointer"
              style={monoFont}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="h-10 px-5 bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              style={monoFont}
              onClick={handleStart}
              disabled={isJoinMeeting && !meetingUrl.trim()}
            >
              {isJoinMeeting ? "Join Meeting" : "Start Meeting"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default MeetingModal;
