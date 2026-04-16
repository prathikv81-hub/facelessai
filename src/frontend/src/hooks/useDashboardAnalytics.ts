import type { DashboardAnalytics } from "@/backend.d";
import { useQuery } from "@tanstack/react-query";
import { useBackend } from "./useBackend";

export function useDashboardAnalytics() {
  const { actor, isFetching } = useBackend();

  return useQuery<DashboardAnalytics>({
    queryKey: ["dashboardAnalytics"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalViews: 0n,
          totalWatchTimeHours: 0n,
          avgCompletionRate: 0n,
          totalVideos: 0n,
        };
      }
      return actor.getDashboardAnalytics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
    refetchInterval: 60_000,
  });
}
