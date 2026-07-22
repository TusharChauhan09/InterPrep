import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    accent: "emerald",
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    accent: "blue",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    accent: "amber",
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    accent: "red",
  },
];

export type QuickActionType = (typeof QUICK_ACTIONS)[number];
