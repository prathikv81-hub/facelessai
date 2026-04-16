import type { VideoJobPublic } from "@/backend.d";
import { Layout } from "@/components/Layout";
import { VideoCardSkeleton } from "@/components/LoadingSkeleton";
import { VideoJobCard } from "@/components/VideoJobCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { useCreditBalance } from "@/hooks/useCreditBalance";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  CalendarDays,
  Clapperboard,
  Clock,
  Eye,
  Plus,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";

function useVideoJobs() {
  const { actor, isFetching } = useBackend();
  return useQuery<VideoJobPublic[]>({
    queryKey: ["videoJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserVideoJobs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10_000,
  });
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  lowWarning?: boolean;
  isLoading?: boolean;
  ocid: string;
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
  lowWarning,
  isLoading,
  ocid,
}: StatCardProps) {
  return (
    <Card
      className={`bg-card border-border ${highlight ? "border-primary/40 shadow-glow-primary" : "shadow-card"}`}
      data-ocid={ocid}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                highlight ? "gradient-accent" : "bg-secondary"
              }`}
            >
              <span
                className={
                  highlight
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                }
              >
                {icon}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {label}
              </p>
              {isLoading ? (
                <Skeleton className="h-7 w-20 mt-1" />
              ) : (
                <p className="text-2xl font-display font-bold text-foreground mt-0.5">
                  {value}
                </p>
              )}
              {sub && !isLoading && (
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              )}
            </div>
          </div>
          {lowWarning && !isLoading && (
            <Badge
              variant="destructive"
              className="flex items-center gap-1 text-xs bg-destructive/20 text-destructive border border-destructive/30 flex-shrink-0"
              data-ocid="dashboard.low_credit_warning"
            >
              <AlertTriangle className="w-3 h-3" />
              Low
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsStatCard({
  icon,
  label,
  value,
  sub,
  accentColor,
  isLoading,
  ocid,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accentColor: "primary" | "accent" | "success";
  isLoading?: boolean;
  ocid: string;
}) {
  const colorMap = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      bar: "bg-primary",
    },
    accent: {
      bg: "bg-accent/10",
      icon: "text-accent",
      bar: "bg-accent",
    },
    success: {
      bg: "bg-success/10",
      icon: "text-success",
      bar: "bg-success",
    },
  };
  const colors = colorMap[accentColor];

  return (
    <Card className="bg-card border-border shadow-card" data-ocid={ocid}>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}
          >
            <span className={colors.icon}>{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-6 w-16 mt-1" />
            ) : (
              <p className="text-xl font-display font-bold text-foreground mt-0.5">
                {value}
              </p>
            )}
            {sub && !isLoading && (
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyVideoState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center animate-fade-in"
      data-ocid="dashboard.videos.empty_state"
    >
      <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mb-5 shadow-glow-primary">
        <Clapperboard className="w-10 h-10 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
        No videos yet
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        Create your first AI-generated faceless YouTube video and it will appear
        here.
      </p>
      <Button
        asChild
        className="gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
        data-ocid="dashboard.create_first_video_button"
      >
        <Link to="/generate">
          <Plus className="w-4 h-4 mr-2" />
          Create your first video
        </Link>
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  const { data: balance, isLoading: balanceLoading } = useCreditBalance();
  const { data: jobs, isLoading: jobsLoading } = useVideoJobs();
  const { data: analytics, isLoading: analyticsLoading } =
    useDashboardAnalytics();

  const isLowCredit = !balanceLoading && (balance?.available ?? 0) < 3;
  const now = new Date();
  const completedThisMonth = (jobs ?? []).filter((j) => {
    const created = new Date(Number(j.createdAt / 1_000_000n));
    return (
      j.status.__kind__ === "completed" &&
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const tierLabel = balance?.tier
    ? balance.tier.charAt(0).toUpperCase() + balance.tier.slice(1)
    : "Free";

  const totalViews = Number(analytics?.totalViews ?? 0n);
  const watchHours = Number(analytics?.totalWatchTimeHours ?? 0n);
  const completionRate = Number(analytics?.avgCompletionRate ?? 0n);

  const viewsDisplay =
    totalViews >= 1000
      ? `${(totalViews / 1000).toFixed(1)}K`
      : String(totalViews);
  const watchDisplay =
    watchHours >= 1000
      ? `${(watchHours / 1000).toFixed(1)}K hrs`
      : `${watchHours} hrs`;
  const completionDisplay = `${completionRate}%`;

  return (
    <Layout>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in"
        data-ocid="dashboard.page"
      >
        {/* Page header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Track your video generation history and credit usage.
            </p>
          </div>
          <Button
            asChild
            className="gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
            data-ocid="dashboard.new_video_button"
          >
            <Link to="/generate">
              <Video className="w-4 h-4 mr-2" />
              New Video
            </Link>
          </Button>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          data-ocid="dashboard.stats_section"
        >
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Credit Balance"
            value={balance?.available ?? 0}
            sub={`of ${balance?.total ?? 0} total`}
            highlight
            lowWarning={isLowCredit}
            isLoading={balanceLoading}
            ocid="stats.credit_balance_card"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Subscription"
            value={tierLabel}
            sub="Current plan"
            isLoading={balanceLoading}
            ocid="stats.subscription_card"
          />
          <StatCard
            icon={<CalendarDays className="w-5 h-5" />}
            label="Videos This Month"
            value={completedThisMonth}
            sub="Completed"
            isLoading={jobsLoading}
            ocid="stats.videos_month_card"
          />
        </div>

        {/* Analytics row */}
        <div data-ocid="dashboard.analytics_section">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Channel Analytics
            </h2>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            data-ocid="dashboard.analytics_stats_row"
          >
            <AnalyticsStatCard
              icon={<Eye className="w-4 h-4" />}
              label="Total Views"
              value={viewsDisplay}
              sub="All time"
              accentColor="accent"
              isLoading={analyticsLoading}
              ocid="stats.total_views_card"
            />
            <AnalyticsStatCard
              icon={<Clock className="w-4 h-4" />}
              label="Watch Time"
              value={watchDisplay}
              sub="Total hours watched"
              accentColor="primary"
              isLoading={analyticsLoading}
              ocid="stats.watch_time_card"
            />
            <AnalyticsStatCard
              icon={<TrendingUp className="w-4 h-4" />}
              label="Avg Completion"
              value={completionDisplay}
              sub="Average rate"
              accentColor="success"
              isLoading={analyticsLoading}
              ocid="stats.avg_completion_card"
            />
          </div>
        </div>

        {/* Video History */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg font-semibold text-foreground">
                Video History
              </CardTitle>
              {jobs && jobs.length > 0 && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {jobs.length} total
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {jobsLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="dashboard.videos.loading_state"
              >
                {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((k) => (
                  <VideoCardSkeleton key={k} />
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="dashboard.videos.list"
              >
                {jobs.map((job, index) => (
                  <VideoJobCard
                    key={String(job.id)}
                    job={job}
                    index={index + 1}
                  />
                ))}
              </div>
            ) : (
              <EmptyVideoState />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
