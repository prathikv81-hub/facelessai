import type { VideoAnalytics } from "@/backend.d";
import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export function useVideoAnalytics(videoId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<VideoAnalytics | null>({
    queryKey: ["videoAnalytics", videoId?.toString()],
    queryFn: async () => {
      if (!actor || videoId === null) return null;
      return actor.getVideoAnalytics(videoId);
    },
    enabled: !!actor && !isFetching && videoId !== null,
    staleTime: 60_000,
    refetchInterval: 30_000,
  });
}
