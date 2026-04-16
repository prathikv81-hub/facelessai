import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BrandKit } from "../types";
import { useAuth } from "./useAuth";
import { useBackend } from "./useBackend";

export function useBrandKit() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();

  return useQuery<BrandKit | null>({
    queryKey: ["brandKit"],
    queryFn: async (): Promise<BrandKit | null> => {
      if (!actor) return null;
      const result = await actor.getBrandKit();
      return result ?? null;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 60_000,
  });
}

export function useSaveBrandKit() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<void, Error, BrandKit>({
    mutationFn: async (kit) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveBrandKit(kit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandKit"] });
    },
  });
}
