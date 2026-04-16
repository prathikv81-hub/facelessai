import type {
  VideoJobStatus as BackendStatus,
  PublishToYouTubeRequest,
  VideoJobPublic,
} from "@/backend.d";
import { YouTubePublishStatus, YouTubeVisibility } from "@/backend.d";
import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import { useSaveScript } from "@/hooks/useScripts";
import { useSharingActions } from "@/hooks/useSharingActions";
import { useVideoAnalytics } from "@/hooks/useVideoAnalytics";
import { useYouTubeActions } from "@/hooks/useYouTubeActions";
import { useYouTubeConnection } from "@/hooks/useYouTubeConnection";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  BarChart2,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Loader2,
  Mic,
  Share2,
  Timer,
  Trash2,
  Video,
  VideoOff,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ---------- helpers ----------

function formatDate(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(seconds: bigint | undefined): string {
  if (!seconds) return "—";
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}

function formatWatchTime(totalSecs: bigint): string {
  const mins = Math.round(Number(totalSecs) / 60);
  if (mins < 1) return `${Number(totalSecs)}s`;
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs}h ${remMins}m`;
}

type StatusMeta = { label: string; className: string; icon: React.ReactNode };

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

// ---------- local hooks ----------

function useVideoJob(id: bigint) {
  const { actor, isFetching } = useBackend();
  return useQuery<VideoJobPublic | null>({
    queryKey: ["videoJob", String(id)],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVideoJob(id);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: (query) => {
      const job = query.state.data;
      if (job?.status.__kind__ === "processing") return 5_000;
      return false;
    },
  });
}

function useDeleteVideoJob() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVideoJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videoJobs"] });
    },
  });
}

// ---------- sub-components ----------

function VideoPlayer({ url }: { url: string }) {
  return (
    // biome-ignore lint/a11y/useMediaCaption: captions not available for AI-generated videos
    <video
      className="w-full h-full object-contain rounded-lg"
      controls
      controlsList="nodownload"
      playsInline
      data-ocid="video_detail.video_player"
    >
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  );
}

function AudioPlayer({ url }: { url: string }) {
  return (
    // biome-ignore lint/a11y/useMediaCaption: captions not available for AI-generated audio
    <audio className="w-full" controls data-ocid="video_detail.audio_player">
      <source src={url} />
    </audio>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value}
      </span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div
      className="space-y-6 animate-fade-in"
      data-ocid="video_detail.loading_state"
    >
      <Skeleton className="h-5 w-40" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ---------- Share Section ----------

function ShareSection({ job }: { job: VideoJobPublic }) {
  const { generateShareLink, copyShareLink } = useSharingActions();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!job.shareUrl) return;
    copyShareLink(job.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleGenerate() {
    generateShareLink.mutate(job.id);
  }

  return (
    <Card
      className="bg-card border-border shadow-card"
      data-ocid="video_detail.share_section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Share2 className="w-4 h-4 text-primary" />
          Share Video
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {job.shareUrl ? (
          <>
            <div className="share-widget">
              <Globe className="w-4 h-4 flex-shrink-0 text-primary/70" />
              <span className="flex-1 truncate text-xs">{job.shareUrl}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full border-border transition-smooth",
                copied && "border-green-500/40 text-green-400 bg-green-500/10",
              )}
              onClick={handleCopy}
              data-ocid="video_detail.copy_link_button"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Generate a public share link so anyone can watch this video.
            </p>
            <Button
              size="sm"
              className="w-full gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
              onClick={handleGenerate}
              disabled={generateShareLink.isPending}
              data-ocid="video_detail.generate_share_button"
            >
              {generateShareLink.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {generateShareLink.isPending
                ? "Generating…"
                : "Generate Share Link"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Analytics Section ----------

function AnalyticsSection({ jobId }: { jobId: bigint }) {
  const { data: analytics, isLoading } = useVideoAnalytics(jobId);

  const stats = [
    {
      icon: <Eye className="w-4 h-4 text-accent" />,
      label: "Views",
      value: analytics ? String(analytics.viewCount) : "0",
    },
    {
      icon: <Timer className="w-4 h-4 text-primary" />,
      label: "Watch Time",
      value: analytics ? formatWatchTime(analytics.totalWatchTimeSecs) : "0s",
    },
    {
      icon: <BarChart2 className="w-4 h-4 text-green-400" />,
      label: "Completion",
      value: analytics ? `${String(analytics.completionRatePercent)}%` : "0%",
    },
  ];

  return (
    <Card
      className="bg-card border-border shadow-card"
      data-ocid="video_detail.analytics_section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <BarChart2 className="w-4 h-4 text-primary" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg bg-muted/40 border border-border p-2.5 text-center"
                >
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="font-display font-bold text-sm text-foreground">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            {analytics?.lastViewedAt && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Last viewed {formatDateShort(analytics.lastViewedAt)}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- YouTube Publish Dialog ----------

interface PublishDialogProps {
  job: VideoJobPublic;
}

function YouTubePublishDialog({ job }: PublishDialogProps) {
  const { publishToYouTube } = useYouTubeActions();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(job.title);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [visibility, setVisibility] = useState<YouTubeVisibility>(
    YouTubeVisibility.public_,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const request: PublishToYouTubeRequest = {
      title,
      description,
      tags,
      visibility: visibility as YouTubeVisibility,
    };
    publishToYouTube.mutate(
      { videoId: job.id, request },
      {
        onSuccess: () => {
          toast.success("Publishing to YouTube started!");
          setOpen(false);
        },
        onError: (err) => toast.error(`Failed to publish: ${err.message}`),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
          size="sm"
          data-ocid="video_detail.publish_yt_open_modal_button"
        >
          <Youtube className="w-4 h-4 mr-2" />
          Publish to YouTube
        </Button>
      </DialogTrigger>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="video_detail.publish_yt_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-400" />
            Publish to YouTube
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="yt-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="yt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-input border-border"
              data-ocid="video_detail.yt_title_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="yt-description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="yt-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe your video…"
              className="bg-input border-border resize-none"
              data-ocid="video_detail.yt_description_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="yt-tags" className="text-sm font-medium">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="yt-tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="faceless, ai, youtube"
              className="bg-input border-border"
              data-ocid="video_detail.yt_tags_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as YouTubeVisibility)}
            >
              <SelectTrigger
                className="bg-input border-border"
                data-ocid="video_detail.yt_visibility_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value={YouTubeVisibility.public_}>
                  Public
                </SelectItem>
                <SelectItem value={YouTubeVisibility.unlisted}>
                  Unlisted
                </SelectItem>
                <SelectItem value={YouTubeVisibility.private_}>
                  Private
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border"
              onClick={() => setOpen(false)}
              data-ocid="video_detail.yt_cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={publishToYouTube.isPending || !title.trim()}
              className="flex-1 gradient-accent text-primary-foreground hover:opacity-90 shadow-glow-primary"
              data-ocid="video_detail.yt_submit_button"
            >
              {publishToYouTube.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Youtube className="w-4 h-4 mr-2" />
              )}
              {publishToYouTube.isPending ? "Publishing…" : "Publish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------- YouTube Section ----------

function YouTubeSection({ job }: { job: VideoJobPublic }) {
  const { data: ytStatus, isLoading } = useYouTubeConnection();

  const isPublished =
    job.youtubePublishStatus === YouTubePublishStatus.published;
  const isPublishing =
    job.youtubePublishStatus === YouTubePublishStatus.publishing;
  const publishFailed =
    job.youtubePublishStatus === YouTubePublishStatus.failed;
  const isCompleted = job.status.__kind__ === "completed";

  return (
    <Card
      className="bg-card border-border shadow-card"
      data-ocid="video_detail.youtube_section"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <Youtube className="w-4 h-4 text-red-400" />
          YouTube
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : !ytStatus?.connected ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Connect your YouTube channel to publish videos directly.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full border-border hover:bg-secondary transition-smooth"
              data-ocid="video_detail.connect_yt_button"
            >
              <Link to="/settings">
                <Youtube className="w-4 h-4 mr-2 text-red-400" />
                Connect YouTube in Settings
              </Link>
            </Button>
          </div>
        ) : isPublished ? (
          <div className="space-y-3">
            <div className="publish-status-indicator w-full justify-center">
              <CheckCircle2 className="w-4 h-4" />
              Published on {ytStatus.channelName ?? "YouTube"}
            </div>
            {job.youtubeUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 transition-smooth"
                data-ocid="video_detail.view_on_yt_button"
              >
                <a
                  href={job.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on YouTube
                </a>
              </Button>
            )}
          </div>
        ) : isPublishing ? (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            Publishing in progress…
          </div>
        ) : (
          <div className="space-y-2">
            {publishFailed && (
              <div className="flex items-center gap-2 text-xs text-destructive mb-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                Previous publish attempt failed. Try again.
              </div>
            )}
            {ytStatus.channelName && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                Connected as{" "}
                <span className="text-foreground font-medium">
                  {ytStatus.channelName}
                </span>
              </div>
            )}
            {isCompleted ? (
              <YouTubePublishDialog job={job} />
            ) : (
              <p className="text-xs text-muted-foreground">
                Video must be completed before publishing.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- main page ----------

export default function VideoDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const navigate = useNavigate();
  const jobId = BigInt(params.id ?? "0");

  const { data: job, isLoading } = useVideoJob(jobId);
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteVideoJob();
  const { mutate: saveScript, isPending: isSaving } = useSaveScript();

  const handleDelete = () => {
    deleteJob(jobId, {
      onSuccess: () => {
        toast.success("Video deleted successfully");
        navigate({ to: "/dashboard" });
      },
      onError: () => toast.error("Failed to delete video"),
    });
  };

  const videoUrl = job?.videoUrl?.getDirectURL();
  const voiceoverUrl = job?.voiceoverUrl?.getDirectURL();
  const statusMeta = job ? resolveStatus(job.status) : null;
  const isCompleted = job?.status.__kind__ === "completed";

  return (
    <Layout>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in"
        data-ocid="video_detail.page"
      >
        {/* Back nav */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth text-sm mb-6"
          data-ocid="video_detail.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {isLoading ? (
          <DetailSkeleton />
        ) : !job ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="video_detail.error_state"
          >
            <VideoOff className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Video not found
            </h2>
            <p className="text-muted-foreground mb-6">
              This video job doesn't exist or was deleted.
            </p>
            <Button
              asChild
              variant="secondary"
              data-ocid="video_detail.go_back_button"
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Title + actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-display font-bold text-foreground truncate">
                  {job.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatDate(job.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {statusMeta && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 text-xs px-2.5 py-1 border",
                      statusMeta.className,
                    )}
                  >
                    {statusMeta.icon}
                    {statusMeta.label}
                  </Badge>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                      data-ocid="video_detail.delete_button"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="bg-card border-border"
                    data-ocid="video_detail.delete_dialog"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display">
                        Delete this video?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The video and all
                        associated data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-ocid="video_detail.delete_cancel_button">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-ocid="video_detail.delete_confirm_button"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : null}
                        Delete permanently
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: video + voiceover + script */}
              <div className="lg:col-span-2 space-y-5">
                {/* Video player / placeholder */}
                <Card className="bg-card border-border shadow-elevated overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    {videoUrl ? (
                      <VideoPlayer url={videoUrl} />
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                        {job.status.__kind__ === "processing" ? (
                          <>
                            <Loader2 className="w-12 h-12 animate-spin text-primary/50" />
                            <p className="text-sm">Generating video…</p>
                            {job.currentStage && (
                              <p className="text-xs text-primary/70 capitalize">
                                Stage: {job.currentStage}
                              </p>
                            )}
                            <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full gradient-accent animate-progress-pulse"
                                style={{ width: "55%" }}
                              />
                            </div>
                          </>
                        ) : job.status.__kind__ === "failed" ? (
                          <>
                            <AlertCircle className="w-12 h-12 text-destructive/50" />
                            <p className="text-sm text-destructive/70">
                              {job.status.failed?.reason ?? "Generation failed"}
                            </p>
                          </>
                        ) : (
                          <VideoOff className="w-12 h-12" />
                        )}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Download / open actions */}
                {videoUrl && (
                  <div className="flex gap-3 flex-wrap">
                    <Button
                      asChild
                      className="gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
                      data-ocid="video_detail.download_button"
                    >
                      <a href={videoUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download MP4
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-border hover:bg-secondary transition-smooth"
                      data-ocid="video_detail.open_button"
                    >
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in new tab
                      </a>
                    </Button>
                  </div>
                )}

                {/* Voiceover player */}
                {voiceoverUrl && (
                  <Card
                    className="bg-card border-border"
                    data-ocid="video_detail.voiceover_section"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                        <Mic className="w-4 h-4 text-primary" />
                        Voiceover Audio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AudioPlayer url={voiceoverUrl} />
                    </CardContent>
                  </Card>
                )}

                {/* Script accordion */}
                {job.script && (
                  <Accordion
                    type="single"
                    collapsible
                    data-ocid="video_detail.script_accordion"
                  >
                    <AccordionItem
                      value="script"
                      className="border border-border rounded-xl bg-card px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Script Preview
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-muted/40 rounded-lg p-4 max-h-80 overflow-y-auto">
                          {job.script}
                        </pre>
                        <div className="mt-3 pb-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/30 text-primary hover:bg-primary/10 transition-smooth"
                            disabled={isSaving}
                            onClick={() =>
                              saveScript(
                                { title: job.title, content: job.script! },
                                {
                                  onSuccess: () =>
                                    toast.success(
                                      "Script saved to your library",
                                      {
                                        action: {
                                          label: "View Library",
                                          onClick: () =>
                                            navigate({ to: "/scripts" }),
                                        },
                                      },
                                    ),
                                  onError: (err) =>
                                    toast.error(
                                      err.message ?? "Failed to save script",
                                    ),
                                },
                              )
                            }
                            data-ocid="video_detail.save_script_button"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            ) : (
                              <BookmarkPlus className="w-4 h-4 mr-1.5" />
                            )}
                            {isSaving ? "Saving…" : "Save to Library"}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </div>

              {/* Right: metadata + share + analytics + youtube */}
              <div className="space-y-5">
                {/* Video details */}
                <Card
                  className="bg-card border-border shadow-card"
                  data-ocid="video_detail.info_card"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
                      <Video className="w-4 h-4 text-primary" />
                      Video Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="divide-y divide-border">
                      <MetaRow
                        label="Mode"
                        value={
                          <span className="capitalize">
                            {job.mode.__kind__}
                          </span>
                        }
                      />
                      <MetaRow
                        label="Duration"
                        value={formatDuration(job.durationSeconds)}
                      />
                      <MetaRow
                        label="Credits Spent"
                        value={
                          <span className="flex items-center gap-1">
                            <Coins className="w-3.5 h-3.5 text-primary/70" />
                            {String(job.creditsSpent)}
                          </span>
                        }
                      />
                      <MetaRow
                        label="Created"
                        value={formatDate(job.createdAt)}
                      />
                      <MetaRow
                        label="Updated"
                        value={formatDate(job.updatedAt)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Prompt */}
                <Card
                  className="bg-card border-border shadow-card"
                  data-ocid="video_detail.prompt_card"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground">
                      Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {job.prompt}
                    </p>
                  </CardContent>
                </Card>

                {/* Share */}
                {isCompleted && <ShareSection job={job} />}

                {/* Analytics */}
                <AnalyticsSection jobId={jobId} />

                {/* YouTube */}
                {isCompleted && <YouTubeSection job={job} />}

                {/* Error message */}
                {job.errorMessage && (
                  <Card
                    className="bg-destructive/10 border-destructive/30"
                    data-ocid="video_detail.error_state"
                  >
                    <CardContent className="p-4 flex gap-3">
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">
                        {job.errorMessage}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
