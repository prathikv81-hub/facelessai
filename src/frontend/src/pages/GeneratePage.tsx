import { Layout } from "@/components/Layout";
import { VideoGenerationModal } from "@/components/VideoGenerationModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { useBrandKit } from "@/hooks/useBrandKit";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  Film,
  ScrollText,
  Sparkles,
  Video,
  Wand2,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { GenerationMode, VideoJobPublic } from "../backend.d";

type VideoStyle = "cinematic" | "animation" | "photorealistic";
type AspectRatio = "16:9" | "9:16" | "1:1";
type GenerateMode = "auto" | "script";

const STYLES: { id: VideoStyle; label: string; icon: React.ReactNode }[] = [
  {
    id: "cinematic",
    label: "Cinematic",
    icon: <Film className="w-3.5 h-3.5" />,
  },
  {
    id: "animation",
    label: "Animation",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  {
    id: "photorealistic",
    label: "Photorealistic",
    icon: <Video className="w-3.5 h-3.5" />,
  },
];

const ASPECT_RATIOS: AspectRatio[] = ["16:9", "9:16", "1:1"];
const DURATIONS = [30, 60, 90, 120, 180, 240, 300];
const CREDIT_COST = 1;

const VALID_STYLES: VideoStyle[] = ["cinematic", "animation", "photorealistic"];
const VALID_RATIOS: AspectRatio[] = ["16:9", "9:16", "1:1"];

function isValidStyle(v: string): v is VideoStyle {
  return VALID_STYLES.includes(v as VideoStyle);
}

function isValidRatio(v: string): v is AspectRatio {
  return VALID_RATIOS.includes(v as AspectRatio);
}

/** Read ?scriptId from the URL without TanStack search params (avoid router changes) */
function getScriptIdFromSearch(): bigint | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("scriptId");
  if (!raw) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}

