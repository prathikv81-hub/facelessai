import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PipelineStage, VideoJobPublic } from "../backend.d";

type GenerateMode = "auto" | "script";

interface VideoGenerationModalProps {
  open: boolean;
  jobId: bigint | null;
  jobMode?: GenerateMode;
  onComplete: (jobId: bigint) => void;
  onFailure: (reason: string) => void;
  onCancel: () => void;
  getVideoJob: (jobId: bigint) => Promise<VideoJobPublic | null>;
}

const STAGE_ORDER: PipelineStage[] = [
  "script",
  "voiceover",
  "images",
  "assembly",
] as PipelineStage[];

const STAGE_LABELS: Record<string, string> = {
  script: "Generating Script",
  voiceover: "Creating Voiceover",
  images: "Generating Visuals",
  assembly: "Assembling Video",
};

const STAGE_LABELS_SCRIPT_MODE: Record<string, string> = {
  script: "Script Ready",
  voiceover: "Creating Voiceover",
  images: "Generating Visuals",
  assembly: "Assembling Video",
};

const STAGE_DESCRIPTIONS: Record<string, string> = {
  script: "Crafting a compelling narrative for your video…",
  voiceover: "Synthesizing a natural AI voice for the script…",
  images: "Generating cinematic visuals frame by frame…",
  assembly: "Merging audio and visuals into the final video…",
};

function StageRow({
  stage,
  currentStage,
  completedStages,
  isFailed,
  isUserScript,
}: {
  stage: PipelineStage;
  currentStage: PipelineStage | null;
  completedStages: PipelineStage[];
  isFailed: boolean;
  isUserScript: boolean;
}) {
  const isCompleted = completedStages.includes(stage);
  const isCurrent = currentStage === stage && !isFailed;
  const isPending = !isCompleted && !isCurrent;
  const labels = isUserScript ? STAGE_LABELS_SCRIPT_MODE : STAGE_LABELS;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
        isCurrent ? "bg-primary/10 border border-primary/25" : "bg-muted/30"
      }`}
    >
      <span className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-primary" />
        ) : isCurrent ? (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        ) : isFailed && currentStage === stage ? (
          <XCircle className="w-5 h-5 text-destructive" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground/40" />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-none ${
            isCompleted
              ? "text-foreground"
              : isCurrent
                ? "text-foreground"
                : "text-muted-foreground"
          }`}
        >
          {labels[stage]}
        </p>
        {isCurrent && (
          <p className="text-xs text-muted-foreground mt-1">
            {STAGE_DESCRIPTIONS[stage]}
          </p>
        )}
      </div>
      {isCompleted && (
        <span className="text-xs text-primary font-medium">Done</span>
      )}
      {isCurrent && (
        <span className="text-xs text-primary font-medium animate-pulse">
          In progress
        </span>
      )}
      {isPending && !isFailed && (
        <span className="text-xs text-muted-foreground/50">Queued</span>
      )}
    </div>
  );
}

export function VideoGenerationModal({
  open,
  jobId,
  jobMode = "auto",
  onComplete,
  onFailure,
  onCancel,
  getVideoJob,
}: VideoGenerationModalProps) {
  const isUserScript = jobMode === "script";

  // For userScript mode, script stage is pre-completed
  const initialCompleted: PipelineStage[] = isUserScript
    ? (["script"] as PipelineStage[])
    : [];

  const [currentStage, setCurrentStage] = useState<PipelineStage | null>(null);
  const [completedStages, setCompletedStages] =
    useState<PipelineStage[]>(initialCompleted);
  const [isFailed, setIsFailed] = useState(false);
  const [progressPercent, setProgressPercent] = useState(isUserScript ? 25 : 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open || !jobId) {
      setCurrentStage(null);
      setCompletedStages(isUserScript ? (["script"] as PipelineStage[]) : []);
      setIsFailed(false);
      setProgressPercent(isUserScript ? 25 : 0);
      return;
    }

    async function pollJob() {
      if (!jobId) return;
      try {
        const job = await getVideoJob(jobId);
        if (!job) return;

        const status = job.status;

        if (status.__kind__ === "completed") {
          setCompletedStages([...STAGE_ORDER]);
          setProgressPercent(100);
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => onComplete(jobId), 800);
          return;
        }

        if (status.__kind__ === "failed") {
          setIsFailed(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          onFailure(status.failed.reason || "Video generation failed.");
          return;
        }

        if (status.__kind__ === "processing" && job.currentStage) {
          const stage = job.currentStage;

          // In userScript mode, if the backend signals script stage, skip past it
          if (isUserScript && stage === "script") {
            setCurrentStage("voiceover" as PipelineStage);
            setCompletedStages(["script"] as PipelineStage[]);
            setProgressPercent(25);
            return;
          }

          setCurrentStage(stage);
          const stageIdx = STAGE_ORDER.indexOf(stage);
          if (stageIdx >= 0) {
            const completed = STAGE_ORDER.slice(0, stageIdx) as PipelineStage[];
            // In userScript mode, always ensure script is in completed list
            if (
              isUserScript &&
              !completed.includes("script" as PipelineStage)
            ) {
              completed.unshift("script" as PipelineStage);
            }
            setCompletedStages(completed);
            const pct = Math.round((stageIdx / STAGE_ORDER.length) * 90);
            setProgressPercent(isUserScript ? Math.max(25, pct) : pct);
          }
        }

        if (status.__kind__ === "pending") {
          setProgressPercent(isUserScript ? 25 : 5);
        }
      } catch {
        // silently ignore poll errors
      }
    }

    pollJob();
    intervalRef.current = setInterval(pollJob, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, jobId, isUserScript, getVideoJob, onComplete, onFailure]);

  const completedCount = completedStages.length;
  const totalStages = STAGE_ORDER.length;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent
        className="sm:max-w-md bg-card border-border shadow-elevated"
        data-ocid="generate.progress_dialog"
      >
        {/* Header */}
        <div className="text-center pb-2">
          <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3 shadow-glow-primary">
            <Loader2
              className={`w-6 h-6 text-primary-foreground ${!isFailed ? "animate-spin" : ""}`}
            />
          </div>
          <h2 className="font-display font-bold text-xl">
            {isFailed ? "Generation Failed" : "Generating Your Video"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isFailed
              ? "Something went wrong. Please try again."
              : progressPercent >= 100
                ? "Almost done…"
                : `Step ${completedCount + 1} of ${totalStages}`}
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall progress</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-accent rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
              data-ocid="generate.progress_bar"
            />
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-2 mt-1" data-ocid="generate.stages_list">
          {STAGE_ORDER.map((stage) => (
            <StageRow
              key={stage}
              stage={stage}
              currentStage={currentStage}
              completedStages={completedStages}
              isFailed={isFailed}
              isUserScript={isUserScript}
            />
          ))}
        </div>

        {/* Footer note */}
        {!isFailed && progressPercent < 100 && (
          <p className="text-xs text-center text-muted-foreground pt-1">
            This usually takes 2–4 minutes. Feel free to wait here.
          </p>
        )}

        {/* Cancel button */}
        {!isFailed && progressPercent < 100 && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-1 py-2 rounded-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
            data-ocid="generate.cancel_button"
          >
            Cancel Generation
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
