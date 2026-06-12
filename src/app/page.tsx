// ============================================================
// PlanningIntel AI — Landing Page
// ============================================================

import Link from "next/link";
import {
  BarChart3,
  Bell,
  FileText,
  Globe,
  Lightbulb,
  MapPin,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">PI</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              PlanningIntel <span className="text-blue-600">AI</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Pricing
            </Link>
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Sign In
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              AI-Powered Planning Intelligence
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-gray-100">
              Never Miss a{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Planning Opportunity
              </span>{" "}
              Again
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              PlanningIntel AI automates the monitoring of all 330+ English Local
              Planning Authorities. Detect Local Plan updates and Call for Sites
              opportunities instantly — powered by AI that summarizes changes and
              flags what matters to you.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="xl" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="xl">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Cancel anytime
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "330+", label: "LPAs Monitored" },
              { value: "15hrs", label: "Saved Per Week" },
              { value: "97%", label: "Detection Accuracy" },
              { value: "24/7", label: "Real-Time Alerts" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Everything you need to stay ahead
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From automated scraping to AI-powered insights — PlanningIntel AI
              gives planning consultancies and developers a decisive edge.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "Full LPA Coverage",
                description:
                  "Monitors all 330+ English Local Planning Authorities automatically. Never manually check a council website again.",
              },
              {
                icon: FileText,
                title: "Local Plan Tracking",
                description:
                  "Detects updates to Local Plans at every stage — from Regulation 18 consultations through to adoption and review.",
              },
              {
                icon: MapPin,
                title: "Call for Sites Alerts",
                description:
                  "Real-time notifications when new Call for Sites consultations open. Be the first to submit sites.",
              },
              {
                icon: Lightbulb,
                title: "AI Opportunity Analysis",
                description:
                  "AI automatically assesses each opportunity's impact level, summarises key changes, and recommends actions.",
              },
              {
                icon: Bell,
                title: "Smart Alerts",
                description:
                  "Get notified only about what matters. Customise alert preferences by LPA, opportunity type, and impact level.",
              },
              {
                icon: BarChart3,
                title: "Weekly Intelligence Digest",
                description:
                  "Curated weekly summary of all changes, opportunities, and deadlines across your monitored LPAs.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-800"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Three simple steps to transform your planning intelligence workflow.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Target,
                title: "Select Your LPAs",
                description:
                  "Choose the Local Planning Authorities you want to monitor. Start with your target regions, add more anytime.",
              },
              {
                step: "02",
                icon: Zap,
                title: "AI Monitors 24/7",
                description:
                  "Our scrapers check council websites round the clock. AI detects changes, summarises updates, and assesses opportunities.",
              },
              {
                step: "03",
                icon: Bell,
                title: "Get Actionable Alerts",
                description:
                  "Receive real-time alerts and a Weekly Intelligence Digest. Be first to act on new Call for Sites and plan changes.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Icon className="h-8 w-8" />
                  </div>
                  <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Step {item.step}
                  </p>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Built for planning professionals
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8">
            {[
              {
                title: "First-Mover Advantage",
                description:
                  "Get notified about Call for Sites openings within hours, not days. Submit your sites before competitors even know consultations have opened.",
                icon: Clock,
              },
              {
                title: "Save Dozens of Hours",
                description:
                  "Eliminate manual checking of 300+ council websites. Our AI does the monitoring, so your team focuses on winning sites.",
                icon: Zap,
              },
              {
                title: "AI-Powered Intelligence",
                description:
                  "Not just raw data — AI summarises policy changes, assesses opportunity impact, and recommends your next move with confidence scores.",
                icon: Sparkles,
              },
            ].map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="flex gap-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Everything you need to transform your planning intelligence workflow.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "£99",
                period: "/month",
                description: "For individual consultants",
                features: [
                  "Up to 20 LPAs",
                  "Real-time alerts",
                  "AI change summaries",
                  "Weekly digest",
                  "Email support",
                ],
                cta: "Start Free Trial",
                popular: false,
              },
              {
                name: "Pro",
                price: "£200",
                period: "/month",
                description: "For growing teams",
                features: [
                  "Unlimited LPAs",
                  "Real-time alerts",
                  "AI opportunity analysis",
                  "Weekly intelligence digest",
                  "Priority support",
                  "Team collaboration",
                  "API access",
                ],
                cta: "Start Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organisations",
                features: [
                  "Everything in Pro",
                  "Custom LPA coverage",
                  "Dedicated account manager",
                  "Custom integrations",
                  "SLA guarantee",
                  "On-premise option",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-blue-500 bg-white shadow-xl dark:border-blue-600 dark:bg-gray-900"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href={plan.popular ? "/auth/register" : "/auth/register"}>
                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your planning intelligence?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join leading planning consultancies and developers who never miss an
            opportunity. Start your free trial today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button
                size="xl"
                className="bg-white text-blue-700 hover:bg-blue-50"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="xl"
                className="border-blue-400 text-white hover:bg-blue-500/50"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600">
                <span className="text-xs font-bold text-white">PI</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                PlanningIntel AI
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} PlanningIntel AI. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}