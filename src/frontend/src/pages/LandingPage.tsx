import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Sparkles, Video, Wand2, Zap } from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: <Wand2 className="w-5 h-5" />,
    title: "Auto Script Generation",
    description:
      "Describe your topic and our AI crafts a compelling script optimized for YouTube engagement.",
  },
  {
    icon: <Video className="w-5 h-5" />,
    title: "AI Visuals & Animation",
    description:
      "Generate cinematic, animated, or photorealistic visuals automatically matched to your script.",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Natural AI Voiceover",
    description:
      "Studio-quality voiceovers in multiple tones — no recording equipment needed.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "One-Click Export",
    description:
      "Download ready-to-upload YouTube videos in 1080p or 4K with chapters and timestamps.",
  },
];

export default function LandingPage() {
  const { isAuthenticated, login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  function handleCTA() {
    if (isAuthenticated) {
      navigate({ to: "/generate" });
    } else {
      login();
    }
  }

  return (
    <Layout showSidebar={false}>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden min-h-[90vh] flex items-center justify-center py-20 px-4"
        data-ocid="hero.section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 dark:opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-faceless-ai.dim_1200x600.jpg')",
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary border border-primary/20"
              data-ocid="hero.badge"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              AI-Powered Faceless Video Generation
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex justify-center mb-6"
          >
            <img
              src="/assets/logo.jpg"
              alt="FacelessAI"
              className="h-14 w-auto object-contain"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6"
          >
            Create{" "}
            <span className="text-gradient-accent">Faceless YouTube</span>
            <br />
            Videos with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Go from idea to polished YouTube video in minutes. AI writes your
            script, generates visuals, adds voiceover — you stay completely
            anonymous.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={handleCTA}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-8 py-4 rounded-lg gradient-accent text-primary-foreground font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-smooth disabled:opacity-60"
              data-ocid="hero.primary_cta"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Video className="w-5 h-5" />
              )}
              {isAuthenticated ? "Generate a Video" : "Start Creating Free"}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-smooth"
              data-ocid="hero.pricing_link"
            >
              See pricing
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            No credit card required · Cancel anytime
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-muted/30"
        data-ocid="features.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Everything you need to go{" "}
              <span className="text-gradient-accent">faceless</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete AI pipeline from idea to uploaded YouTube video — no
              face, no studio, no crew.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card border-border shadow-card h-full hover:shadow-elevated transition-smooth hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center mb-4 shadow-glow-primary">
                      <span className="text-primary-foreground">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section
        id="pricing"
        className="py-20 px-4 bg-background"
        data-ocid="pricing.section"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Simple, credit-based{" "}
              <span className="text-gradient-accent">pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              Credits refresh monthly. Use them on any video style — cinematic,
              animated, or photorealistic. Plans starting from $9/month.
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-accent text-primary-foreground hover:opacity-90 transition-smooth shadow-glow-primary"
              data-ocid="pricing.view_plans_button"
            >
              <Link to="/pricing">
                View all plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 bg-muted/30" data-ocid="cta.section">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to create your first{" "}
              <span className="text-gradient-accent">faceless video?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of creators generating professional YouTube content
              with AI.
            </p>
            <button
              type="button"
              onClick={handleCTA}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg gradient-accent text-primary-foreground font-semibold text-lg shadow-glow-primary hover:opacity-90 transition-smooth disabled:opacity-60"
              data-ocid="cta.primary_button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {isAuthenticated ? "Go to Dashboard" : "Get started free"}
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
