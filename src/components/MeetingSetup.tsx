import { DeviceSettings, useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CameraIcon, MicIcon, SettingsIcon, ArrowRightIcon } from "lucide-react";
import { Switch } from "./ui/switch";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);

  const call = useCall();

  if (!call) return null;

  useEffect(() => {
    if (isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  }, [isCameraDisabled, call.camera]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handleJoin = async () => {
    await call.join();
    onSetupComplete();
  };

  const monoFont = { fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" };
  const antonFont = { fontFamily: "var(--font-anton, 'Anton', sans-serif)" };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="app-noise-overlay" />
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border overflow-hidden">
          {/* VIDEO PREVIEW */}
          <div className="md:col-span-1 flex flex-col bg-card">
            <div className="p-5 border-b border-border">
              <h1
                className="text-2xl uppercase"
                style={antonFont}
              >
                Camera Preview
              </h1>
              <p className="mono-label mt-1">Make sure you look good</p>
            </div>

            <div className="flex-1 min-h-[400px] bg-muted relative">
              <div className="absolute inset-0">
                <VideoPreview className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="md:col-span-1 flex flex-col border-l border-border">
            <div className="p-5 border-b border-border">
              <h2
                className="text-2xl uppercase"
                style={antonFont}
              >
                Meeting Details
              </h2>
              <p
                className="text-xs tracking-[0.05em] text-muted-foreground break-all mt-1"
                style={monoFont}
              >
                {call.id}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-between p-5">
              <div className="space-y-5">
                {/* Camera control */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 border border-border flex items-center justify-center">
                      <CameraIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Camera</p>
                      <p className={`mono-label ${isCameraDisabled ? "!text-red" : "!text-emerald"}`}>
                        {isCameraDisabled ? "● Disabled" : "● Enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isCameraDisabled}
                    onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                  />
                </div>

                {/* Mic control */}
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 border border-border flex items-center justify-center">
                      <MicIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Microphone</p>
                      <p className={`mono-label ${isMicDisabled ? "!text-red" : "!text-emerald"}`}>
                        {isMicDisabled ? "● Disabled" : "● Enabled"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={!isMicDisabled}
                    onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                  />
                </div>

                {/* Device settings */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 border border-border flex items-center justify-center">
                      <SettingsIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Settings</p>
                      <p className="mono-label">Configure devices</p>
                    </div>
                  </div>
                  <DeviceSettings />
                </div>
              </div>

              {/* Join button */}
              <div className="space-y-3 mt-8">
                <button
                  className="w-full h-12 bg-emerald text-emerald-foreground text-xs font-bold uppercase tracking-[0.12em] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                  style={monoFont}
                  onClick={handleJoin}
                >
                  Join Meeting
                  <ArrowRightIcon className="size-3.5" />
                </button>
                <p
                  className="text-center mono-label"
                >
                  Do not worry, our team is super friendly! We want you to succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MeetingSetup;
