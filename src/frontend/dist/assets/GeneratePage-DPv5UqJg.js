import { r as reactExports, j as jsxRuntimeExports, a as useNavigate, b as ue } from "./index-CMKZUFdA.js";
import { a as LoaderCircle, u as useCreditBalance, L as Layout, Z as Zap, B as Badge, V as Video } from "./badge-DORezHz4.js";
import { D as Dialog, a as DialogContent } from "./dialog-BE2wOEGo.js";
import { C as CircleCheck } from "./circle-check-D6IEpUVO.js";
import { c as createLucideIcon, u as useBackend } from "./createLucideIcon-CjzoZNB-.js";
import { C as Card, a as CardContent } from "./card-CI9qC1Hp.js";
import { S as Skeleton } from "./skeleton-BphBmZjD.js";
import { u as useBrandKit } from "./useBrandKit-k7ZqRIFc.js";
import { W as WandSparkles } from "./wand-sparkles--ZhrsTW6.js";
import { T as TriangleAlert } from "./triangle-alert-Br0KOIU-.js";
import { S as Sparkles } from "./sparkles-CZDi3JRe.js";
import { C as ChevronDown } from "./chevron-down-DDpYWC5T.js";
import "./index-BI5q8Z8b.js";
import "./useMutation-tcAt8btY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M7 3v18", key: "bbkbws" }],
  ["path", { d: "M3 7.5h4", key: "zfgn84" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }],
  ["path", { d: "M3 16.5h4", key: "1230mu" }],
  ["path", { d: "M17 3v18", key: "in4fa5" }],
  ["path", { d: "M17 7.5h4", key: "myr1c1" }],
  ["path", { d: "M17 16.5h4", key: "go4c1d" }]
];
const Film = createLucideIcon("film", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
];
const ScrollText = createLucideIcon("scroll-text", __iconNode);
const STAGE_ORDER = [
  "script",
  "voiceover",
  "images",
  "assembly"
];
const STAGE_LABELS = {
  script: "Generating Script",
  voiceover: "Creating Voiceover",
  images: "Generating Visuals",
  assembly: "Assembling Video"
};
const STAGE_LABELS_SCRIPT_MODE = {
  script: "Script Ready",
  voiceover: "Creating Voiceover",
  images: "Generating Visuals",
  assembly: "Assembling Video"
};
const STAGE_DESCRIPTIONS = {
  script: "Crafting a compelling narrative for your video…",
  voiceover: "Synthesizing a natural AI voice for the script…",
  images: "Generating cinematic visuals frame by frame…",
  assembly: "Merging audio and visuals into the final video…"
};
function StageRow({
  stage,
  currentStage,
  completedStages,
  isFailed,
  isUserScript
}) {
  const isCompleted = completedStages.includes(stage);
  const isCurrent = currentStage === stage && !isFailed;
  const isPending = !isCompleted && !isCurrent;
  const labels = isUserScript ? STAGE_LABELS_SCRIPT_MODE : STAGE_LABELS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${isCurrent ? "bg-primary/10 border border-primary/25" : "bg-muted/30"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary" }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 text-primary animate-spin" }) : isFailed && currentStage === stage ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-5 h-5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-5 h-5 text-muted-foreground/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-sm font-medium leading-none ${isCompleted ? "text-foreground" : isCurrent ? "text-foreground" : "text-muted-foreground"}`,
              children: labels[stage]
            }
          ),
          isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: STAGE_DESCRIPTIONS[stage] })
        ] }),
        isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium", children: "Done" }),
        isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-primary font-medium animate-pulse", children: "In progress" }),
        isPending && !isFailed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "Queued" })
      ]
    }
  );
}
function VideoGenerationModal({
  open,
  jobId,
  jobMode = "auto",
  onComplete,
  onFailure,
  onCancel,
  getVideoJob
}) {
  const isUserScript = jobMode === "script";
  const initialCompleted = isUserScript ? ["script"] : [];
  const [currentStage, setCurrentStage] = reactExports.useState(null);
  const [completedStages, setCompletedStages] = reactExports.useState(initialCompleted);
  const [isFailed, setIsFailed] = reactExports.useState(false);
  const [progressPercent, setProgressPercent] = reactExports.useState(isUserScript ? 25 : 0);
  const intervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open || !jobId) {
      setCurrentStage(null);
      setCompletedStages(isUserScript ? ["script"] : []);
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
          if (isUserScript && stage === "script") {
            setCurrentStage("voiceover");
            setCompletedStages(["script"]);
            setProgressPercent(25);
            return;
          }
          setCurrentStage(stage);
          const stageIdx = STAGE_ORDER.indexOf(stage);
          if (stageIdx >= 0) {
            const completed = STAGE_ORDER.slice(0, stageIdx);
            if (isUserScript && !completed.includes("script")) {
              completed.unshift("script");
            }
            setCompletedStages(completed);
            const pct = Math.round(stageIdx / STAGE_ORDER.length * 90);
            setProgressPercent(isUserScript ? Math.max(25, pct) : pct);
          }
        }
        if (status.__kind__ === "pending") {
          setProgressPercent(isUserScript ? 25 : 5);
        }
      } catch {
      }
    }
    pollJob();
    intervalRef.current = setInterval(pollJob, 3e3);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open, jobId, isUserScript, getVideoJob, onComplete, onFailure]);
  const completedCount = completedStages.length;
  const totalStages = STAGE_ORDER.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onCancel(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-md bg-card border-border shadow-elevated",
      "data-ocid": "generate.progress_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            LoaderCircle,
            {
              className: `w-6 h-6 text-primary-foreground ${!isFailed ? "animate-spin" : ""}`
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: isFailed ? "Generation Failed" : "Generating Your Video" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isFailed ? "Something went wrong. Please try again." : progressPercent >= 100 ? "Almost done…" : `Step ${completedCount + 1} of ${totalStages}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Overall progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
              progressPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full gradient-accent rounded-full transition-all duration-700 ease-out",
              style: { width: `${progressPercent}%` },
              "data-ocid": "generate.progress_bar"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mt-1", "data-ocid": "generate.stages_list", children: STAGE_ORDER.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          StageRow,
          {
            stage,
            currentStage,
            completedStages,
            isFailed,
            isUserScript
          },
          stage
        )) }),
        !isFailed && progressPercent < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground pt-1", children: "This usually takes 2–4 minutes. Feel free to wait here." }),
        !isFailed && progressPercent < 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onCancel,
            className: "w-full mt-1 py-2 rounded-md border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth",
            "data-ocid": "generate.cancel_button",
            children: "Cancel Generation"
          }
        )
      ]
    }
  ) });
}
const STYLES = [
  {
    id: "cinematic",
    label: "Cinematic",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5" })
  },
  {
    id: "animation",
    label: "Animation",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" })
  },
  {
    id: "photorealistic",
    label: "Photorealistic",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-3.5 h-3.5" })
  }
];
const ASPECT_RATIOS = ["16:9", "9:16", "1:1"];
const DURATIONS = [30, 60, 90, 120, 180, 240, 300];
const CREDIT_COST = 1;
const VALID_STYLES = ["cinematic", "animation", "photorealistic"];
const VALID_RATIOS = ["16:9", "9:16", "1:1"];
function isValidStyle(v) {
  return VALID_STYLES.includes(v);
}
function isValidRatio(v) {
  return VALID_RATIOS.includes(v);
}
function getScriptIdFromSearch() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("scriptId");
  if (!raw) return null;
  try {
    return BigInt(raw);
  } catch {
    return null;
  }
}
function GeneratePage() {
  const navigate = useNavigate();
  const { actor } = useBackend();
  const { data: creditBalance } = useCreditBalance();
  const { data: brandKit, isLoading: brandKitLoading } = useBrandKit();
  const brandKitApplied = reactExports.useRef(false);
  const scriptPrefillApplied = reactExports.useRef(false);
  const [generateMode, setGenerateMode] = reactExports.useState("auto");
  const [title, setTitle] = reactExports.useState("");
  const [prompt, setPrompt] = reactExports.useState("");
  const [script, setScript] = reactExports.useState("");
  const [style, setStyle] = reactExports.useState("cinematic");
  const [aspectRatio, setAspectRatio] = reactExports.useState("16:9");
  const [duration, setDuration] = reactExports.useState(60);
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [activeJobId, setActiveJobId] = reactExports.useState(null);
  const [activeMode, setActiveMode] = reactExports.useState("auto");
  reactExports.useEffect(() => {
    if (brandKitApplied.current || !brandKit) return;
    brandKitApplied.current = true;
    if (brandKit.visualStyle && isValidStyle(brandKit.visualStyle)) {
      setStyle(brandKit.visualStyle);
    }
    if (brandKit.aspectRatio && isValidRatio(brandKit.aspectRatio)) {
      setAspectRatio(brandKit.aspectRatio);
    }
  }, [brandKit]);
  reactExports.useEffect(() => {
    if (scriptPrefillApplied.current || !actor) return;
    const scriptId = getScriptIdFromSearch();
    if (!scriptId) return;
    scriptPrefillApplied.current = true;
    setGenerateMode("script");
    actor.getScript(scriptId).then((saved) => {
      if (!saved) return;
      if (saved.title) setTitle(saved.title);
      if (saved.content) setScript(saved.content);
    }).catch(() => {
    });
  }, [actor]);
  const availableCredits = Number((creditBalance == null ? void 0 : creditBalance.available) ?? 0);
  const hasCredits = availableCredits >= CREDIT_COST;
  const promptLength = prompt.length;
  const promptValid = promptLength >= 10 && promptLength <= 500;
  const scriptLength = script.length;
  const scriptValid = scriptLength >= 50;
  const modeInputValid = generateMode === "auto" ? promptValid : scriptValid;
  const formValid = title.trim().length > 0 && modeInputValid && hasCredits;
  function handleModeSwitch(mode) {
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
      ue.error("Not connected to backend. Please refresh.");
      return;
    }
    if (!title.trim()) {
      ue.error("Please enter a video title.");
      return;
    }
    if (!hasCredits) {
      ue.error("You don't have enough credits to generate a video.");
      return;
    }
    if (generateMode === "auto") {
      if (promptLength < 10) {
        ue.error("Prompt must be at least 10 characters.");
        return;
      }
      if (promptLength > 500) {
        ue.error("Prompt must be 500 characters or fewer.");
        return;
      }
    } else {
      if (scriptLength < 50) {
        ue.error("Script must be at least 50 characters.");
        return;
      }
    }
    try {
      const mode = generateMode === "auto" ? { __kind__: "auto", auto: null } : { __kind__: "userScript", userScript: { script: script.trim() } };
      const jobId = await actor.submitVideoJob({
        title: title.trim(),
        prompt: generateMode === "auto" ? prompt.trim() : "",
        mode
      });
      setActiveJobId(jobId);
      setActiveMode(generateMode);
      setModalOpen(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to start video generation.";
      ue.error(msg);
    }
  }
  async function getVideoJobForModal(jobId) {
    if (!actor) return null;
    return actor.getVideoJob(jobId);
  }
  function handleComplete(jobId) {
    setModalOpen(false);
    ue.success("Video generated successfully! Redirecting…");
    navigate({ to: "/video/$id", params: { id: String(jobId) } });
  }
  function handleFailure(reason) {
    setModalOpen(false);
    ue.error(reason, {
      action: {
        label: "Retry",
        onClick: () => handleGenerate()
      }
    });
  }
  function handleCancel() {
    setModalOpen(false);
    setActiveJobId(null);
    ue.info("Generation cancelled.");
  }
  const showSkeleton = brandKitLoading && !brandKitApplied.current;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 max-w-2xl mx-auto animate-fade-in",
      "data-ocid": "generate.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-2xl md:text-3xl flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-6 h-6 text-primary" }),
            "Generate Video"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Choose your mode: let AI write everything, or paste your own script." })
        ] }),
        !hasCredits && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 px-4 py-3 mb-5 rounded-lg bg-destructive/10 border border-destructive/25 text-sm",
            "data-ocid": "generate.no_credits_warning",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-destructive", children: "No credits remaining" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5", children: [
                  "You need at least ",
                  CREDIT_COST,
                  " credit to generate a video.",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "/pricing",
                      className: "text-primary underline underline-offset-2 hover:no-underline",
                      "data-ocid": "generate.upgrade_link",
                      children: "Upgrade your plan"
                    }
                  ),
                  " ",
                  "to continue."
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center p-1 mb-5 rounded-lg bg-muted/50 border border-border w-fit gap-1",
            "data-ocid": "generate.mode_toggle",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleModeSwitch("auto"),
                  className: `flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${generateMode === "auto" ? "gradient-accent text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"}`,
                  "data-ocid": "generate.mode_auto_tab",
                  disabled: modalOpen,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                    "Auto"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleModeSwitch("script"),
                  className: `flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-smooth ${generateMode === "script" ? "gradient-accent text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"}`,
                  "data-ocid": "generate.mode_script_tab",
                  disabled: modalOpen,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "w-3.5 h-3.5" }),
                    "My Script"
                  ]
                }
              )
            ]
          }
        ),
        showSkeleton ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "space-y-3",
            "data-ocid": "generate.brand_kit_loading_state",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "bg-card border-border shadow-elevated",
            "data-ocid": "generate.form_card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "video-title", className: "text-sm font-medium", children: "Video Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "video-title",
                    type: "text",
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    placeholder: "Product Launch Explainer",
                    maxLength: 120,
                    className: "w-full h-10 px-3 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
                    "data-ocid": "generate.title_input",
                    disabled: modalOpen
                  }
                )
              ] }),
              generateMode === "auto" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "video-prompt", className: "text-sm font-medium", children: [
                  "Topic / Prompt",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "video-prompt",
                    value: prompt,
                    onChange: (e) => setPrompt(e.target.value.slice(0, 500)),
                    placeholder: "A futuristic cityscape at dusk with flying vehicles showing the future of urban transportation…",
                    rows: 4,
                    className: `w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none bg-secondary ${prompt.length > 0 && !promptValid ? "border-destructive focus:ring-destructive/50" : "border-input"}`,
                    "data-ocid": "generate.prompt_textarea",
                    disabled: modalOpen
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  prompt.length > 0 && prompt.length < 10 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "generate.prompt_field_error",
                      children: "Minimum 10 characters required"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: `text-xs ml-auto ${promptLength > 480 ? "text-destructive" : "text-muted-foreground"}`,
                      children: [
                        promptLength,
                        "/500"
                      ]
                    }
                  )
                ] })
              ] }),
              generateMode === "script" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "video-script", className: "text-sm font-medium", children: [
                  "Your Script",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "video-script",
                    value: script,
                    onChange: (e) => setScript(e.target.value),
                    placeholder: "Paste your script here… The AI will generate voiceover, visuals, and assemble your video from this script.",
                    rows: 8,
                    className: `w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none bg-secondary ${script.length > 0 && !scriptValid ? "border-destructive focus:ring-destructive/50" : "border-input"}`,
                    "data-ocid": "generate.script_textarea",
                    disabled: modalOpen
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  script.length > 0 && script.length < 50 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "generate.script_field_error",
                      children: "Minimum 50 characters required"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground ml-auto", children: [
                    scriptLength,
                    " characters"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Visual Style" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-wrap gap-2",
                    "data-ocid": "generate.style_section",
                    children: STYLES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setStyle(s.id),
                        disabled: modalOpen,
                        className: `flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium border transition-smooth ${style === s.id ? "gradient-accent text-primary-foreground border-transparent shadow-glow-primary" : "border-border bg-secondary hover:bg-muted text-foreground"}`,
                        "data-ocid": `generate.style_${s.id}`,
                        children: [
                          s.icon,
                          s.label
                        ]
                      },
                      s.id
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "space-y-1.5",
                    "data-ocid": "generate.aspect_ratio_section",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Aspect Ratio" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ASPECT_RATIOS.map((ar) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setAspectRatio(ar),
                          disabled: modalOpen,
                          className: `flex-1 py-2 rounded-md text-xs font-medium border transition-smooth ${aspectRatio === ar ? "gradient-accent text-primary-foreground border-transparent" : "border-border bg-secondary hover:bg-muted"}`,
                          "data-ocid": `generate.ratio_${ar.replace(":", "x")}`,
                          children: ar
                        },
                        ar
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "video-duration",
                      className: "text-sm font-medium",
                      children: "Duration (seconds)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "select",
                      {
                        id: "video-duration",
                        value: duration,
                        onChange: (e) => setDuration(Number(e.target.value)),
                        disabled: modalOpen,
                        className: "w-full h-10 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth",
                        "data-ocid": "generate.duration_select",
                        children: DURATIONS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: d, children: [
                          d,
                          "s"
                        ] }, d))
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-md bg-primary/5 border border-primary/10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
                    CREDIT_COST,
                    " credit"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    " ",
                    "will be used for this video"
                  ] })
                ] }),
                creditBalance && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: hasCredits ? "secondary" : "destructive",
                    className: "ml-auto text-xs",
                    "data-ocid": "generate.credit_balance_badge",
                    children: [
                      availableCredits,
                      " available"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleGenerate,
                    disabled: !formValid || modalOpen,
                    className: `flex items-center gap-2 px-8 py-2.5 rounded-md text-sm font-semibold transition-smooth ${formValid && !modalOpen ? "gradient-accent text-primary-foreground hover:opacity-90 shadow-glow-primary" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
                    "data-ocid": "generate.submit_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                      "Generate Video"
                    ]
                  }
                ),
                !hasCredits && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground mt-2",
                    "data-ocid": "generate.submit_disabled_reason",
                    children: "Add credits to enable video generation"
                  }
                )
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          VideoGenerationModal,
          {
            open: modalOpen,
            jobId: activeJobId,
            jobMode: activeMode,
            onComplete: handleComplete,
            onFailure: handleFailure,
            onCancel: handleCancel,
            getVideoJob: getVideoJobForModal
          }
        )
      ]
    }
  ) });
}
export {
  GeneratePage as default
};
