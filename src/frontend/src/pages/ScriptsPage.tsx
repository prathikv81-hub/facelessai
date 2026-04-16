import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteScript, useScripts } from "@/hooks/useScripts";
import type { SavedScript } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, FileText, Trash2, Video } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(createdAt: bigint): string {
  const ms = Number(createdAt / 1_000_000n);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(ms));
}

function ScriptCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-5 w-48 rounded" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <div className="flex items-center justify-between mt-1">
        <Skeleton className="h-4 w-24 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
      data-ocid="scripts.empty_state"
    >
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-glow-primary">
        <BookOpen className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No saved scripts yet
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Your saved scripts will appear here. Save a script from any video to get
        started.
      </p>
      <Button
        onClick={() => navigate({ to: "/generate" })}
        className="gradient-accent text-primary-foreground shadow-glow-primary hover:opacity-90 transition-smooth"
        data-ocid="scripts.empty_generate_button"
      >
        <Video className="w-4 h-4 mr-2" />
        Generate Your First Video
      </Button>
    </div>
  );
}

interface ScriptCardProps {
  script: SavedScript;
  index: number;
}

function ScriptCard({ script, index }: ScriptCardProps) {
  const navigate = useNavigate();
  const deleteScript = useDeleteScript();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const preview =
    script.content.length > 150
      ? `${script.content.slice(0, 150)}…`
      : script.content;

  function handleUseInGenerate() {
    navigate({ to: "/generate", search: { scriptId: script.id.toString() } });
  }

  async function handleDelete() {
    try {
      await deleteScript.mutateAsync(script.id);
      toast.success("Script deleted successfully");
      setDeleteOpen(false);
    } catch {
      toast.error("Failed to delete script. Please try again.");
    }
  }

  return (
    <article
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/40 transition-smooth group"
      data-ocid={`scripts.item.${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-smooth line-clamp-1 flex-1 min-w-0">
          {script.title}
        </h3>
        <Badge variant="secondary" className="shrink-0 text-xs font-medium">
          Script
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {preview}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1 gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">
          {formatDate(script.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleUseInGenerate}
            className="text-xs h-8 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-smooth"
            data-ocid={`scripts.use_button.${index}`}
          >
            <Video className="w-3.5 h-3.5 mr-1.5" />
            Use in Generate
          </Button>

          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
                aria-label="Delete script"
                data-ocid={`scripts.delete_button.${index}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="scripts.delete_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Script?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-foreground">
                    "{script.title}"
                  </span>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="scripts.delete_cancel_button">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteScript.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-ocid="scripts.delete_confirm_button"
                >
                  {deleteScript.isPending ? "Deleting…" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}

export default function ScriptsPage() {
  const { data: scripts, isLoading, isError } = useScripts();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="scripts.page">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Saved Scripts
            </h1>
            <p className="text-sm text-muted-foreground">
              Reuse your scripts in future video generations.
            </p>
          </div>
          {scripts && scripts.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-sm px-3 py-1">
              {scripts.length} {scripts.length === 1 ? "script" : "scripts"}
            </Badge>
          )}
        </div>

        {/* Error state */}
        {isError && (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-ocid="scripts.error_state"
          >
            <p className="text-muted-foreground mb-4">
              Failed to load scripts. Please refresh and try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !isError && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-ocid="scripts.loading_state"
          >
            {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map((key) => (
              <ScriptCardSkeleton key={key} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && scripts?.length === 0 && <EmptyState />}

        {/* Script grid */}
        {!isLoading && !isError && scripts && scripts.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            data-ocid="scripts.list"
          >
            {scripts.map((script, i) => (
              <ScriptCard
                key={script.id.toString()}
                script={script}
                index={i + 1}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
