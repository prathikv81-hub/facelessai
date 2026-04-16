import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "../types";
import { useAuth } from "./useAuth";
import { useBackend } from "./useBackend";

export function useUserProfile() {
  const { actor, isFetching } = useBackend();
  const { principal, isAuthenticated } = useAuth();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", principal],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!actor || !principal) return null;
      return {
        principal,
        createdAt: BigInt(Date.now()),
        totalVideosGenerated: 0,
      };
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });
}