export default function GeneratePage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { data: creditBalance } = useCreditBalance();
  const { data: brandKit, isLoading: brandKitLoading } = useBrandKit();

  // Track whether brand kit defaults have been applied
  const brandKitApplied = useRef(false);
  // Track whether scriptId prefill has been applied
  const scriptPrefillApplied = useRef(false);

  const [generateMode, setGenerateMode] = useState<GenerateMode>("auto");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [style, setStyle] = useState<VideoStyle>("cinematic");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [duration, setDuration] = useState(60);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState<bigint | null>(null);
  const [activeMode, setActiveMode] = useState<GenerateMode>("auto");

  // ── Apply brand kit defaults once loaded ──────────────────────────────────
  useEffect(() => {
    if (brandKitApplied.current || !brandKit) return;
    brandKitApplied.current = true;

    if (brandKit.visualStyle && isValidStyle(brandKit.visualStyle)) {
      setStyle(brandKit.visualStyle);
    }
    if (brandKit.aspectRatio && isValidRatio(brandKit.aspectRatio)) {
      setAspectRatio(brandKit.aspectRatio);
    }
  }, [brandKit]);

  // ── Handle ?scriptId query param ─────────────────────────────────────────
  useEffect(() => {
    if (scriptPrefillApplied.current || !actor) return;
    const scriptId = getScriptIdFromSearch();
    if (!scriptId) return;

    scriptPrefillApplied.current = true;
    setGenerateMode("script");

    actor
      .getScript(scriptId)
      .then((saved) => {
        if (!saved) return;
        if (saved.title) setTitle(saved.title);
        if (saved.content) setScript(saved.content);
      })
      .catch(() => {
        // Script not found — stay in script mode, user can type manually
      });
  }, [actor]);

  const availableCredits = Number(creditBalance?.available ?? 0);
  const hasCredits = availableCredits >= CREDIT_COST;

  const promptLength = prompt.length;
  const promptValid = promptLength >= 10 && promptLength <= 500;
  const scriptLength = script.length;
  const scriptValid = scriptLength >= 50;

  const modeInputValid = generateMode === "auto" ? promptValid : scriptValid;
  const formValid = title.trim().length > 0 && modeInputValid && hasCredits;

  function handleModeSwitch(mode: GenerateMode) {
    if (mode === generateMode) return;
    setGenerateMode(mode);
    if (mode === "auto") {
      setScript("");
    } else {
      setPrompt("");
    }
  }

  async function handleGenerate() {
    if (!actor) {
      toast.error("Not connected to backend. Please refresh.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a video title.");
      return;
    }
    if (!hasCredits) {
      toast.error("You don't have enough credits to generate a video.");
      return;
    }

    if (generateMode === "auto") {
      if (promptLength < 10) {
        toast.error("Prompt must be at least 10 characters.");
        return;
      }
      if (promptLength > 500) {
        toast.error("Prompt must be 500 characters or fewer.");
        return;
      }
    } else {
      if (scriptLength < 50) {
        toast.error("Script must be at least 50 characters.");
        return;
      }
    }

    try {
      const mode: GenerationMode =
        generateMode === "auto"
          ? { __kind__: "auto", auto: null }
          : { __kind__: "userScript", userScript: { script: script.trim() } };

      const jobId = await actor.submitVideoJob({
        title: title.trim(),
        prompt: generateMode === "auto" ? prompt.trim() : "",
        mode,
      });
      setActiveJobId(jobId);
      setActiveMode(generateMode);
      setModalOpen(true);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to start video generation.";
      toast.error(msg);
    }
  }

  async function getVideoJobForModal(
    jobId: bigint,
  ): Promise<VideoJobPublic | null> {
    if (!actor) return null;
    return actor.getVideoJob(jobId);
  }

  function handleComplete(jobId: bigint) {
    setModalOpen(false);
    toast.success("Video generated successfully! Redirecting…");
    navigate({ to: "/video/$id", params: { id: String(jobId) } });
  }

  function handleFailure(reason: string) {
    setModalOpen(false);
    toast.error(reason, {
      action: {
        label: "Retry",
        onClick: () => handleGenerate(),
      },
    });
  }

  function handleCancel() {
    setModalOpen(false);
    setActiveJobId(null);
    toast.info("Generation cancelled.");
  }

  // Show skeleton while brand kit is loading on first visit
  const showSkeleton = brandKitLoading && !brandKitApplied.current;

  return (
    <Layout>
      <div
        className="p-6 max-w-2xl mx-auto animate-fade-in"
        data-ocid="generate.page"
      >
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl md:text-3xl flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-primary" />
            Generate Video
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Choose your mode: let AI write everything, or paste your own script.
          </p>
        </div>

        {/* Insufficient credits warning */}
        {!hasCredits && (
          <div
            className="flex items-start gap-3 px-4 py-3 mb-5 rounded-lg bg-destructive/10 border border-destructive/25 text-sm"
            data-ocid="generate.no_credits_warning"
          >
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">
                No credits remaining
              </p>
              <p className="text-muted-foreground mt-0.5">
                You need at least {CREDIT_COST} credit to generate a video.{" "}
                <a
                  href="/pricing"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                  data-ocid="generate.upgrade_link"
                >
                  Upgrade your plan
                </a>{" "}
                to continue.
              </p>
            </div>
          </div>
        )}

        {/* Mode toggle */}
        <div
          className="flex items-center p-1 mb-5 rounded-lg bg-muted/50 border border-border w-fit gap-1"
          data-ocid="generate.mode_toggle"
        >
          <button
            type="button"
            onClick={() => handleModeSwitch("auto")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              generateMode === "auto"
                ? "gradient-accent text-primary-foreground shadow-glow-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="generate.mode_auto_tab"
            disabled={modalOpen}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Auto
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("script")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
              generateMode === "script"
                ? "gradient-accent text-primary-foreground shadow-glow-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="generate.mode_script_tab"
            disabled={modalOpen}
          >
            <ScrollText className="w-3.5 h-3.5" />
            My Script
          </button>
        </div>

        {showSkeleton ? (
          <div
            className="space-y-3"
            data-ocid="generate.brand_kit_loading_state"
          >
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <Card
            className="bg-card border-border shadow-elevated"
            data-ocid="generate.form_card"
          >
            <CardContent className="p-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="video-title" className="text-sm font-medium">
                  Video Title
                </label>
                <input
                  id="video-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Product Launch Explainer"
                  maxLength={120}
                  className="w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                  data-ocid="generate.title_input"
                  disabled={modalOpen}
                />
              </div>

              {/* Prompt (Auto mode only) */}
              {generateMode === "auto" && (
                <div className="space-y-1.5">
                  <label htmlFor="video-prompt" className="text-sm font-medium">
                    Topic / Prompt
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <textarea
                    id="video-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
                    placeholder="A futuristic cityscape at dusk with flying vehicles showing the future of urban transportation…"
                    rows={4}
                    className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none bg-secondary ${
                      prompt.length > 0 && !promptValid
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-input"
                    }`}
                    data-ocid="generate.prompt_textarea"
                    disabled={modalOpen}
                  />
                  <div className="flex items-center justify-between">
                    {prompt.length > 0 && prompt.length < 10 ? (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="generate.prompt_field_error"
                      >
                        Minimum 10 characters required
                      </p>
                    ) : (
                      <span />
                    )}
                    <p
                      className={`text-xs ml-auto ${
                        promptLength > 480
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {promptLength}/500
                    </p>
                  </div>
                </div>
              )}

              {/* Script (Script mode only) */}
              {generateMode === "script" && (
                <div className="space-y-1.5">
                  <label htmlFor="video-script" className="text-sm font-medium">
                    Your Script
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <textarea
                    id="video-script"
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Paste your script here… The AI will generate voiceover, visuals, and assemble your video from this script."
                    rows={8}
                    className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none bg-secondary ${
                      script.length > 0 && !scriptValid
                        ? "border-destructive focus:ring-destructive/50"
                        : "border-input"
                    }`}
                    data-ocid="generate.script_textarea"
                    disabled={modalOpen}
                  />
                  <div className="flex items-center justify-between">
                    {script.length > 0 && script.length < 50 ? (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="generate.script_field_error"
                      >
                        Minimum 50 characters required
                      </p>
                    ) : (
                      <span />
                    )}
                    <p className="text-xs text-muted-foreground ml-auto">
                      {scriptLength} characters
                    </p>
                  </div>
                </div>
              )}

              {/* Style selector */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Visual Style</p>
                <div
                  className="flex flex-wrap gap-2"
                  data-ocid="generate.style_section"
                >
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      disabled={modalOpen}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border transition-smooth ${
                        style === s.id
                          ? "gradient-accent text-primary-foreground border-transparent shadow-glow-primary"
                          : "border-border bg-secondary hover:bg-muted text-foreground"
                      }`}
                      data-ocid={`generate.style_${s.id}`}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect ratio + Duration row */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="space-y-1.5"
                  data-ocid="generate.aspect_ratio_section"
                >
                  <p className="text-sm font-medium">Aspect Ratio</p>
                  <div className="flex gap-2">
                    {ASPECT_RATIOS.map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setAspectRatio(ar)}
                        disabled={modalOpen}
                        className={`flex-1 py-2 rounded-md text-xs font-medium border transition-smooth ${
                          aspectRatio === ar
                            ? "gradient-accent text-primary-foreground border-transparent"
                            : "border-border bg-secondary hover:bg-muted"
                        }`}
                        data-ocid={`generate.ratio_${ar.replace(":", "x")}`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="video-duration"
                    className="text-sm font-medium"
                  >
                    Duration (seconds)
                  </label>
                  <div className="relative">
                    <select
                      id="video-duration"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      disabled={modalOpen}
                      className="w-full h-10 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth"
                      data-ocid="generate.duration_select"
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}s
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Credit cost */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-primary/5 border border-primary/10">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    {CREDIT_COST} credit
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    will be used for this video
                  </span>
                </p>
                {creditBalance && (
                  <Badge
                    variant={hasCredits ? "secondary" : "destructive"}
                    className="ml-auto text-xs"
                    data-ocid="generate.credit_balance_badge"
                  >
                    {availableCredits} available
                  </Badge>
                )}
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!formValid || modalOpen}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-md text-sm font-semibold transition-smooth ${
                    formValid && !modalOpen
                      ? "gradient-accent text-primary-foreground hover:opacity-90 shadow-glow-primary"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  data-ocid="generate.submit_button"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Video
                </button>
                {!hasCredits && (
                  <p
                    className="text-xs text-muted-foreground mt-2"
                    data-ocid="generate.submit_disabled_reason"
                  >
                    Add credits to enable video generation
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress modal */}
        <VideoGenerationModal
          open={modalOpen}
          jobId={activeJobId}
          jobMode={activeMode}
          onComplete={handleComplete}
          onFailure={handleFailure}
          onCancel={handleCancel}
          getVideoJob={getVideoJobForModal}
        />
      </div>
    </Layout>
  );
}
