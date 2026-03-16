"use client";

import LoaderUI from "@/components/LoaderUI";
import RecordingCard from "@/components/RecordingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

function RecordingsPage() {
  const { calls, isLoading } = useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls) return;

      try {
        const callData = await Promise.all(calls.map((call) => call.queryRecordings()));
        const allRecordings = callData.flatMap((call) => call.recordings);

        setRecordings(allRecordings);
      } catch (error) {
        console.log("Error fetching recordings:", error);
      }
    };

    fetchRecordings();
  }, [calls]);

  if (isLoading) return <LoaderUI />;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <div className="app-noise-overlay" />

      {/* HEADER */}
      <div className="app-page-header">
        <h1>Recordings</h1>
        <p>
          {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
        </p>
      </div>

      {/* RECORDINGS GRID */}
      <ScrollArea className="h-[calc(100vh-14rem)]">
        {recordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
            {recordings.map((r) => (
              <RecordingCard key={r.end_time} recording={r} />
            ))}
          </div>
        ) : (
          <div className="app-empty-state">
            <p>No recordings available</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
export default RecordingsPage;
