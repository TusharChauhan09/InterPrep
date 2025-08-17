import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Interview = Doc<"interviews">;

export default function MeetingCard({ interview }: { interview: Interview }) {
  const { joinMeeting } = useMeetingActions();
  const status = getMeetingStatus(interview);
  const formattedDate = format(
    new Date(interview.startTime),
    "EEEE, MMMM d · h:mm a"
  );

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formattedDate}
          </div>

          <Badge
            className={` ${status === "live" ? "bg-green-500" : status === "upcoming" ? "bg-amber-500" : "bg-red-500"}`}
          >
            {status === "live"
              ? "Live Now"
              : status === "upcoming"
                ? "Upcoming"
                : "Completed"}
          </Badge>
        </div>

        <CardTitle>{interview.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "live" && (
          <Button
            className="w-full"
            onClick={() => joinMeeting(interview.streamCallId)}
          >
            Join Meeting
          </Button>
        )}

        {status === "upcoming" && (
          <Button className="w-full dark:bg-white bg-black" disabled>
            Waiting to Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
