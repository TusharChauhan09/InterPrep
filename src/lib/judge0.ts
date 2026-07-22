export const JUDGE0_LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
} as const;

export type SupportedLanguage = keyof typeof JUDGE0_LANGUAGE_IDS;

export const LANGUAGES: {
  id: SupportedLanguage;
  name: string;
  icon: string;
}[] = [
  { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
  { id: "python", name: "Python", icon: "/python.png" },
  { id: "java", name: "Java", icon: "/java.png" },
];

export type Judge0StatusId =
  | 1 | 2 | 3 | 4 | 5 | 6
  | 7 | 8 | 9 | 10 | 11 | 12
  | 13 | 14;

export type Verdict =
  | "AC"
  | "WA"
  | "TLE"
  | "MLE"
  | "CE"
  | "RE"
  | "IE"
  | "PENDING";

export function mapStatusToVerdict(statusId: number): Verdict {
  switch (statusId) {
    case 1:
    case 2:
      return "PENDING";
    case 3:
      return "AC";
    case 4:
      return "WA";
    case 5:
      return "TLE";
    case 6:
      return "CE";
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
      return "RE";
    case 13:
      return "IE";
    case 14:
      return "MLE";
    default:
      return "IE";
  }
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  AC: "Accepted",
  WA: "Wrong Answer",
  TLE: "Time Limit Exceeded",
  MLE: "Memory Limit Exceeded",
  CE: "Compilation Error",
  RE: "Runtime Error",
  IE: "Internal Error",
  PENDING: "Pending",
};

export interface Judge0SubmissionResult {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
}

export function b64encode(s: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(s, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(s)));
}

export function b64decode(s: string | null | undefined): string {
  if (!s) return "";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(s, "base64").toString("utf-8");
  }
  return decodeURIComponent(escape(atob(s)));
}
