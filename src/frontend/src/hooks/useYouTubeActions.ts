import type { PublishToYouTubeRequest } from "@/backend.d";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBackend } from "./useBackend";

interface PublishPayload {
  videoId: bigint;
  request: PublishToYouTubeRequest;
}

export function useYouTubeActions() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const connectYouTube = useMutation<
    void,
    Error,
    { authCode: string; redirectUri: string }
  >({
    mutationFn: async ({ authCode, redirectUri }) => {
      if (!actor) throw new Error("Not connected");
      return actor.connectYouTube(authCode, redirectUri);
    },
    onSuccess: () => {
      toast.success("YouTube channel connected!");
      queryClient.invalidateQueries({ queryKey: ["youtubeConnection"] });
    },
    onError: (err) => {
      toast.error(`Failed to connect YouTube: ${err.message}`);
    },
  });

  const disconnectYouTube = useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.disconnectYouTube();
    },
    onSuccess: () => {
      toast.success("YouTube channel disconnected.");
      queryClient.invalidateQueries({ queryKey: ["youtubeConnection"] });
    },
    onError: (err) => {
      toast.error(`Failed to disconnect YouTube: ${err.message}`);
    },
  });

  const publishToYouTube = useMutation<void, Error, PublishPayload>({
    mutationFn: async ({ videoId, request }) => {
      if (!actor) throw new Error("Not connected");
      return actor.publishToYouTube(videoId, request);
    },
    onSuccess: (_data, { videoId }) => {
      toast.success("Publishing to YouTube started!");
      queryClient.invalidateQueries({
        queryKey: ["videoJob", videoId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["videoJobs"] });
    },
    onError: (err) => {
      toast.error(`Failed to publish to YouTube: ${err.message}`);
    },
  });

  return { connectYouTube, disconnectYouTube, publishToYouTube };
}
