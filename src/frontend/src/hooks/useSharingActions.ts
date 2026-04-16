import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBackend } from "./useBackend";

export function useSharingActions() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const generateShareLink = useMutation<string, Error, bigint>({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateShareLink(videoId);
    },
    onSuccess: (_shareUrl, videoId) => {
      toast.success("Share link generated!");
      // Invalidate the video detail so shareUrl/shareToken appears updated
      queryClient.invalidateQueries({
        queryKey: ["videoJob", videoId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["videoJobs"] });
    },
    onError: (err) => {
      toast.error(`Failed to generate share link: ${err.message}`);
    },
  });

  const copyShareLink = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Could not copy link"));
  };

  return { generateShareLink, copyShareLink };
}
