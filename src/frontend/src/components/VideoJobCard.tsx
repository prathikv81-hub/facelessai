import type {
  VideoJobStatus as BackendStatus,
  VideoJobPublic,
} from "@/backend.d";
import { YouTubePublishStatus } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  Loader2,
  Play,
  Share2,
  Timer,
  VideoOff,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

type StatusMeta = {
  label: string;
  className: string;
  icon: React.ReactNode;
};

function resolveStatus(status: BackendStatus): StatusMeta {
  switch (status.__kind__) {
    case "pending":
      return {
        label: "Pending",
        className: "bg-muted text-muted-foreground border-border",
        icon: <Clock className="w-3 h-3" />,
      };
    case "processing":
      return {
        label: "Processing",
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case "failed":
      return {
        label: "Failed",
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <AlertCircle className="w-3 h-3" />,
      };
  }
}

function resolveYouTubeStatusMeta(
  ytStatus: YouTubePublishStatus,
): { label: string; className: string; icon: React.ReactNode } | null {
  switch (ytStatus) {
    case YouTubePublishStatus.published:
      return {
        label: "On YouTube",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: <Youtube className="w-3 h-3" />,
      };
    case YouTubePublishStatus.publishing:
      return {
        label: "Publishing…",
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
      };
    case YouTubePublishStatus.failed:
      return {
        label: "YT Failed",
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: <AlertCircle className="w-3 h-3" />,
      };
    default:
      return null;
  }
}

function formatDate(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(seconds: bigint | undefined): string {
  if (!seconds) return "";
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}

interface VideoJobCardProps {
  job: VideoJobPublic;
  index: number;
  onShare?: (job: VideoJobPublic) => void;
}

export function VideoJobCard({ job, index, onShare }: VideoJobCardProps) {
  const statusMeta = resolveStatus(job.status);
  const ytStatusMeta = resolveYouTubeStatusMeta(job.youtubePublishStatus);
  const thumbnailUrl = job.thumbnailUrl
    ? job.thumbnailUrl.getDirectURL()
    : null;
  const duration = formatDuration(job.durationSeconds);
  const isProcessing = job.status.__kind__ === "processing";
  const isCompleted = job.status.__kind__ === "completed";

  function handleShareClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(job);
    } else if (job.shareUrl) {
      navigator.clipboard.writeText(job.shareUrl).then(() => {
        toast.success("Share link copied!");
      });
    } else {
      toast.info("Generate a share link from the video detail page.");
    }
  }

  return (
    <Link
      to="/video/$id"
      params={{ id: String(job.id) }}
      data-ocid={`video.item.${index}`}
      className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
    >
      <Card
        className={cn(
          "overflow-hidden border-border bg-card hover:border-primary/40 transition-smooth cursor-pointer",
          "hover:shadow-elevated hover:-translate-y-0.5",
        )}
      >
        {/* Thumbnail */}
        <div className="relative h-44 bg-muted overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={job.title}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <VideoOff className="w-10 h-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Hover play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth bg-background/40">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center shadow-glow-primary">
              <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" />
            </div>
          </div>

          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-xs font-mono text-foreground">
              <Timer className="w-3 h-3" />
              {duration}
            </div>
          )}

          {/* Share button — top-right, visible on hover */}
          {isCompleted && (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShareClick}
              data-ocid={`video.share_button.${index}`}
              aria-label="Share video"
              className={cn(
                "absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm",
                "opacity-0 group-hover:opacity-100 transition-smooth",
                "hover:bg-primary/20 hover:text-primary",
              )}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          )}

          {/* Processing progress bar */}
          {isProcessing && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div
                className="h-full gradient-accent animate-progress-pulse"
                style={{ width: "60%" }}
              />
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-smooth">
              {job.title}
            </h3>
            <p
              className="text-xs text-muted-foreground mt-0.5 line-clamp-1"
              title={job.prompt}
            >
              {job.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-0.5 border",
                  statusMeta.className,
                )}
              >
                {statusMeta.icon}
                {statusMeta.label}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 border-border text-muted-foreground capitalize"
              >
                {job.mode.__kind__}
              </Badge>
              {ytStatusMeta && (
                <Badge
                  variant="outline"
                  data-ocid={`video.yt_status.${index}`}
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 border",
                    ytStatusMeta.className,
                  )}
                >
                  {ytStatusMeta.icon}
                  {ytStatusMeta.label}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Coins className="w-3 h-3 text-primary/70" />
              <span className="font-mono">{String(job.creditsSpent)}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {formatDate(job.createdAt)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
