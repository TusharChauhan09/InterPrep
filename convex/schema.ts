import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const starterCode = v.object({
  javascript: v.string(),
  python: v.string(),
  java: v.string(),
});

const example = v.object({
  input: v.string(),
  output: v.string(),
  explanation: v.optional(v.string()),
});

const testcase = v.object({
  stdin: v.string(),
  expectedStdout: v.string(),
  hidden: v.boolean(),
});

const questionRef = v.object({
  source: v.union(v.literal("platform"), v.literal("user")),
  id: v.string(),
});

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
    questions: v.optional(v.array(questionRef)),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  platformQuestions: defineTable({
    title: v.string(),
    description: v.string(),
    constraints: v.optional(v.array(v.string())),
    timeLimitMs: v.number(),
    memoryLimitKb: v.number(),
    starterCode,
    examples: v.array(example),
    testcases: v.array(testcase),
  }),

  userQuestions: defineTable({
    ownerClerkId: v.string(),
    title: v.string(),
    description: v.string(),
    constraints: v.optional(v.array(v.string())),
    timeLimitMs: v.number(),
    memoryLimitKb: v.number(),
    starterCode,
    examples: v.array(example),
    testcases: v.array(testcase),
  }).index("by_owner", ["ownerClerkId"]),

  submissions: defineTable({
    interviewId: v.id("interviews"),
    candidateClerkId: v.string(),
    questionRef,
    language: v.string(),
    code: v.string(),
    verdict: v.string(),
    passed: v.number(),
    total: v.number(),
    runtimeMs: v.optional(v.number()),
    memoryKb: v.optional(v.number()),
    compileOutput: v.optional(v.string()),
    stderr: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_interview", ["interviewId"]),
});
