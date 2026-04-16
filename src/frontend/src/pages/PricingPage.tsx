import { SubscriptionTier } from "@/backend.d";
import type { TierConfig } from "@/backend.d";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Building2,
  Check,
  CheckCircle2,
  Crown,
  Loader2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const TIER_META: Record<
  string,
  { icon: React.ReactNode; highlight: boolean; badge?: string }
> = {
  starter: { icon: <Zap className="w-5 h-5" />, highlight: false },
  pro: {
    icon: <Crown className="w-5 h-5" />,
    highlight: true,
    badge: "Most Popular",
  },
  enterprise: { icon: <Building2 className="w-5 h-5" />, highlight: false },
};

const TIER_FEATURES: Record<string, string[]> = {
  starter: [
    "10 AI video credits/month",
    "720p video export",
    "Auto script generation",
    "Standard AI voices",
    "5 style templates",
    "Email support",
  ],
  pro: [
    "30 AI video credits/month",
    "1080p HD video export",
    "Auto + custom scripts",
    "Premium AI voices",
    "All style templates",
    "Priority processing",
    "Analytics dashboard",
    "Priority support",
  ],
  enterprise: [
    "100 AI video credits/month",
    "4K video export",
    "Unlimited script modes",
    "Ultra-premium AI voices",
    "Custom branding & watermarks",
    "Dedicated account manager",
    "Advanced analytics",
    "API access",
  ],
};

const FALLBACK_TIERS: TierConfig[] = [
  {
    tier: SubscriptionTier.starter,
    name: "Starter",
    description: "Perfect for creators just getting started.",
    priceInCents: BigInt(900),
    creditsPerMonth: BigInt(10),
    stripePriceId: "",
  },
  {
    tier: SubscriptionTier.pro,
    name: "Pro",
    description: "For serious content creators.",
    priceInCents: BigInt(2900),
    creditsPerMonth: BigInt(30),
    stripePriceId: "",
  },
  {
    tier: SubscriptionTier.enterprise,
    name: "Enterprise",
    description: "For agencies and power users.",
    priceInCents: BigInt(7900),
    creditsPerMonth: BigInt(100),
    stripePriceId: "",
  },
];

function TierCard({
  tier,
  index,
  currentTier,
  onUpgrade,
  isUpgrading,
}: {
  tier: TierConfig;
  index: number;
  currentTier?: SubscriptionTier;
  onUpgrade: (t: TierConfig) => void;
  isUpgrading: boolean;
}) {
  const meta = TIER_META[tier.tier] ?? {
    icon: <Zap className="w-5 h-5" />,
    highlight: false,
  };
  const price = Number(tier.priceInCents) / 100;
  const credits = Number(tier.creditsPerMonth);
  const features = TIER_FEATURES[tier.tier] ?? [];
  const isCurrent = currentTier === tier.tier;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex"
      data-ocid={`pricing.tier.${index + 1}`}
    >
      <Card
        className={cn(
          "relative flex flex-col w-full border transition-smooth",
          meta.highlight
            ? "border-primary/50 shadow-glow-primary"
            : "border-border shadow-card hover:border-primary/25 hover:shadow-elevated",
          isCurrent && "ring-2 ring-primary",
        )}
      >
        {meta.badge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <Badge className="gradient-accent text-primary-foreground border-0 px-3 py-0.5 text-xs font-semibold shadow-glow-primary">
              {meta.badge}
            </Badge>
          </div>
        )}
        {isCurrent && (
          <div className="absolute -top-3.5 right-4 z-10">
            <Badge
              variant="outline"
              className="bg-background border-primary text-primary text-xs font-semibold"
            >
              Current Plan
            </Badge>
          </div>
        )}

        <CardHeader className="pb-0 pt-8 px-6">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
              meta.highlight
                ? "gradient-accent text-primary-foreground"
                : "bg-secondary text-primary",
            )}
          >
            {meta.icon}
          </div>
          <h2 className="font-display font-bold text-xl">{tier.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tier.description}
          </p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-4xl font-display font-bold">${price}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {credits} credits/month
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 px-6 pt-4 pb-6">
          <ul className="space-y-2.5 flex-1 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          {isCurrent ? (
            <Button
              variant="outline"
              className="w-full"
              disabled
              data-ocid={`pricing.current_plan_button.${tier.tier}`}
            >
              <Check className="w-4 h-4 mr-2" />
              Current Plan
            </Button>
          ) : (
            <button
              type="button"
              onClick={() => onUpgrade(tier)}
              disabled={isUpgrading}
              className={cn(
                "w-full py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-smooth disabled:opacity-60",
                meta.highlight
                  ? "gradient-accent text-primary-foreground hover:opacity-90 shadow-glow-primary"
                  : "border border-border bg-secondary hover:bg-muted text-foreground",
              )}
              data-ocid={`pricing.upgrade_button.${tier.tier}`}
            >
              {isUpgrading && <Loader2 className="w-4 h-4 animate-spin" />}
              {tier.tier === SubscriptionTier.enterprise
                ? "Contact Sales"
                : `Upgrade to ${tier.name}`}
            </button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PricingPage() {
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();

  const { data: tiers = FALLBACK_TIERS, isLoading } = useQuery<TierConfig[]>({
    queryKey: ["subscriptionTiers"],
    queryFn: async () => {
      if (!actor) return FALLBACK_TIERS;
      const result = await actor.getSubscriptionTiers();
      return result.length > 0 ? result : FALLBACK_TIERS;
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });

  const { data: profile } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const currentTier = profile?.subscription?.tier;

  const upgradeMutation = useMutation({
    mutationFn: async (tier: TierConfig) => {
      if (!isAuthenticated) {
        login();
        return;
      }
      if (!actor) throw new Error("Not connected");
      const successUrl = `${window.location.origin}/settings?session={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/pricing`;
      const url = await actor.createSubscriptionCheckout(
        tier.tier,
        successUrl,
        cancelUrl,
      );
      if (url) window.location.href = url;
    },
    onError: (err) => {
      toast.error(
        `Checkout failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  return (
    <Layout showSidebar={isAuthenticated}>
      <div
        className="min-h-screen bg-background animate-fade-in"
        data-ocid="pricing.page"
      >
        {/* Hero */}
        <div className="bg-card border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-4 bg-primary/10 text-primary border-primary/20"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Credit-based pricing
              </Badge>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">
                Choose your{" "}
                <span className="text-gradient-accent">creative plan</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Generate professional faceless YouTube videos with AI. Credits
                refresh monthly — no lock-in, cancel anytime.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Tier cards */}
        <div
          className="max-w-5xl mx-auto px-4 py-14"
          data-ocid="pricing.tiers_section"
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-xl bg-card animate-pulse border border-border"
                  data-ocid={`pricing.tier_skeleton.${i}`}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {tiers.map((tier, i) => (
                <TierCard
                  key={tier.tier}
                  tier={tier}
                  index={i}
                  currentTier={currentTier}
                  onUpgrade={(t) => upgradeMutation.mutate(t)}
                  isUpgrading={upgradeMutation.isPending}
                />
              ))}
            </div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8"
          >
            All plans billed monthly. Credits do not roll over. Secure checkout
            via Stripe.
          </motion.p>
        </div>

        {/* Guarantees */}
        <div className="bg-muted/30 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Instant access",
                  body: "Credits available immediately after checkout.",
                },
                {
                  title: "Flexible upgrades",
                  body: "Switch or cancel plans at any time from your settings.",
                },
                {
                  title: "Secure payments",
                  body: "Powered by Stripe — your card details are never stored.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <p className="font-semibold text-foreground text-sm mb-1.5">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
