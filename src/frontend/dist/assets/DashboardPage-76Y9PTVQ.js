import { j as jsxRuntimeExports, L as Link, c as cn, b as ue, V as VideoCardSkeleton } from "./index-CMKZUFdA.js";
import { B as Badge, a as LoaderCircle, Y as YouTubePublishStatus, u as useCreditBalance, L as Layout, V as Video, Z as Zap } from "./badge-DORezHz4.js";
import { B as Button } from "./button-BfOBeu4g.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CI9qC1Hp.js";
import { V as VideoOff, T as Timer, S as Share2, C as Coins, a as CircleAlert, b as Clock, Y as Youtube, c as ChartNoAxesColumn } from "./youtube-Czxj46e6.js";
import { P as Play } from "./play-X99IGw7N.js";
import { C as CircleCheck } from "./circle-check-D6IEpUVO.js";
import { S as Skeleton } from "./skeleton-BphBmZjD.js";
import { c as createLucideIcon, u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { E as Eye } from "./eye-Bc2Ektrz.js";
import { T as TriangleAlert } from "./triangle-alert-Br0KOIU-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    { d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z", key: "1tn4o7" }
  ],
  ["path", { d: "m6.2 5.3 3.1 3.9", key: "iuk76l" }],
  ["path", { d: "m12.4 3.4 3.1 4", key: "6hsd6n" }],
  ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", key: "ltgou9" }]
];
const Clapperboard = createLucideIcon("clapperboard", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function resolveStatus(status) {
  switch (status.__kind__) {
    case "pending":
      return {
        label: "Pending",
        className: "bg-muted text-muted-foreground border-border",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" })
      };
    case "processing":
      return {
        label: "Processing",
        className: "bg-primary/20 text-primary border-primary/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" })
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" })
      };
    case "failed":
      return {
        label: "Failed",
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" })
      };
  }
}
function resolveYouTubeStatusMeta(ytStatus) {
  switch (ytStatus) {
    case YouTubePublishStatus.published:
      return {
        label: "On YouTube",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Youtube, { className: "w-3 h-3" })
      };
    case YouTubePublishStatus.publishing:
      return {
        label: "Publishing…",
        className: "bg-primary/20 text-primary border-primary/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" })
      };
    case YouTubePublishStatus.failed:
      return {
        label: "YT Failed",
        className: "bg-destructive/20 text-destructive border-destructive/30",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3" })
      };
    default:
      return null;
  }
}
function formatDate(ts) {
  const date = new Date(Number(ts / 1000000n));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatDuration(seconds) {
  if (!seconds) return "";
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${s}s`;
}
function VideoJobCard({ job, index, onShare }) {
  const statusMeta = resolveStatus(job.status);
  const ytStatusMeta = resolveYouTubeStatusMeta(job.youtubePublishStatus);
  const thumbnailUrl = job.thumbnailUrl ? job.thumbnailUrl.getDirectURL() : null;
  const duration = formatDuration(job.durationSeconds);
  const isProcessing = job.status.__kind__ === "processing";
  const isCompleted = job.status.__kind__ === "completed";
  function handleShareClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(job);
    } else if (job.shareUrl) {
      navigator.clipboard.writeText(job.shareUrl).then(() => {
        ue.success("Share link copied!");
      });
    } else {
      ue.info("Generate a share link from the video detail page.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/video/$id",
      params: { id: String(job.id) },
      "data-ocid": `video.item.${index}`,
      className: "block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: cn(
            "overflow-hidden border-border bg-card hover:border-primary/40 transition-smooth cursor-pointer",
            "hover:shadow-elevated hover:-translate-y-0.5"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-44 bg-muted overflow-hidden", children: [
              thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: thumbnailUrl,
                  alt: job.title,
                  className: "w-full h-full object-cover transition-smooth group-hover:scale-105"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, { className: "w-10 h-10 text-muted-foreground/30" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth bg-background/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full gradient-accent flex items-center justify-center shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 text-primary-foreground fill-primary-foreground ml-0.5" }) }) }),
              duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm text-xs font-mono text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "w-3 h-3" }),
                duration
              ] }),
              isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "icon",
                  variant: "ghost",
                  onClick: handleShareClick,
                  "data-ocid": `video.share_button.${index}`,
                  "aria-label": "Share video",
                  className: cn(
                    "absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm",
                    "opacity-0 group-hover:opacity-100 transition-smooth",
                    "hover:bg-primary/20 hover:text-primary"
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" })
                }
              ),
              isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-full gradient-accent animate-progress-pulse",
                  style: { width: "60%" }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground truncate group-hover:text-primary transition-smooth", children: job.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-muted-foreground mt-0.5 line-clamp-1",
                    title: job.prompt,
                    children: job.prompt
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: cn(
                        "flex items-center gap-1 text-xs px-2 py-0.5 border",
                        statusMeta.className
                      ),
                      children: [
                        statusMeta.icon,
                        statusMeta.label
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs px-2 py-0.5 border-border text-muted-foreground capitalize",
                      children: job.mode.__kind__
                    }
                  ),
                  ytStatusMeta && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      "data-ocid": `video.yt_status.${index}`,
                      className: cn(
                        "flex items-center gap-1 text-xs px-2 py-0.5 border",
                        ytStatusMeta.className
                      ),
                      children: [
                        ytStatusMeta.icon,
                        ytStatusMeta.label
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "w-3 h-3 text-primary/70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: String(job.creditsSpent) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDate(job.createdAt) })
            ] })
          ]
        }
      )
    }
  );
}
function useDashboardAnalytics() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalViews: 0n,
          totalWatchTimeHours: 0n,
          avgCompletionRate: 0n,
          totalVideos: 0n
        };
      }
      return actor.getDashboardAnalytics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 12e4,
    refetchInterval: 6e4
  });
}
function useVideoJobs() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["videoJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserVideoJobs();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e4
  });
}
function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
  lowWarning,
  isLoading,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: `bg-card border-border ${highlight ? "border-primary/40 shadow-glow-primary" : "shadow-card"}`,
      "data-ocid": ocid,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? "gradient-accent" : "bg-secondary"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: highlight ? "text-primary-foreground" : "text-muted-foreground",
                  children: icon
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: label }),
            isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground mt-0.5", children: value }),
            sub && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
          ] })
        ] }),
        lowWarning && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "destructive",
            className: "flex items-center gap-1 text-xs bg-destructive/20 text-destructive border border-destructive/30 flex-shrink-0",
            "data-ocid": "dashboard.low_credit_warning",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
              "Low"
            ]
          }
        )
      ] }) })
    }
  );
}
function AnalyticsStatCard({
  icon,
  label,
  value,
  sub,
  accentColor,
  isLoading,
  ocid
}) {
  const colorMap = {
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
      bar: "bg-primary"
    },
    accent: {
      bg: "bg-accent/10",
      icon: "text-accent",
      bar: "bg-accent"
    },
    success: {
      bg: "bg-success/10",
      icon: "text-success",
      bar: "bg-success"
    }
  };
  const colors = colorMap[accentColor];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border shadow-card", "data-ocid": ocid, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: colors.icon, children: icon })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium", children: label }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold text-foreground mt-0.5", children: value }),
      sub && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] }) }) });
}
function EmptyVideoState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 text-center animate-fade-in",
      "data-ocid": "dashboard.videos.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mb-5 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clapperboard, { className: "w-10 h-10 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-semibold text-foreground mb-2", children: "No videos yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6 max-w-sm text-sm", children: "Create your first AI-generated faceless YouTube video and it will appear here." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            className: "gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary",
            "data-ocid": "dashboard.create_first_video_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/generate", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
              "Create your first video"
            ] })
          }
        )
      ]
    }
  );
}
function DashboardPage() {
  const { data: balance, isLoading: balanceLoading } = useCreditBalance();
  const { data: jobs, isLoading: jobsLoading } = useVideoJobs();
  const { data: analytics, isLoading: analyticsLoading } = useDashboardAnalytics();
  const isLowCredit = !balanceLoading && ((balance == null ? void 0 : balance.available) ?? 0) < 3;
  const now = /* @__PURE__ */ new Date();
  const completedThisMonth = (jobs ?? []).filter((j) => {
    const created = new Date(Number(j.createdAt / 1000000n));
    return j.status.__kind__ === "completed" && created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const tierLabel = (balance == null ? void 0 : balance.tier) ? balance.tier.charAt(0).toUpperCase() + balance.tier.slice(1) : "Free";
  const totalViews = Number((analytics == null ? void 0 : analytics.totalViews) ?? 0n);
  const watchHours = Number((analytics == null ? void 0 : analytics.totalWatchTimeHours) ?? 0n);
  const completionRate = Number((analytics == null ? void 0 : analytics.avgCompletionRate) ?? 0n);
  const viewsDisplay = totalViews >= 1e3 ? `${(totalViews / 1e3).toFixed(1)}K` : String(totalViews);
  const watchDisplay = watchHours >= 1e3 ? `${(watchHours / 1e3).toFixed(1)}K hrs` : `${watchHours} hrs`;
  const completionDisplay = `${completionRate}%`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Dashboard" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Track your video generation history and credit usage." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              className: "gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary",
              "data-ocid": "dashboard.new_video_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/generate", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-4 h-4 mr-2" }),
                "New Video"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
            "data-ocid": "dashboard.stats_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
                  label: "Credit Balance",
                  value: (balance == null ? void 0 : balance.available) ?? 0,
                  sub: `of ${(balance == null ? void 0 : balance.total) ?? 0} total`,
                  highlight: true,
                  lowWarning: isLowCredit,
                  isLoading: balanceLoading,
                  ocid: "stats.credit_balance_card"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5" }),
                  label: "Subscription",
                  value: tierLabel,
                  sub: "Current plan",
                  isLoading: balanceLoading,
                  ocid: "stats.subscription_card"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-5 h-5" }),
                  label: "Videos This Month",
                  value: completedThisMonth,
                  sub: "Completed",
                  isLoading: jobsLoading,
                  ocid: "stats.videos_month_card"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "dashboard.analytics_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-4 h-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Channel Analytics" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
              "data-ocid": "dashboard.analytics_stats_row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AnalyticsStatCard,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
                    label: "Total Views",
                    value: viewsDisplay,
                    sub: "All time",
                    accentColor: "accent",
                    isLoading: analyticsLoading,
                    ocid: "stats.total_views_card"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AnalyticsStatCard,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                    label: "Watch Time",
                    value: watchDisplay,
                    sub: "Total hours watched",
                    accentColor: "primary",
                    isLoading: analyticsLoading,
                    ocid: "stats.watch_time_card"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AnalyticsStatCard,
                  {
                    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4" }),
                    label: "Avg Completion",
                    value: completionDisplay,
                    sub: "Average rate",
                    accentColor: "success",
                    isLoading: analyticsLoading,
                    ocid: "stats.avg_completion_card"
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-lg font-semibold text-foreground", children: "Video History" }),
            jobs && jobs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-mono text-xs", children: [
              jobs.length,
              " total"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              "data-ocid": "dashboard.videos.loading_state",
              children: ["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCardSkeleton, {}, k))
            }
          ) : jobs && jobs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
              "data-ocid": "dashboard.videos.list",
              children: jobs.map((job, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                VideoJobCard,
                {
                  job,
                  index: index + 1
                },
                String(job.id)
              ))
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyVideoState, {}) })
        ] })
      ]
    }
  ) });
}
export {
  DashboardPage as default
};
