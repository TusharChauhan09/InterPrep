import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    interviewId: v.id("interviews"),
    questionRef: v.object({
      source: v.union(v.literal("platform"), v.literal("user")),
      id: v.string(),
    }),
    language: v.string(),
    code: v.string(),
    verdict: v.string(),
    passed: v.number(),
    total: v.number(),
    runtimeMs: v.optional(v.number()),
    memoryKb: v.optional(v.number()),
    compileOutput: v.optional(v.string()),
    stderr: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db.insert("submissions", {
      ...args,
      candidateClerkId: identity.subject,
      createdAt: Date.now(),
    });
  },
});

export const listByInterview = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("submissions")
      .withIndex("by_interview", (q) => q.eq("interviewId", args.interviewId))
      .order("desc")
      .collect();
  },
});
