import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SavedScript } from "../types";
import { useAuth } from "./useAuth";
import { useBackend } from "./useBackend";

export function useScripts() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();

  return useQuery<SavedScript[]>({
    queryKey: ["scripts"],
    queryFn: async (): Promise<SavedScript[]> => {
      if (!actor) return [];
      const result = await actor.listScripts();
      return result.map((s) => ({
        ...s,
        userId: s.userId.toText(),
      }));
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 30_000,
  });
}

export function useGetScript(id: bigint | null) {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();

  return useQuery<SavedScript | null>({
    queryKey: ["script", id?.toString()],
    queryFn: async (): Promise<SavedScript | null> => {
      if (!actor || id === null) return null;
      const result = await actor.getScript(id);
      if (result === null) return null;
      return { ...result, userId: result.userId.toText() };
    },
    enabled: !!actor && !isFetching && isAuthenticated && id !== null,
    staleTime: 30_000,
  });
}

export function useSaveScript() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<SavedScript, Error, { title: string; content: string }>({
    mutationFn: async ({ title, content }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.saveScript(title, content);
      return { ...result, userId: result.userId.toText() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
}

export function useDeleteScript() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteScript(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
}
