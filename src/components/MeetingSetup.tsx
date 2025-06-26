'use client';

import { useCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const MeetingSetup = ({ onSetupComplete }: { onSetupComplete: () => void }) => {
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [isMicDisabled, setIsMicDisabled] = useState(false);

  const call = useCall();

  if(!call) return null;

  useEffect(()=>{
    if(isCameraDisabled) call.camera.disable();
    else call.camera.enable();
  },[isCameraDisabled]);

  useEffect(() => {
    if (isMicDisabled) call.microphone.disable();
    else call.microphone.enable();
  }, [isMicDisabled, call.microphone]);

  const handlejoin = async () =>{
    await call.join();
    onSetupComplete();
  }


  return <div></div>;
};

export default MeetingSetup;
