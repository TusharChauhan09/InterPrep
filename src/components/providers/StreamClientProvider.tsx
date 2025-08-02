"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";

import LoaderUI from "../LoaderUI";

import { streamTokenProvider } from "@/actions/stream.action";

const StreamClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient>();
  const [isInitializing, setIsInitializing] = useState(false);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Don't initialize if user is not loaded or not authenticated
    if (!isLoaded) return;
    if (!user) {
      console.log("No user found, skipping Stream client initialization");
      return;
    }

    // Don't initialize if already initializing or already initialized
    if (isInitializing || streamVideoClient) return;

    const initializeClient = async () => {
      setIsInitializing(true);
      try {
        console.log("Initializing Stream client for user:", user.id);
        console.log(
          "Stream API Key:",
          process.env.NEXT_PUBLIC_STREAM_API_KEY ? "Present" : "Missing"
        );

        if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
          console.error("NEXT_PUBLIC_STREAM_API_KEY is not set");
          return;
        }

        const client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
          user: {
            id: user.id,
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.id,
            image: user.imageUrl,
          },
          tokenProvider: streamTokenProvider,
        });

        console.log("Stream client initialized successfully");
        setStreamVideoClient(client);
      } catch (error) {
        console.error("Failed to initialize Stream client:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeClient();
  }, [user, isLoaded, isInitializing, streamVideoClient]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (streamVideoClient) {
        console.log("Cleaning up Stream client");
        streamVideoClient.disconnectUser();
      }
    };
  }, [streamVideoClient]);

  // Handle different states
  if (!isLoaded) {
    return <LoaderUI />;
  }

  if (!user) {
    console.log(
      "StreamClientProvider: No user, rendering children without Stream"
    );
    return <>{children}</>;
  }

  if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Stream Configuration Missing
          </h2>
          <p className="text-muted-foreground">
            Please configure your Stream API keys in the environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (isInitializing || !streamVideoClient) {
    return <LoaderUI />;
  }

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamClientProvider;
