import { u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { u as useAuth, e as useQueryClient } from "./index-CMKZUFdA.js";
import { u as useMutation } from "./useMutation-tcAt8btY.js";
function useBrandKit() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["brandKit"],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getBrandKit();
      return result ?? null;
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 6e4
  });
}
function useSaveBrandKit() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (kit) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveBrandKit(kit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandKit"] });
    }
  });
}
export {
  useSaveBrandKit as a,
  useBrandKit as u
};
