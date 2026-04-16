import type { VideoPublicView } from "@/backend.d";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Eye, Play, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

// ---------- helpers ----------

function formatDate(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatViews(count: bigint): string {
  const n = Number(count);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ---------- hook ----------

function usePublicVideo(token: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<VideoPublicView | null>({
    queryKey: ["publicVideo", token],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPublicVideo(token);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

// ---------- engagement tracking ----------

function useEngagementTracker(
  videoId: bigint | null,
  actor: {
    recordVideoEngagement: (
      id: bigint,
      watchTime: bigint,
      completion: bigint,
    ) => Promise<void>;
  } | null,
) {
  const startTimeRef = useRef<number>(Date.now());
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoId || !actor) return;
    startTimeRef.current = Date.now();

    return () => {
      const watchTimeSecs = BigInt(
        Math.round((Date.now() - startTimeRef.current) / 1000),
      );
      const videoEl = videoRef.current;
      let completionPercent = 0n;
      if (videoEl && videoEl.duration > 0) {
        completionPercent = BigInt(
          Math.min(
            100,
            Math.round((videoEl.currentTime / videoEl.duration) * 100),
          ),
        );
      }
      actor
        .recordVideoEngagement(videoId, watchTimeSecs, completionPercent)
        .catch(() => {
          /* best-effort */
        });
    };
  }, [videoId, actor]);

  return videoRef;
}

// ---------- sub-components ----------

function ShareSkeleton() {
  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="share.loading_state"
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <Skeleton className="h-7 w-36" />
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </main>
    </div>
  );
}

function ShareError({ message }: { message: string }) {
  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="share.error_state"
    >
      <header className="bg-card border-b border-border px-6 py-4">
        <BrandLogo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <Play className="w-8 h-8 text-destructive/50" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Video not available
        </h1>
        <p className="text-muted-foreground max-w-sm">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary"
          data-ocid="share.cta_link"
        >
          <Sparkles className="w-4 h-4" />
          Create your own videos
        </Link>
      </main>
    </div>
  );
}

function BrandLogo() {
  return (
    <Link to="/" className="flex items-center" data-ocid="share.brand_logo">
      <img
        src="/assets/logo.jpg"
        alt="FacelessAI"
        className="h-8 w-auto object-contain"
      />
    </Link>
  );
}

// ---------- main page ----------

export default function SharePage() {
  const params = useParams({ strict: false }) as { token?: string };
  const token = params.token ?? "";
  const { data: video, isLoading, isError } = usePublicVideo(token);

  const { actor } = useBackend();
  const videoRef = useEngagementTracker(
    video?.videoJobId ?? null,
    actor as {
      recordVideoEngagement: (
        id: bigint,
        watchTime: bigint,
        completion: bigint,
      ) => Promise<void>;
    } | null,
  );

  if (isLoading) return <ShareSkeleton />;

  if (isError || video === null || video === undefined) {
    return (
      <ShareError message="This link may have expired or the video was removed." />
    );
  }

  const videoUrl = video.videoUrl ?? null;
  const thumbnailUrl = video.thumbnailUrl ?? null;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="share.page"
    >
      {/* Branded header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <BrandLogo />
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary"
            data-ocid="share.header_cta"
          >
            <Sparkles className="w-4 h-4" />
            Start Creating Free
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
        {/* Video player */}
        <div
          className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 aspect-video shadow-elevated border border-border"
          data-ocid="share.video_container"
        >
          {videoUrl ? (
            // biome-ignore lint/a11y/useMediaCaption: captions not available for AI-generated videos
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl ?? undefined}
              className="w-full h-full object-contain"
              controls
              playsInline
              data-ocid="share.video_player"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-2">
          <h1
            className="text-2xl font-display font-bold text-foreground"
            data-ocid="share.video_title"
          >
            {video.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {formatViews(video.viewCount)}{" "}
              {Number(video.viewCount) === 1 ? "view" : "views"}
            </span>
            <span>•</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>
          {video.description && (
            <p className="text-muted-foreground text-sm leading-relaxed pt-1">
              {video.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* CTA */}
        <div
          className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-5 shadow-card"
          data-ocid="share.cta_section"
        >
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow-glow-primary">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="font-display font-bold text-foreground">
              Create your own faceless videos
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Turn any idea into a polished YouTube video — no camera required.
            </p>
          </div>
          <Link
            to="/"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 gradient-accent text-primary-foreground font-semibold rounded-lg text-sm transition-smooth hover:opacity-90 shadow-glow-primary whitespace-nowrap"
            data-ocid="share.start_creating_button"
          >
            <Sparkles className="w-4 h-4" />
            Get started free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.hostname : "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-smooth"
        >
          Built with love using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
