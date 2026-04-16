import { u as useAuth, j as jsxRuntimeExports, b as ue, c as cn } from "./index-CMKZUFdA.js";
import { f as SubscriptionTier, L as Layout, B as Badge, Z as Zap, a as LoaderCircle } from "./badge-DORezHz4.js";
import { B as Button } from "./button-BfOBeu4g.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-CI9qC1Hp.js";
import { c as createLucideIcon, u as useBackend, a as useQuery } from "./createLucideIcon-CjzoZNB-.js";
import { u as useMutation } from "./useMutation-tcAt8btY.js";
import { m as motion } from "./proxy-DIUJpt6T.js";
import { C as CircleCheck } from "./circle-check-D6IEpUVO.js";
import { C as Check } from "./check-CjBsStuQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", key: "1b4qmf" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "i71pzd" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", key: "10jefs" }],
  ["path", { d: "M10 6h4", key: "1itunk" }],
  ["path", { d: "M10 10h4", key: "tcdvrf" }],
  ["path", { d: "M10 14h4", key: "kelpxr" }],
  ["path", { d: "M10 18h4", key: "1ulq68" }]
];
const Building2 = createLucideIcon("building-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
const TIER_META = {
  starter: { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }), highlight: false },
  pro: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5" }),
    highlight: true,
    badge: "Most Popular"
  },
  enterprise: { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5" }), highlight: false }
};
const TIER_FEATURES = {
  starter: [
    "10 AI video credits/month",
    "720p video export",
    "Auto script generation",
    "Standard AI voices",
    "5 style templates",
    "Email support"
  ],
  pro: [
    "30 AI video credits/month",
    "1080p HD video export",
    "Auto + custom scripts",
    "Premium AI voices",
    "All style templates",
    "Priority processing",
    "Analytics dashboard",
    "Priority support"
  ],
  enterprise: [
    "100 AI video credits/month",
    "4K video export",
    "Unlimited script modes",
    "Ultra-premium AI voices",
    "Custom branding & watermarks",
    "Dedicated account manager",
    "Advanced analytics",
    "API access"
  ]
};
const FALLBACK_TIERS = [
  {
    tier: SubscriptionTier.starter,
    name: "Starter",
    description: "Perfect for creators just getting started.",
    priceInCents: BigInt(900),
    creditsPerMonth: BigInt(10),
    stripePriceId: ""
  },
  {
    tier: SubscriptionTier.pro,
    name: "Pro",
    description: "For serious content creators.",
    priceInCents: BigInt(2900),
    creditsPerMonth: BigInt(30),
    stripePriceId: ""
  },
  {
    tier: SubscriptionTier.enterprise,
    name: "Enterprise",
    description: "For agencies and power users.",
    priceInCents: BigInt(7900),
    creditsPerMonth: BigInt(100),
    stripePriceId: ""
  }
];
function TierCard({
  tier,
  index,
  currentTier,
  onUpgrade,
  isUpgrading
}) {
  const meta = TIER_META[tier.tier] ?? {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
    highlight: false
  };
  const price = Number(tier.priceInCents) / 100;
  const credits = Number(tier.creditsPerMonth);
  const features = TIER_FEATURES[tier.tier] ?? [];
  const isCurrent = currentTier === tier.tier;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: index * 0.1 },
      className: "flex",
      "data-ocid": `pricing.tier.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: cn(
            "relative flex flex-col w-full border transition-smooth",
            meta.highlight ? "border-primary/50 shadow-glow-primary" : "border-border shadow-card hover:border-primary/25 hover:shadow-elevated",
            isCurrent && "ring-2 ring-primary"
          ),
          children: [
            meta.badge && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "gradient-accent text-primary-foreground border-0 px-3 py-0.5 text-xs font-semibold shadow-glow-primary", children: meta.badge }) }),
            isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3.5 right-4 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "bg-background border-primary text-primary text-xs font-semibold",
                children: "Current Plan"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-0 pt-8 px-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                    meta.highlight ? "gradient-accent text-primary-foreground" : "bg-secondary text-primary"
                  ),
                  children: meta.icon
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl", children: tier.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: tier.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1 mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-4xl font-display font-bold", children: [
                  "$",
                  price
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: "/month" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-primary", children: [
                  credits,
                  " credits/month"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col flex-1 px-6 pt-4 pb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5 flex-1 mb-6", children: features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2.5 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: f })
              ] }, f)) }),
              isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full",
                  disabled: true,
                  "data-ocid": `pricing.current_plan_button.${tier.tier}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }),
                    "Current Plan"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onUpgrade(tier),
                  disabled: isUpgrading,
                  className: cn(
                    "w-full py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-smooth disabled:opacity-60",
                    meta.highlight ? "gradient-accent text-primary-foreground hover:opacity-90 shadow-glow-primary" : "border border-border bg-secondary hover:bg-muted text-foreground"
                  ),
                  "data-ocid": `pricing.upgrade_button.${tier.tier}`,
                  children: [
                    isUpgrading && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                    tier.tier === SubscriptionTier.enterprise ? "Contact Sales" : `Upgrade to ${tier.name}`
                  ]
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function PricingPage() {
  var _a;
  const { actor, isFetching } = useBackend();
  const { isAuthenticated, login } = useAuth();
  const { data: tiers = FALLBACK_TIERS, isLoading } = useQuery({
    queryKey: ["subscriptionTiers"],
    queryFn: async () => {
      if (!actor) return FALLBACK_TIERS;
      const result = await actor.getSubscriptionTiers();
      return result.length > 0 ? result : FALLBACK_TIERS;
    },
    enabled: !!actor && !isFetching,
    staleTime: 3e5
  });
  const { data: profile } = useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const currentTier = (_a = profile == null ? void 0 : profile.subscription) == null ? void 0 : _a.tier;
  const upgradeMutation = useMutation({
    mutationFn: async (tier) => {
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
        cancelUrl
      );
      if (url) window.location.href = url;
    },
    onError: (err) => {
      ue.error(
        `Checkout failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { showSidebar: isAuthenticated, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background animate-fade-in",
      "data-ocid": "pricing.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-14 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "secondary",
                  className: "mb-4 bg-primary/10 text-primary border-primary/20",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-1.5" }),
                    "Credit-based pricing"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display font-bold text-4xl md:text-5xl mb-3", children: [
                "Choose your",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent", children: "creative plan" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-muted-foreground max-w-xl mx-auto", children: "Generate professional faceless YouTube videos with AI. Credits refresh monthly — no lock-in, cancel anytime." })
            ]
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "max-w-5xl mx-auto px-4 py-14",
            "data-ocid": "pricing.tiers_section",
            children: [
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-96 rounded-xl bg-card animate-pulse border border-border",
                  "data-ocid": `pricing.tier_skeleton.${i}`
                },
                i
              )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch", children: tiers.map((tier, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TierCard,
                {
                  tier,
                  index: i,
                  currentTier,
                  onUpgrade: (t) => upgradeMutation.mutate(t),
                  isUpgrading: upgradeMutation.isPending
                },
                tier.tier
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.p,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { delay: 0.5 },
                  className: "text-center text-sm text-muted-foreground mt-8",
                  children: "All plans billed monthly. Credits do not roll over. Secure checkout via Stripe."
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
          {
            title: "Instant access",
            body: "Credits available immediately after checkout."
          },
          {
            title: "Flexible upgrades",
            body: "Switch or cancel plans at any time from your settings."
          },
          {
            title: "Secure payments",
            body: "Powered by Stripe — your card details are never stored."
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-xl p-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm mb-1.5", children: item.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: item.body })
            ]
          },
          item.title
        )) }) }) })
      ]
    }
  ) });
}
export {
  PricingPage as default
};
