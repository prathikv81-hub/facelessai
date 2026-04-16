import { SubscriptionTier } from "@/backend.d";
import { useQuery } from "@tanstack/react-query";
import type { CreditBalance, SubscriptionTierId } from "../types";
import { useBackend } from "./useBackend";

const TIER_CREDITS: Record<string, number> = {
  [SubscriptionTier.starter]: 10,
  [SubscriptionTier.pro]: 30,
  [SubscriptionTier.enterprise]: 100,
};

export function useCreditBalance() {
  const { actor, isFetching } = useBackend();

  return useQuery<CreditBalance>({
    queryKey: ["creditBalance"],
    queryFn: async (): Promise<CreditBalance> => {
      if (!actor) {
        return { available: 0, used: 0, total: 0 };
      }
      const profile = await actor.getCallerProfile();
      if (!profile) {
        return { available: 0, used: 0, total: 0 };
      }
      const available = Number(profile.creditBalance);
      const tierKey = profile.subscription?.tier ?? null;
      const total = tierKey ? (TIER_CREDITS[tierKey as string] ?? 0) : 0;
      const used = Math.max(0, total - available);
      const tier = tierKey ? (tierKey as SubscriptionTierId) : undefined;
      return { available, used, total, tier };
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}
