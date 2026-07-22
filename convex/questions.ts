import { mutation, query } from "./_generated/server";
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

export const listPlatform = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db.query("platformQuestions").collect();
  },
});

export const listMine = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("userQuestions")
      .withIndex("by_owner", (q) => q.eq("ownerClerkId", identity.subject))
      .collect();
  },
});

export const getByRef = query({
  args: {
    source: v.union(v.literal("platform"), v.literal("user")),
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const table = args.source === "platform" ? "platformQuestions" : "userQuestions";
    const normalized = ctx.db.normalizeId(table, args.id);
    if (!normalized) return null;
    return await ctx.db.get(normalized);
  },
});

export const getManyByRefs = query({
  args: {
    refs: v.array(
      v.object({
        source: v.union(v.literal("platform"), v.literal("user")),
        id: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const results = await Promise.all(
      args.refs.map(async (r) => {
        const table = r.source === "platform" ? "platformQuestions" : "userQuestions";
        const normalized = ctx.db.normalizeId(table, r.id);
        if (!normalized) return null;
        const doc = await ctx.db.get(normalized);
        if (!doc) return null;
        return { ...doc, _source: r.source };
      })
    );
    return results.filter(Boolean);
  },
});

export const createUserQuestion = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    constraints: v.optional(v.array(v.string())),
    timeLimitMs: v.number(),
    memoryLimitKb: v.number(),
    starterCode,
    examples: v.array(example),
    testcases: v.array(testcase),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db.insert("userQuestions", {
      ...args,
      ownerClerkId: identity.subject,
    });
  },
});

export const updateUserQuestion = mutation({
  args: {
    id: v.id("userQuestions"),
    title: v.string(),
    description: v.string(),
    constraints: v.optional(v.array(v.string())),
    timeLimitMs: v.number(),
    memoryLimitKb: v.number(),
    starterCode,
    examples: v.array(example),
    testcases: v.array(testcase),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.ownerClerkId !== identity.subject) {
      throw new Error("Forbidden");
    }
    const { id, ...rest } = args;
    return await ctx.db.patch(id, rest);
  },
});

export const deleteUserQuestion = mutation({
  args: { id: v.id("userQuestions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const existing = await ctx.db.get(args.id);
    if (!existing || existing.ownerClerkId !== identity.subject) {
      throw new Error("Forbidden");
    }
    return await ctx.db.delete(args.id);
  },
});

export const seedPlatform = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const existing = await ctx.db.query("platformQuestions").collect();
    if (existing.length > 0) return { seeded: 0 };

    const questions = [
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nINPUT FORMAT:\nLine 1: space-separated integers (nums)\nLine 2: integer target\n\nOUTPUT FORMAT:\nspace-separated indices",
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists.",
        ],
        timeLimitMs: 2000,
        memoryLimitKb: 128000,
        starterCode: {
          javascript:
            "const lines = require('fs').readFileSync(0,'utf8').trim().split('\\n');\nconst nums = lines[0].split(' ').map(Number);\nconst target = Number(lines[1]);\n\nfunction twoSum(nums, target) {\n  // your code\n}\n\nconsole.log(twoSum(nums, target).join(' '));",
          python:
            "import sys\ndata = sys.stdin.read().split('\\n')\nnums = list(map(int, data[0].split()))\ntarget = int(data[1])\n\ndef two_sum(nums, target):\n    # your code\n    pass\n\nprint(' '.join(map(str, two_sum(nums, target))))",
          java:
            "import java.util.*;\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // your code\n        return new int[]{};\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] line1 = sc.nextLine().split(\" \");\n        int[] nums = new int[line1.length];\n        for (int i = 0; i < line1.length; i++) nums[i] = Integer.parseInt(line1[i]);\n        int target = Integer.parseInt(sc.nextLine().trim());\n        int[] res = twoSum(nums, target);\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) { if (i>0) sb.append(' '); sb.append(res[i]); }\n        System.out.println(sb.toString());\n    }\n}",
        },
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "0 1", explanation: "nums[0] + nums[1] == 9" },
          { input: "nums = [3,2,4], target = 6", output: "1 2" },
        ],
        testcases: [
          { stdin: "2 7 11 15\n9\n", expectedStdout: "0 1\n", hidden: false },
          { stdin: "3 2 4\n6\n", expectedStdout: "1 2\n", hidden: false },
          { stdin: "3 3\n6\n", expectedStdout: "0 1\n", hidden: true },
          { stdin: "-1 -2 -3 -4 -5\n-8\n", expectedStdout: "2 4\n", hidden: true },
        ],
      },
      {
        title: "Reverse String",
        description:
          "Reverse a string in place.\n\nINPUT: single line string.\nOUTPUT: reversed string.",
        constraints: ["1 <= s.length <= 10^5"],
        timeLimitMs: 2000,
        memoryLimitKb: 128000,
        starterCode: {
          javascript:
            "const s = require('fs').readFileSync(0,'utf8').replace(/\\n$/, '');\n\nfunction reverseString(s) {\n  // your code\n  return s;\n}\n\nconsole.log(reverseString(s));",
          python:
            "import sys\ns = sys.stdin.read().rstrip('\\n')\n\ndef reverse_string(s):\n    # your code\n    return s\n\nprint(reverse_string(s))",
          java:
            "import java.util.*;\npublic class Main {\n    public static String reverseString(String s) {\n        // your code\n        return s;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine() : \"\";\n        System.out.println(reverseString(s));\n    }\n}",
        },
        examples: [
          { input: "hello", output: "olleh" },
          { input: "Hannah", output: "hannaH" },
        ],
        testcases: [
          { stdin: "hello\n", expectedStdout: "olleh\n", hidden: false },
          { stdin: "Hannah\n", expectedStdout: "hannaH\n", hidden: false },
          { stdin: "a\n", expectedStdout: "a\n", hidden: true },
          { stdin: "racecar\n", expectedStdout: "racecar\n", hidden: true },
        ],
      },
      {
        title: "Palindrome Number",
        description:
          "Given an integer x, return true if x is a palindrome and false otherwise.\n\nINPUT: single integer.\nOUTPUT: 'true' or 'false'.",
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        timeLimitMs: 2000,
        memoryLimitKb: 128000,
        starterCode: {
          javascript:
            "const x = Number(require('fs').readFileSync(0,'utf8').trim());\n\nfunction isPalindrome(x) {\n  // your code\n}\n\nconsole.log(isPalindrome(x) ? 'true' : 'false');",
          python:
            "import sys\nx = int(sys.stdin.read().strip())\n\ndef is_palindrome(x):\n    # your code\n    pass\n\nprint('true' if is_palindrome(x) else 'false')",
          java:
            "import java.util.*;\npublic class Main {\n    public static boolean isPalindrome(int x) {\n        // your code\n        return false;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = Integer.parseInt(sc.nextLine().trim());\n        System.out.println(isPalindrome(x) ? \"true\" : \"false\");\n    }\n}",
        },
        examples: [
          { input: "121", output: "true" },
          { input: "-121", output: "false" },
        ],
        testcases: [
          { stdin: "121\n", expectedStdout: "true\n", hidden: false },
          { stdin: "-121\n", expectedStdout: "false\n", hidden: false },
          { stdin: "10\n", expectedStdout: "false\n", hidden: true },
          { stdin: "0\n", expectedStdout: "true\n", hidden: true },
        ],
      },
    ];

    for (const q of questions) {
      await ctx.db.insert("platformQuestions", q);
    }
    return { seeded: questions.length };
  },
});
