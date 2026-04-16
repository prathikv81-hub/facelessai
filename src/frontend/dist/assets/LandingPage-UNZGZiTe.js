import { u as useAuth, a as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-CMKZUFdA.js";
import { L as Layout, B as Badge, a as LoaderCircle, V as Video, Z as Zap } from "./badge-DORezHz4.js";
import { B as Button } from "./button-BfOBeu4g.js";
import { C as Card, a as CardContent } from "./card-CI9qC1Hp.js";
import { m as motion } from "./proxy-DIUJpt6T.js";
import { S as Sparkles } from "./sparkles-CZDi3JRe.js";
import { c as createLucideIcon } from "./createLucideIcon-CjzoZNB-.js";
import { W as WandSparkles } from "./wand-sparkles--ZhrsTW6.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
const FEATURES = [
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-5 h-5" }),
    title: "Auto Script Generation",
    description: "Describe your topic and our AI crafts a compelling script optimized for YouTube engagement."
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-5 h-5" }),
    title: "AI Visuals & Animation",
    description: "Generate cinematic, animated, or photorealistic visuals automatically matched to your script."
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5" }),
    title: "Natural AI Voiceover",
    description: "Studio-quality voiceovers in multiple tones — no recording equipment needed."
  },
  {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
    title: "One-Click Export",
    description: "Download ready-to-upload YouTube videos in 1080p or 4K with chapters and timestamps."
  }
];
function LandingPage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  function handleCTA() {
    if (isAuthenticated) {
      navigate({ to: "/generate" });
    } else {
      login();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { showSidebar: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        id: "hero",
        className: "relative overflow-hidden min-h-[90vh] flex items-center justify-center py-20 px-4",
        "data-ocid": "hero.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20",
              style: {
                backgroundImage: "url('/assets/generated/hero-faceless-ai.dim_1200x600.jpg')"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-4xl mx-auto text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20",
                    "data-ocid": "hero.badge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 mr-1.5" }),
                      "AI-Powered Faceless Video Generation"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.05 },
                className: "flex justify-center mb-6",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: "/assets/logo.jpg",
                    alt: "FacelessAI",
                    className: "h-14 w-auto object-contain"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.h1,
              {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.1 },
                className: "font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6",
                children: [
                  "Create",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent", children: "Faceless YouTube" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                  "Videos with AI"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.2 },
                className: "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed",
                children: "Go from idea to polished YouTube video in minutes. AI writes your script, generates visuals, adds voiceover — you stay completely anonymous."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.3 },
                className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handleCTA,
                      disabled: isLoggingIn,
                      className: "flex items-center gap-2 px-8 py-4 rounded-lg gradient-accent text-primary-foreground font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-smooth disabled:opacity-60",
                      "data-ocid": "hero.primary_cta",
                      children: [
                        isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "w-5 h-5" }),
                        isAuthenticated ? "Generate a Video" : "Start Creating Free",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: "#pricing",
                      className: "flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-smooth",
                      "data-ocid": "hero.pricing_link",
                      children: "See pricing"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.6, delay: 0.5 },
                className: "mt-6 text-sm text-muted-foreground",
                children: "No credit card required · Cancel anytime"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "features",
        className: "py-20 px-4 bg-muted/30",
        "data-ocid": "features.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5 },
              className: "text-center mb-14",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl md:text-4xl mb-4", children: [
                  "Everything you need to go",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent", children: "faceless" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto", children: "A complete AI pipeline from idea to uploaded YouTube video — no face, no studio, no crew." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: FEATURES.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.5, delay: index * 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border shadow-card h-full hover:shadow-elevated transition-smooth hover:border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg gradient-accent flex items-center justify-center mb-4 shadow-glow-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary-foreground", children: feature.icon }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-lg mb-2", children: feature.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground leading-relaxed", children: feature.description })
              ] }) })
            },
            feature.title
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "pricing",
        className: "py-20 px-4 bg-background",
        "data-ocid": "pricing.section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl md:text-4xl mb-4", children: [
                "Simple, credit-based",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent", children: "pricing" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto mb-8", children: "Credits refresh monthly. Use them on any video style — cinematic, animated, or photorealistic. Plans starting from $9/month." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  asChild: true,
                  size: "lg",
                  className: "gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary",
                  "data-ocid": "pricing.view_plans_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pricing", children: [
                    "View all plans",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                  ] })
                }
              )
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 px-4 bg-muted/30", "data-ocid": "cta.section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-3xl mx-auto text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display font-bold text-3xl md:text-4xl mb-4", children: [
            "Ready to create your first",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-accent", children: "faceless video?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-8", children: "Join thousands of creators generating professional YouTube content with AI." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleCTA,
              disabled: isLoggingIn,
              className: "inline-flex items-center gap-2 px-8 py-4 rounded-lg gradient-accent text-primary-foreground font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-smooth disabled:opacity-60",
              "data-ocid": "cta.primary_button",
              children: [
                isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
                isAuthenticated ? "Go to Dashboard" : "Get started free"
              ]
            }
          )
        ]
      }
    ) }) })
  ] });
}
export {
  LandingPage as default
};
