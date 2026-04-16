import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface VideoJobPublic {
    id: VideoJobId;
    status: VideoJobStatus;
    completionRatePercent: bigint;
    title: string;
    thumbnailUrl?: ExternalBlob;
    userId: UserId;
    shareUrl?: string;
    script?: string;
    mode: GenerationMode;
    createdAt: Timestamp;
    errorMessage?: string;
    shareToken?: string;
    creditsSpent: CreditsAmount;
    updatedAt: Timestamp;
    viewCount: bigint;
    durationSeconds?: bigint;
    prompt: string;
    currentStage?: PipelineStage;
    totalWatchTimeSecs: bigint;
    youtubeUrl?: string;
    youtubePublishStatus: YouTubePublishStatus;
    videoUrl?: ExternalBlob;
    voiceoverUrl?: ExternalBlob;
    lastViewedAt?: Timestamp;
}
export interface VideoAnalytics {
    completionRatePercent: bigint;
    videoJobId: VideoJobId;
    viewCount: bigint;
    totalWatchTimeSecs: bigint;
    lastViewedAt?: Timestamp;
}
export interface Subscription {
    status: SubscriptionStatus;
    stripeSubscriptionId: string;
    createdAt: Timestamp;
    tier: SubscriptionTier;
    currentPeriodEnd: Timestamp;
    stripeCustomerId: string;
}
export interface CreateVideoRequest {
    title: string;
    mode: GenerationMode;
    prompt: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type GenerationMode = {
    __kind__: "userScript";
    userScript: {
        script: string;
    };
} | {
    __kind__: "auto";
    auto: null;
};
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface SavedScript {
    id: ScriptId;
    title: string;
    content: string;
    userId: UserId;
    createdAt: Timestamp;
}
export interface TierConfig {
    name: string;
    tier: SubscriptionTier;
    description: string;
    stripePriceId: string;
    creditsPerMonth: CreditsAmount;
    priceInCents: bigint;
}
export type VideoJobId = bigint;
export interface YouTubeConnectionStatus {
    channelName?: string;
    channelId?: string;
    connected: boolean;
}
export interface VideoPublicView {
    title: string;
    thumbnailUrl?: string;
    videoJobId: VideoJobId;
    createdAt: Timestamp;
    description: string;
    viewCount: bigint;
    videoUrl?: string;
}
export interface PublishToYouTubeRequest {
    title: string;
    tags: Array<string>;
    description: string;
    visibility: YouTubeVisibility;
}
export interface DashboardAnalytics {
    avgCompletionRate: bigint;
    totalViews: bigint;
    totalVideos: bigint;
    totalWatchTimeHours: bigint;
}
export type CreditsAmount = bigint;
export interface BrandKit {
    outroText: string;
    visualStyle: string;
    voice: string;
    introText: string;
    aspectRatio: string;
}
export type ScriptId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface UserProfilePublic {
    id: UserId;
    displayName: string;
    subscription?: Subscription;
    createdAt: Timestamp;
    youtubeConnection?: YouTubeConnectionPublic;
    email: string;
    updatedAt: Timestamp;
    stripeCustomerId?: string;
    creditBalance: CreditsAmount;
    brandKit?: BrandKit;
}
export type UserId = Principal;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface YouTubeConnectionPublic {
    channelName: string;
    channelId: string;
    refreshToken: string;
    connectedAt: bigint;
    accessToken: string;
}
export type VideoJobStatus = {
    __kind__: "pending";
    pending: null;
} | {
    __kind__: "completed";
    completed: null;
} | {
    __kind__: "processing";
    processing: null;
} | {
    __kind__: "failed";
    failed: {
        reason: string;
    };
};
export enum PipelineStage {
    voiceover = "voiceover",
    script = "script",
    assembly = "assembly",
    images = "images"
}
export enum SubscriptionStatus {
    active = "active",
    cancelled = "cancelled",
    expired = "expired",
    none = "none"
}
export enum SubscriptionTier {
    pro = "pro",
    enterprise = "enterprise",
    starter = "starter"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum YouTubePublishStatus {
    notPublished = "notPublished",
    published = "published",
    publishing = "publishing",
    failed = "failed"
}
export enum YouTubeVisibility {
    public_ = "public",
    private_ = "private",
    unlisted = "unlisted"
}
export interface backendInterface {
    addCredits(user: Principal, amount: CreditsAmount): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelSubscription(): Promise<void>;
    connectYouTube(authCode: string, redirectUri: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createSubscriptionCheckout(tier: SubscriptionTier, successUrl: string, cancelUrl: string): Promise<string>;
    deleteScript(id: ScriptId): Promise<void>;
    deleteVideoJob(jobId: VideoJobId): Promise<void>;
    disconnectYouTube(): Promise<void>;
    generateShareLink(videoId: VideoJobId): Promise<string>;
    getBrandKit(): Promise<BrandKit | null>;
    getCallerProfile(): Promise<UserProfilePublic | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreditBalance(): Promise<CreditsAmount>;
    getDashboardAnalytics(): Promise<DashboardAnalytics>;
    getPublicVideo(token: string): Promise<VideoPublicView | null>;
    getScript(id: ScriptId): Promise<SavedScript | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubscriptionTiers(): Promise<Array<TierConfig>>;
    getUserProfile(user: Principal): Promise<UserProfilePublic | null>;
    getVideoAnalytics(videoId: VideoJobId): Promise<VideoAnalytics | null>;
    getVideoJob(jobId: VideoJobId): Promise<VideoJobPublic | null>;
    getYouTubeConnection(): Promise<YouTubeConnectionStatus>;
    handleStripeWebhook(payload: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listScripts(): Promise<Array<SavedScript>>;
    listUserVideoJobs(): Promise<Array<VideoJobPublic>>;
    publishToYouTube(videoId: VideoJobId, request: PublishToYouTubeRequest): Promise<void>;
    recordVideoEngagement(videoId: VideoJobId, watchTimeSecs: bigint, completionPercent: bigint): Promise<void>;
    saveBrandKit(kit: BrandKit): Promise<void>;
    saveCallerProfile(displayName: string, email: string): Promise<void>;
    saveScript(title: string, content: string): Promise<SavedScript>;
    setOpenAiKey(key: string): Promise<void>;
    setReplicateKey(key: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setSubscription(user: Principal, subscription: Subscription): Promise<void>;
    submitVideoJob(req: CreateVideoRequest): Promise<VideoJobId>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateVideoJobStatus(jobId: VideoJobId, stage: PipelineStage | null, script: string | null, completed: boolean, failed: boolean, failReason: string | null): Promise<void>;
}
