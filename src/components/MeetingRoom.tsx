'use client'
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import CodeEditor from "./CodeEditor";
import FloatingVideo from "./FloatingVideo";
import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import LoaderUI from "./LoaderUI";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


function MeetingRoom() {
  const router = useRouter();
  const params = useParams();
  const streamCallId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : undefined;

  const interview = useQuery(
    api.interviews.getInterviewByStreamCallId,
    streamCallId ? { streamCallId } : "skip"
  );

  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return <LoaderUI />;
  }

  return (
    <div className="h-[calc(100vh-5rem)] relative overflow-y-hidden  ">
      <div className="absolute w-full bottom-10 z-10">
          <FloatingVideo
            layout={layout}
            setLayout={setLayout}
            showParticipants={showParticipants}
            setShowParticipants={setShowParticipants}
            router={router}
          />
      </div>
      <CodeEditor interviewId={interview?._id} />
    </div>
  );
}

export default MeetingRoom;
