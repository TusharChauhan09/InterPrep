'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "./ui/resizable";
// import CodeEditor from "./CodeEditor";
import FloatingVideo from "./FloatingVideo";

function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<"grid" | "speaker">("grid");
  const [showParticipants, setShowParticipants] = useState(false);

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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={25} maxSize={100} className="relative">
          {/* VIDEO LAYOUT & CONTROLS */}hrsf
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={25}>
          {/* <CodeEditor /> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MeetingRoom;
