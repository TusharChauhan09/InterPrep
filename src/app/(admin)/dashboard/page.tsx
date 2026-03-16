"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import toast from "react-hot-toast";
import LoaderUI from "@/components/LoaderUI";
import { getCandidateInfo, groupInterviews } from "@/lib/utils";
import Link from "next/link";
import { INTERVIEW_CATEGORY } from "@/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
  ArrowRightIcon,
} from "lucide-react";
import { format } from "date-fns";
import CommentDialog from "@/components/CommentDialog";

type Interview = Doc<"interviews">;

const DashboardPage = () => {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleStatusUpdate = async (
    interviewId: Id<"interviews">,
    status: string
  ) => {
    try {
      await updateStatus({ id: interviewId, status });
      toast.success(`Interview marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!interviews || !users) return <LoaderUI />;

  const groupedInterviews = groupInterviews(interviews);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <div className="app-noise-overlay" />

      {/* Header */}
      <div className="app-page-header flex items-end justify-between">
        <div>
          <h1>Dashboard</h1>
          <p>Review and manage all interview sessions</p>
        </div>
        <Link href="/schedule">
          <button
            className="h-10 px-6 bg-foreground text-background text-xs font-bold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
            style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
          >
            Schedule Interview
            <ArrowRightIcon className="size-3" />
          </button>
        </Link>
      </div>

      <div className="space-y-10">
        {INTERVIEW_CATEGORY.map(
          (category) =>
            groupedInterviews[category.id]?.length > 0 && (
              <section key={category.id}>
                {/* CATEGORY TITLE */}
                <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                  <h2
                    className="text-2xl uppercase"
                    style={{ fontFamily: "var(--font-anton, 'Anton', sans-serif)" }}
                  >
                    {category.title}
                  </h2>
                  <span
                    className={`text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 font-bold ${
                      category.id === "upcoming"
                        ? "bg-amber text-amber-foreground"
                        : category.id === "completed"
                          ? "bg-blue text-blue-foreground"
                          : category.id === "succeeded"
                            ? "bg-emerald text-emerald-foreground"
                            : category.id === "failed"
                              ? "bg-red text-red-foreground"
                              : "border border-foreground text-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                  >
                    {groupedInterviews[category.id].length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupedInterviews[category.id].map(
                    (interview: Interview) => {
                      const candidateInfo = getCandidateInfo(
                        users,
                        interview.candidateId
                      );
                      const startTime = new Date(interview.startTime);

                      return (
                        <div
                          key={interview._id}
                          className="border border-border bg-card hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
                        >
                          {/* Color status bar */}
                          <div className={`h-[3px] w-full ${
                            interview.status === "succeeded" ? "bg-emerald"
                            : interview.status === "failed" ? "bg-red"
                            : interview.status === "completed" ? "bg-blue"
                            : "bg-amber"
                          }`} />
                          {/* Candidate info */}
                          <div className="p-5 border-b border-border">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 rounded-none border border-border">
                                <AvatarImage src={candidateInfo.image} />
                                <AvatarFallback className="rounded-none text-xs font-bold">
                                  {candidateInfo.initials}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-sm font-semibold">
                                  {candidateInfo.name}
                                </h3>
                                <p
                                  className="text-xs uppercase tracking-[0.08em] text-muted-foreground"
                                  style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                                >
                                  {interview.title}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Date & time */}
                          <div className="px-5 py-3">
                            <div
                              className="flex items-center gap-4 text-xs uppercase tracking-[0.1em] text-muted-foreground"
                              style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                            >
                              <div className="flex items-center gap-1.5">
                                <CalendarIcon className="h-3 w-3" />
                                {format(startTime, "MMM dd")}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ClockIcon className="h-3 w-3" />
                                {format(startTime, "hh:mm a")}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="px-5 pb-5 flex flex-col gap-2 mt-auto">
                            {interview.status === "completed" && (
                              <div className="flex gap-2 w-full">
                                <button
                                  className="flex-1 h-9 bg-emerald text-emerald-foreground text-xs font-bold uppercase tracking-[0.08em] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                                  style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                                  onClick={() =>
                                    handleStatusUpdate(
                                      interview._id,
                                      "succeeded"
                                    )
                                  }
                                >
                                  <CheckCircle2Icon className="h-3 w-3" />
                                  Pass
                                </button>
                                <button
                                  className="flex-1 h-9 bg-red text-red-foreground text-xs font-bold uppercase tracking-[0.08em] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                                  style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                                  onClick={() =>
                                    handleStatusUpdate(interview._id, "failed")
                                  }
                                >
                                  <XCircleIcon className="h-3 w-3" />
                                  Fail
                                </button>
                              </div>
                            )}

                            {interview.status === "succeeded" && (
                              <div
                                className="w-full h-9 bg-emerald/10 border border-emerald/30 text-emerald text-xs font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-1.5"
                                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                              >
                                <CheckCircle2Icon className="h-3 w-3" />
                                Passed
                              </div>
                            )}

                            {interview.status === "failed" && (
                              <div
                                className="w-full h-9 bg-red/10 border border-red/30 text-red text-xs font-bold uppercase tracking-[0.08em] flex items-center justify-center gap-1.5"
                                style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
                              >
                                <XCircleIcon className="h-3 w-3" />
                                Failed
                              </div>
                            )}
                            <CommentDialog interviewId={interview._id} />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
