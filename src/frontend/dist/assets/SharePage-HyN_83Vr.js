import { f as useParams, j as jsxRuntimeExports, L as Link, r as reactExports } from "./index-CMKZUFdA.js";
import { S as Skeleton } from "./skeleton-BphBmZjD.js";
import { u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { S as Sparkles } from "./sparkles-CZDi3JRe.js";
import { P as Play } from "./play-X99IGw7N.js";
import { E as Eye } from "./eye-Bc2Ektrz.js";
function formatDate(ts) {
  const date = new Date(Number(ts / 1000000n));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function formatViews(count) {
  const n = Number(count);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}
function usePublicVideo(token) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["publicVideo", token],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPublicVideo(token);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function useEngagementTracker(videoId, actor) {
  const startTimeRef = reactExports.useRef(Date.now());
  const videoRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!videoId || !actor) return;
    startTimeRef.current = Date.now();
    return () => {
      const watchTimeSecs = BigInt(
        Math.round((Date.now() - startTimeRef.current) / 1e3)
      );
      const videoEl = videoRef.current;
      let completionPercent = 0n;
      if (videoEl && videoEl.duration > 0) {
        completionPercent = BigInt(
          Math.min(
            100,
            Math.round(videoEl.currentTime / videoEl.duration * 100)
          )
        );
      }
      actor.recordVideoEngagement(videoId, watchTimeSecs, completionPercent).catch(() => {
      });
    };
  }, [videoId, actor]);
  return videoRef;
}
function ShareSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "share.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-36" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-video w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-2/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/3" })
        ] })
      ]
    }
  );
}
function ShareError({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "share.error_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-8 h-8 text-destructive/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Video not available" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-sm", children: message }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "inline-flex items-center gap-2 px-5 py-2.5 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary",
              "data-ocid": "share.cta_link",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                "Create your own videos"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function BrandLogo() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center", "data-ocid": "share.brand_logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: "/assets/logo.jpg",
      alt: "FacelessAI",
      className: "h-8 w-auto object-contain"
    }
  ) });
}
function SharePage() {
  const params = useParams({ strict: false });
  const token = params.token ?? "";
  const { data: video, isLoading, isError } = usePublicVideo(token);
  const { actor } = useBackend();
  const videoRef = useEngagementTracker(
    (video == null ? void 0 : video.videoJobId) ?? null,
    actor
  );
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(ShareSkeleton, {});
  if (isError || video === null || video === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ShareError, { message: "This link may have expired or the video was removed." });
  }
  const videoUrl = video.videoUrl ?? null;
  const thumbnailUrl = video.thumbnailUrl ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col",
      "data-ocid": "share.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BrandLogo, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/",
              className: "hidden sm:inline-flex items-center gap-2 px-4 py-2 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary",
              "data-ocid": "share.header_cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                "Start Creating Free"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 aspect-video shadow-elevated border border-border",
              "data-ocid": "share.video_container",
              children: videoUrl ? (
                // biome-ignore lint/a11y/useMediaCaption: captions not available for AI-generated videos
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "video",
                  {
                    ref: videoRef,
                    src: videoUrl,
                    poster: thumbnailUrl ?? void 0,
                    className: "w-full h-full object-contain",
                    controls: true,
                    playsInline: true,
                    "data-ocid": "share.video_player"
                  }
                )
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-16 h-16 text-muted-foreground/30" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h1",
              {
                className: "text-2xl font-display font-bold text-foreground",
                "data-ocid": "share.video_title",
                children: video.title
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                formatViews(video.viewCount),
                " ",
                Number(video.viewCount) === 1 ? "view" : "views"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(video.createdAt) })
            ] }),
            video.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed pt-1", children: video.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-5 shadow-card",
              "data-ocid": "share.cta_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-primary-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-left min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Create your own faceless videos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Turn any idea into a polished YouTube video — no camera required." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/",
                    className: "flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary whitespace-nowrap",
                    "data-ocid": "share.start_creating_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
                      "Get started free"
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-card border-t border-border py-5 text-center text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          ".",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : ""
              )}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "underline hover:text-foreground transition-smooth",
              children: "Built with love using caffeine.ai"
            }
          )
        ] })
      ]
    }
  );
}
export {
  SharePage as default
};
