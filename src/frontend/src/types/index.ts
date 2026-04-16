export type VideoJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type VideoStyle =
  | "cinematic"
  | "animation"
  | "photorealistic"
  | "minimal";

export type AspectRatio = "16:9" | "9:16" | "1:1";

export type YouTubePublishStatus =
  | "notPublished"
  | "publishing"
  | "published"
  | "failed";

export type YouTubeVisibility = "public_" | "unlisted" | "private_";

export interface VideoJob {
  id: string;
  title: string;
  prompt: string;
  style: VideoStyle;
  aspectRatio: AspectRatio;
  durationSeconds: number;
  status: VideoJobStatus;
  progress: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  createdAt: bigint;
  updatedAt: bigint;
  creditsUsed: number;
  errorMessage?: string;
  // Sharing
  shareToken?: string;
  shareUrl?: string;
  // Analytics
  viewCount: number;
  totalWatchTimeSecs: number;
  completionRatePercent: number;
  lastViewedAt?: bigint;
  // YouTube
  youtubePublishStatus: YouTubePublishStatus;
  youtubeUrl?: string;
}

export interface VideoAnalytics {
  videoJobId: bigint;
  viewCount: number;
  totalWatchTimeSecs: number;
  completionRatePercent: number;
  lastViewedAt?: bigint;
}

export interface DashboardAnalytics {
  totalViews: number;
  totalWatchTimeHours: number;
  avgCompletionRate: number;
  totalVideos: number;
}

export interface YouTubeConnectionStatus {
  connected: boolean;
  channelName?: string;
  channelId?: string;
}

export interface PublishToYouTubeRequest {
  title: string;
  description: string;
  tags: string[];
  visibility: YouTubeVisibility;
}

export interface VideoPublicView {
  videoJobId: bigint;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  viewCount: number;
  createdAt: bigint;
}

export interface UserProfile {
  principal: string;
  displayName?: string;
  email?: string;
  createdAt: bigint;
  totalVideosGenerated: number;
}

export type SubscriptionTierId = "starter" | "pro" | "enterprise";

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  priceMonthly: number;
  creditsPerMonth: number;
  features: string[];
  stripePriceId?: string;
}

export interface CreditBalance {
  available: number;
  used: number;
  total: number;
  resetDate?: bigint;
  tier?: SubscriptionTierId;
}

export interface StripeSessionResult {
  sessionId: string;
  url: string;
}

export interface SavedScript {
  id: bigint;
  userId: string;
  title: string;
  content: string;
  createdAt: bigint;
}

export interface BrandKit {
  voice: string;
  visualStyle: string;
  aspectRatio: string;
  introText: string;
  outroText: string;
}
