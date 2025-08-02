"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// Cache for tokens to prevent multiple concurrent requests
const tokenCache = new Map<string, { token: string; expires: number }>();

export const streamTokenProvider = async (): Promise<string> => {
  try {
    const user = await currentUser();

    if (!user) {
      console.log("Stream token provider: No user found");
      throw new Error("User is not authenticated");
    }

    console.log("Stream token provider: User found:", user.id);

    // Check cache first
    const cached = tokenCache.get(user.id);
    if (cached && cached.expires > Date.now()) {
      console.log("Returning cached token for user:", user.id);
      return cached.token;
    }

    if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
      console.error("NEXT_PUBLIC_STREAM_API_KEY is not set");
      throw new Error("Stream API key is not configured");
    }

    if (!process.env.STREAM_SECRET_KEY) {
      console.error("STREAM_SECRET_KEY is not set");
      throw new Error("Stream secret key is not configured");
    }

    const streamClient = new StreamClient(
      process.env.NEXT_PUBLIC_STREAM_API_KEY,
      process.env.STREAM_SECRET_KEY
    );

    const token = streamClient.generateUserToken({
      user_id: user.id,
    });

    // Cache the token for 1 hour
    tokenCache.set(user.id, {
      token,
      expires: Date.now() + 60 * 60 * 1000,
    });

    console.log("Stream token generated successfully for user:", user.id);
    return token;
  } catch (error) {
    console.error("Stream token provider error:", error);
    throw error;
  }
};
