import { SubscriptionStatus } from "@/backend.d";
import type { SubscriptionTier, UserProfilePublic } from "@/backend.d";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { useBrandKit, useSaveBrandKit } from "@/hooks/useBrandKit";
import { useYouTubeActions } from "@/hooks/useYouTubeActions";
import { useYouTubeConnection } from "@/hooks/useYouTubeConnection";
import { cn } from "@/lib/utils";
import type { BrandKit } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Key,
  Loader2,
  Palette,
  Settings,
  Unlink,
  User,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiYoutube } from "react-icons/si";
import { toast } from "sonner";

// ─── helpers ─────────────────────────────────────────────────────────────────

function tierLabel(tier?: SubscriptionTier): string {
  if (!tier) return "Free";
  return (
    { starter: "Starter", pro: "Pro", enterprise: "Enterprise" }[tier] ?? tier
  );
}

function tierCredits(tier?: SubscriptionTier): number {
  return { starter: 10, pro: 30, enterprise: 100 }[tier ?? ""] ?? 0;
}

function formatDate(ts?: bigint): string {
  if (!ts) return "—";
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Synthetic credit history derived from real profile data
interface CreditEntry {
  id: number;
  description: string;
  delta: number;
  timestamp: bigint;
}

function buildCreditHistory(profile: UserProfilePublic | null): CreditEntry[] {
  if (!profile) return [];
  const entries: CreditEntry[] = [];
  if (profile.subscription) {
    entries.push({
      id: 1,
      description: `${tierLabel(profile.subscription.tier)} plan activated`,
      delta: tierCredits(profile.subscription.tier),
      timestamp: profile.subscription.createdAt,
    });
  }
  if (profile.creditBalance > 0n) {
    entries.push({
      id: 2,
      description: "Credits used for video generation",
      delta: -Number(
        BigInt(tierCredits(profile.subscription?.tier)) - profile.creditBalance,
      ),
      timestamp: profile.updatedAt,
    });
  }
  return entries.filter((e) => e.delta !== 0);
}

// ─── sub-components ──────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
  ocid,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  ocid: string;
}) {
  return (
    <Card className="bg-card border-border shadow-card" data-ocid={ocid}>
      <CardHeader className="pb-3">
        <h2 className="font-semibold flex items-center gap-2 text-base text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </h2>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ─── Account section ─────────────────────────────────────────────────────────

function AccountSection({ profile }: { profile: UserProfilePublic | null }) {
  const { principal } = useAuth();
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerProfile(displayName, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
      setSaved(true);
      toast.success("Profile saved successfully");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      toast.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  return (
    <SectionCard
      icon={<User className="w-4 h-4" />}
      title="Account"
      ocid="settings.account_card"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">
            Principal ID
          </p>
          <code
            className="block text-xs bg-muted px-3 py-2 rounded-md font-mono break-all text-foreground"
            data-ocid="settings.principal_display"
          >
            {principal ?? "—"}
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="display-name"
              className="text-xs text-muted-foreground font-medium"
            >
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="h-9"
              data-ocid="settings.display_name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs text-muted-foreground font-medium"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9"
              data-ocid="settings.email_input"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            size="sm"
            className="gradient-accent text-primary-foreground border-0 hover:opacity-90"
            data-ocid="settings.save_profile_button"
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {saved ? "Saved!" : "Save Profile"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Subscription section ─────────────────────────────────────────────────────

function SubscriptionSection({
  profile,
  onCancelRequest,
}: {
  profile: UserProfilePublic | null;
  onCancelRequest: () => void;
}) {
  const sub = profile?.subscription;
  const hasSub = sub && sub.status === SubscriptionStatus.active;
  const tierName = tierLabel(sub?.tier);
  const credits = tierCredits(sub?.tier);

  return (
    <SectionCard
      icon={<CreditCard className="w-4 h-4" />}
      title="Subscription"
      ocid="settings.subscription_card"
    >
      <div className="space-y-4">
        {hasSub ? (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Current plan
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {credits} credits/month · renews{" "}
                  {formatDate(sub?.currentPeriodEnd)}
                </p>
              </div>
              <Badge className="gradient-accent text-primary-foreground border-0 font-semibold">
                {tierName}
              </Badge>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/60">
              <Zap className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {Number(profile?.creditBalance ?? 0n)} credits remaining
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full gradient-accent rounded-full transition-smooth"
                    style={{
                      width: `${Math.min(
                        100,
                        (Number(profile?.creditBalance ?? 0n) / credits) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                of {credits}
              </span>
            </div>

            <Separator />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Upgrade or change plan
                </p>
                <p className="text-xs text-muted-foreground">
                  Compare all available plans.
                </p>
              </div>
              <Link to="/pricing">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  data-ocid="settings.view_plans_button"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Plans
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Cancel subscription
                </p>
                <p className="text-xs text-muted-foreground">
                  Access continues until {formatDate(sub?.currentPeriodEnd)}.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={onCancelRequest}
                data-ocid="settings.cancel_subscription_button"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                No active subscription
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Subscribe to start generating videos.
              </p>
            </div>
            <Link to="/pricing">
              <Button
                size="sm"
                className="gradient-accent text-primary-foreground border-0 hover:opacity-90"
                data-ocid="settings.subscribe_button"
              >
                View Plans
              </Button>
            </Link>
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── Brand Kit section ────────────────────────────────────────────────────────

const VOICE_OPTIONS = [
  { value: "alloy", label: "Alloy" },
  { value: "echo", label: "Echo" },
  { value: "fable", label: "Fable" },
  { value: "onyx", label: "Onyx" },
  { value: "nova", label: "Nova" },
  { value: "shimmer", label: "Shimmer" },
];

const VISUAL_STYLE_OPTIONS = [
  { value: "cinematic", label: "Cinematic" },
  { value: "animation", label: "Animation" },
  { value: "photorealistic", label: "Photorealistic" },
];

const ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9 — Landscape" },
  { value: "9:16", label: "9:16 — Portrait" },
  { value: "1:1", label: "1:1 — Square" },
];

const DEFAULT_BRAND_KIT: BrandKit = {
  voice: "alloy",
  visualStyle: "cinematic",
  aspectRatio: "16:9",
  introText: "",
  outroText: "",
};

function BrandKitSection() {
  const { data: brandKit, isLoading } = useBrandKit();
  const saveBrandKit = useSaveBrandKit();

  const [form, setForm] = useState<BrandKit>(DEFAULT_BRAND_KIT);
  const brandKitApplied = useRef(false);

  // Populate form only once on first load — never overwrite user edits on refetch
  useEffect(() => {
    if (brandKit && !brandKitApplied.current) {
      brandKitApplied.current = true;
      setForm({
        voice: brandKit.voice || "alloy",
        visualStyle: brandKit.visualStyle || "cinematic",
        aspectRatio: brandKit.aspectRatio || "16:9",
        introText: brandKit.introText || "",
        outroText: brandKit.outroText || "",
      });
    }
  }, [brandKit]);

  function handleChange(field: keyof BrandKit, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    try {
      await saveBrandKit.mutateAsync(form);
      toast.success("Brand Kit saved successfully");
    } catch (err) {
      toast.error(
        `Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }

  if (isLoading) {
    return (
      <SectionCard
        icon={<Palette className="w-4 h-4" />}
        title="Brand Kit"
        ocid="settings.brand_kit_card"
      >
        <div className="space-y-3" data-ocid="settings.brand_kit.loading_state">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      icon={<Palette className="w-4 h-4" />}
      title="Brand Kit"
      ocid="settings.brand_kit_card"
    >
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Set your default voice, style, and layout. These will auto-populate
          the Generate form so every video stays on-brand.
        </p>

        {/* Voice */}
        <div className="space-y-1.5">
          <Label
            htmlFor="brand-voice"
            className="text-xs font-medium text-muted-foreground"
          >
            Default Voice
          </Label>
          <div className="relative">
            <select
              id="brand-voice"
              value={form.voice}
              onChange={(e) => handleChange("voice", e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth"
              data-ocid="settings.brand_kit.voice_select"
            >
              {VOICE_OPTIONS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Visual Style */}
        <div className="space-y-1.5">
          <Label
            htmlFor="brand-style"
            className="text-xs font-medium text-muted-foreground"
          >
            Default Visual Style
          </Label>
          <div className="relative">
            <select
              id="brand-style"
              value={form.visualStyle}
              onChange={(e) => handleChange("visualStyle", e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth"
              data-ocid="settings.brand_kit.visual_style_select"
            >
              {VISUAL_STYLE_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-1.5">
          <Label
            htmlFor="brand-aspect"
            className="text-xs font-medium text-muted-foreground"
          >
            Default Aspect Ratio
          </Label>
          <div className="relative">
            <select
              id="brand-aspect"
              value={form.aspectRatio}
              onChange={(e) => handleChange("aspectRatio", e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border border-input bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring appearance-none transition-smooth"
              data-ocid="settings.brand_kit.aspect_ratio_select"
            >
              {ASPECT_RATIO_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Intro Text */}
        <div className="space-y-1.5">
          <Label
            htmlFor="brand-intro"
            className="text-xs font-medium text-muted-foreground"
          >
            Intro Text{" "}
            <span className="text-muted-foreground/60 font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="brand-intro"
            value={form.introText}
            onChange={(e) =>
              handleChange("introText", e.target.value.slice(0, 300))
            }
            placeholder="Welcome to our channel! Today we're exploring…"
            rows={3}
            className="resize-none text-sm"
            data-ocid="settings.brand_kit.intro_text_input"
          />
          <p
            className={cn(
              "text-xs text-right",
              form.introText.length > 270
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {form.introText.length}/300
          </p>
        </div>

        {/* Outro Text */}
        <div className="space-y-1.5">
          <Label
            htmlFor="brand-outro"
            className="text-xs font-medium text-muted-foreground"
          >
            Outro Text{" "}
            <span className="text-muted-foreground/60 font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="brand-outro"
            value={form.outroText}
            onChange={(e) =>
              handleChange("outroText", e.target.value.slice(0, 300))
            }
            placeholder="Thanks for watching! Don't forget to like and subscribe…"
            rows={3}
            className="resize-none text-sm"
            data-ocid="settings.brand_kit.outro_text_input"
          />
          <p
            className={cn(
              "text-xs text-right",
              form.outroText.length > 270
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {form.outroText.length}/300
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            onClick={handleSave}
            disabled={saveBrandKit.isPending}
            size="sm"
            className="gradient-accent text-primary-foreground border-0 hover:opacity-90"
            data-ocid="settings.brand_kit.save_button"
          >
            {saveBrandKit.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saveBrandKit.isSuccess ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            Save Brand Kit
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── YouTube Connection section ───────────────────────────────────────────────

const YOUTUBE_OAUTH_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const YOUTUBE_REDIRECT_URI =
  typeof window !== "undefined" ? `${window.location.origin}/settings` : "";

function buildYouTubeOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: YOUTUBE_OAUTH_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: "code",
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly",
    ].join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function YouTubeConnectionSection() {
  const { data: ytStatus, isLoading } = useYouTubeConnection();
  const { connectYouTube, disconnectYouTube } = useYouTubeActions();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  // Handle OAuth callback — extract "code" from query string on mount only
  const connectYouTubeMutate = connectYouTube.mutate;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      window.history.replaceState({}, "", window.location.pathname);
      connectYouTubeMutate({
        authCode: code,
        redirectUri: YOUTUBE_REDIRECT_URI,
      });
    }
  }, [connectYouTubeMutate]);

  function handleConnect() {
    window.location.href = buildYouTubeOAuthUrl();
  }

  if (isLoading) {
    return (
      <SectionCard
        icon={<SiYoutube className="w-4 h-4" />}
        title="YouTube Connection"
        ocid="settings.youtube_card"
      >
        <div className="space-y-3" data-ocid="settings.youtube.loading_state">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </SectionCard>
    );
  }

  const isConnected = ytStatus?.connected ?? false;

  return (
    <>
      <SectionCard
        icon={<SiYoutube className="w-4 h-4" />}
        title="YouTube Connection"
        ocid="settings.youtube_card"
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Connect your YouTube channel to publish generated videos directly
            from FacelessAI.
          </p>

          {isConnected ? (
            /* ── Connected state ── */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                  <SiYoutube className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {ytStatus?.channelName ?? "Your Channel"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ytStatus?.channelId ?? ""}
                  </p>
                </div>
                <Badge
                  className="flex items-center gap-1 bg-success/15 text-success border border-success/30 text-xs flex-shrink-0"
                  data-ocid="settings.youtube.connected_badge"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </Badge>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Disconnect channel
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You can reconnect at any time.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-1.5"
                  onClick={() => setDisconnectOpen(true)}
                  data-ocid="settings.youtube.disconnect_button"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            /* ── Disconnected state ── */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <SiYoutube className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  No YouTube channel connected
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Connect your channel to publish videos directly and track
                  performance from your dashboard.
                </p>
              </div>
              <Button
                size="sm"
                onClick={handleConnect}
                disabled={connectYouTube.isPending}
                className="bg-destructive hover:bg-destructive/90 text-white border-0 gap-2 shadow-sm"
                data-ocid="settings.youtube.connect_button"
              >
                {connectYouTube.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <SiYoutube className="w-4 h-4" />
                )}
                Connect YouTube Account
              </Button>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wifi className="w-3.5 h-3.5" />
                <span>Secure OAuth 2.0 — we never store your password</span>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Disconnect confirmation dialog */}
      <Dialog
        open={disconnectOpen}
        onOpenChange={(o) => !o && setDisconnectOpen(false)}
      >
        <DialogContent data-ocid="settings.youtube.disconnect_dialog">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Unlink className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle>Disconnect YouTube?</DialogTitle>
            <DialogDescription>
              Your YouTube channel <strong>{ytStatus?.channelName}</strong> will
              be unlinked. Videos already published will remain on YouTube. You
              can reconnect at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDisconnectOpen(false)}
              disabled={disconnectYouTube.isPending}
              data-ocid="settings.youtube.disconnect_dialog.cancel_button"
            >
              Keep Connected
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                disconnectYouTube.mutate(undefined, {
                  onSuccess: () => setDisconnectOpen(false),
                });
              }}
              disabled={disconnectYouTube.isPending}
              data-ocid="settings.youtube.disconnect_dialog.confirm_button"
            >
              {disconnectYouTube.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Yes, Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Credit history ──────────────────────────────────────────────────────────

function CreditHistorySection({
  profile,
}: { profile: UserProfilePublic | null }) {
  const entries = buildCreditHistory(profile);

  return (
    <SectionCard
      icon={<Zap className="w-4 h-4" />}
      title="Credit History"
      ocid="settings.credit_history_card"
    >
      {entries.length === 0 ? (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="settings.credit_history.empty_state"
        >
          No credit transactions yet.
        </div>
      ) : (
        <Table data-ocid="settings.credit_history_table">
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, i) => (
              <TableRow
                key={entry.id}
                data-ocid={`settings.credit_history.item.${i + 1}`}
              >
                <TableCell className="text-sm text-foreground">
                  {entry.description}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm font-medium",
                    entry.delta > 0 ? "text-primary" : "text-destructive",
                  )}
                >
                  {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {formatDate(entry.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </SectionCard>
  );
}

// ─── API Keys section ────────────────────────────────────────────────────────

function ApiKeysSection({ isAdmin }: { isAdmin: boolean }) {
  const { actor } = useBackend();
  const [openAiKey, setOpenAiKey] = useState("");
  const [replicateKey, setReplicateKey] = useState("");
  const [saved, setSaved] = useState(false);

  const saveKeysMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (openAiKey) await actor.setOpenAiKey(openAiKey);
      if (replicateKey) await actor.setReplicateKey(replicateKey);
    },
    onSuccess: () => {
      setSaved(true);
      toast.success("API keys saved");
      setOpenAiKey("");
      setReplicateKey("");
      setTimeout(() => setSaved(false), 2500);
    },
    onError: (err) => {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  if (!isAdmin) return null;

  return (
    <SectionCard
      icon={<Key className="w-4 h-4" />}
      title="API Configuration (Admin)"
      ocid="settings.api_keys_card"
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Configure AI service keys used by the platform. Changes affect all
          users.
        </p>

        <div className="space-y-1.5">
          <Label
            htmlFor="openai-key"
            className="text-xs font-medium text-muted-foreground"
          >
            OpenAI API Key
          </Label>
          <Input
            id="openai-key"
            type="password"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
            placeholder="sk-proj-…"
            className="h-9 font-mono text-sm"
            data-ocid="settings.openai_key_input"
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="replicate-key"
            className="text-xs font-medium text-muted-foreground"
          >
            Replicate API Key
          </Label>
          <Input
            id="replicate-key"
            type="password"
            value={replicateKey}
            onChange={(e) => setReplicateKey(e.target.value)}
            placeholder="r8_…"
            className="h-9 font-mono text-sm"
            data-ocid="settings.replicate_key_input"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveKeysMutation.mutate()}
            disabled={
              saveKeysMutation.isPending || (!openAiKey && !replicateKey)
            }
            size="sm"
            className="gradient-accent text-primary-foreground border-0 hover:opacity-90"
            data-ocid="settings.save_keys_button"
          >
            {saveKeysMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2" />
            ) : null}
            {saved ? "Saved!" : "Save API Keys"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Cancel dialog ────────────────────────────────────────────────────────────

function CancelDialog({
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-ocid="settings.cancel_dialog">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <DialogTitle>Cancel subscription?</DialogTitle>
          <DialogDescription>
            Your plan will remain active until the end of the current billing
            period. After that, your credits will not renew and video generation
            will be disabled.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            data-ocid="settings.cancel_dialog.cancel_button"
          >
            Keep Subscription
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="settings.cancel_dialog.confirm_button"
          >
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Yes, Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } =
    useQuery<UserProfilePublic | null>({
      queryKey: ["callerProfile"],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getCallerProfile();
      },
      enabled: !!actor && !isFetching && isAuthenticated,
      staleTime: 60_000,
    });

  const { data: isAdmin = false } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      await actor.cancelSubscription();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
      queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
      setCancelOpen(false);
      toast.success(
        "Subscription cancelled. Access continues until period end.",
      );
    },
    onError: (err) => {
      toast.error(
        `Cancellation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  return (
    <Layout>
      <div
        className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 animate-fade-in"
        data-ocid="settings.page"
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display font-bold text-2xl md:text-3xl flex items-center gap-2 text-foreground">
            <Settings className="w-6 h-6 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account, subscription, brand kit, and API configuration.
          </p>
        </motion.div>

        {profileLoading ? (
          <div className="space-y-4" data-ocid="settings.loading_state">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-56 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <AccountSection profile={profile ?? null} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SubscriptionSection
                profile={profile ?? null}
                onCancelRequest={() => setCancelOpen(true)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <BrandKitSection />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <YouTubeConnectionSection />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <CreditHistorySection profile={profile ?? null} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <ApiKeysSection isAdmin={isAdmin} />
            </motion.div>
          </>
        )}
      </div>

      <CancelDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        isPending={cancelMutation.isPending}
      />
    </Layout>
  );
}
