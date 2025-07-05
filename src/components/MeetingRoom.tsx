'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "./ui/resizable";
import CodeEditor from "./CodeEditor";
import FloatingVideo from 
"./FloatingVideo";
import { CallingState, useCallStateHooks } from "@stream-io/video-react-sdk";
import { LoaderIcon } from "lucide-react";


function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [showParticipants, setShowParticipants] = useState(false);

  //
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if( callingState !== CallingState.JOINED){
    return (
    <div className="h-[calc(100vh-4rem-1px)] flex items-center justify-center">
      <LoaderIcon className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
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
      <CodeEditor />
    </div>
  );
}

export default MeetingRoom;
