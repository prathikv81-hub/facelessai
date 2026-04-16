import type { YouTubeConnectionStatus } from "@/backend.d";
import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export function useYouTubeConnection() {
  const { actor, isFetching } = useBackend();

  return useQuery<YouTubeConnectionStatus>({
    queryKey: ["youtubeConnection"],
    queryFn: async () => {
      if (!actor) return { connected: false };
      return actor.getYouTubeConnection();
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}
