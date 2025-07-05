import * as motion from "motion/react-client";
import { LayoutListIcon, UsersIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  CallControls,
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
} from "@stream-io/video-react-sdk";
import EndCallButton from "./EndCallButton";

interface FloatingVideoProps {
  layout: "grid" | "speaker";
  setLayout: React.Dispatch<React.SetStateAction<"grid" | "speaker">>;
  showParticipants: boolean;
  setShowParticipants: React.Dispatch<React.SetStateAction<boolean>>;
  router: any; // Adjust type as necessary
}

const FloatingVideo: React.FC<FloatingVideoProps> = ({
  layout,
  setLayout,
  showParticipants,
  setShowParticipants,
  router,
}) => {
  return (
    <motion.div 
    className={`relative w-[370px] ${layout === 'speaker' ? 'h-[500px]' : 'h-[350px]'} border-2 rounded-2xl py-1 px-1`}
    animate={{
        scale:0.7
      }}
      drag
      dragElastic={0.1}
      dragMomentum={false}
      dragConstraints={{ top: -320, left: -55, right: 1100, bottom: 60 }}
      whileDrag={{
        scale: 0.5,
        backgroundColor: "black",
      }}
      transition={{
        type: "spring",
        stiffness: 50,
      }}
    >
      {/* VIDEO LAYOUT */}
      {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

      {/* PARTICIPANTS LIST OVERLAY */}
      {showParticipants && (
        <div
          className="absolute border-2 m-2 rounded-md z-20 p-3 right-0 top-0 h-[2/3] w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag interference
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      )}

      {/* VIDEO CONTROLS */}
      <div
        className="absolute bottom-2 z-10" // Increased z-index for controls
        onPointerDown={(e) => e.stopPropagation()} // Prevent drag interference
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center flex-wrap justify-center">
            <CallControls onLeave={() => router.push("/arena")} />

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-6"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent drag interference
                  >
                    <LayoutListIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLayout("grid")}>
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLayout("speaker")}>
                    Speaker View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                className="size-6"
                onClick={() => setShowParticipants(!showParticipants)}
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag interference
              >
                <UsersIcon className="size-4" />
              </Button>
                 <EndCallButton />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingVideo;
