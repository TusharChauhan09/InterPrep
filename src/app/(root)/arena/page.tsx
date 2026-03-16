"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useUserRole } from "@/hooks/useUserRole";
import { QUICK_ACTIONS } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { ActionCard } from "@/components/ActionCard";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import MeetingCard from "@/components/MeetingCard";


const ArenaPage = () => {
  const router = useRouter();

  const { isInterviewer, isCandidate, isLoading } = useUserRole();

  const interview = useQuery(api.interviews.getMyInterviews);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();
  const interviews = useQuery(api.interviews.getMyInterviews);

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
        break;
    }
  };

  if (isLoading) return <LoaderUI />;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <div className="app-noise-overlay" />

      {/* WELCOME HEADER */}
      <div className="app-page-header">
        <h1>
          {isInterviewer ? "Command Center" : "Your Arena"}
        </h1>
        <p>
          {isInterviewer
            ? "Manage your interviews and review candidates effectively"
            : "Access your upcoming interviews and preparations"}
        </p>
      </div>

      {isInterviewer ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                action={action}
                onClick={() => handleQuickAction(action.title)}
              />
            ))}
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <div className="mt-8">
            {interviews === undefined ? (
              <LoaderUI />
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <MeetingCard key={interview._id} interview={interview} />
                ))}
              </div>
            ) : (
              <div className="app-empty-state">
                <p>No scheduled interviews at the moment</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArenaPage;
