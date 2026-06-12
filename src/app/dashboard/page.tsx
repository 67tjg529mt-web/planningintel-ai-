// ============================================================
// PlanningIntel AI — Dashboard Overview
// ============================================================

"use client";

import { useState } from "react";
import {
  BarChart3,
  Bell,
  FileText,
  Globe,
  Lightbulb,
  MapPin,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for initial display
const statsCards = [
  {
    title: "LPAs Monitored",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Active Call for Sites",
    value: "23",
    change: "+5",
    trend: "up",
    icon: MapPin,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "New Opportunities",
    value: "8",
    change: "+3",
    trend: "up",
    icon: Lightbulb,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Unread Alerts",
    value: "3",
    change: "-2",
    trend: "down",
    icon: Bell,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
];

const recentOpportunities = [
  {
    id: "1",
    title: "Birmingham City Council — Call for Sites",
    lpa: "Birmingham City Council",
    type: "call_for_sites",
    impact: "high",
    deadline: "2026-08-15",
    ai_summary:
      "New Call for Sites opened for housing allocation. Green Belt review sites particularly sought after.",
  },
  {
    id: "2",
    title: "Greater Manchester — Places for Everyone Update",
    lpa: "Greater Manchester Combined Authority",
    type: "policy_change",
    impact: "high",
    deadline: "2026-07-30",
    ai_summary:
      "Regulation 19 stage modifications published. Key changes to employment land designations.",
  },
  {
    id: "3",
    title: "Cornwall Council — Climate Emergency DPD",
    lpa: "Cornwall Council",
    type: "plan_adoption",
    impact: "medium",
    deadline: "2026-09-01",
    ai_summary:
      "Climate Emergency Development Plan Document adopted. New sustainability requirements for all developments.",
  },
  {
    id: "4",
    title: "Leeds City Council — Site Allocations Review",
    lpa: "Leeds City Council",
    type: "site_allocation",
    impact: "medium",
    deadline: "2026-08-28",
    ai_summary:
      "Additional 15 sites proposed for allocation. Mixed-use and residential opportunities identified.",
  },
  {
    id: "5",
    title: "Essex County Council — Minerals Local Plan",
    lpa: "Essex County Council",
    type: "policy_change",
    impact: "low",
    deadline: "2026-10-01",
    ai_summary:
      "Minor amendments to Minerals Local Plan. Updated safeguarding areas for mineral extraction.",
  },
];

const recentAlerts = [
  {
    id: "1",
    type: "new_call_for_sites",
    title: "New Call for Sites: Birmingham City Council",
    description: "Call for Sites now open. Deadline: 15 Aug 2026",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "plan_update",
    title: "Plan Update: Greater Manchester",
    description: "Regulation 19 modifications published",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "deadline_approaching",
    title: "Deadline Approaching: Cornwall Climate DPD",
    description: "Consultation closes in 7 days",
    time: "1 day ago",
    read: false,
  },
  {
    id: "4",
    type: "opportunity",
    title: "High Impact Opportunity: Leeds Site Allocations",
    description: "15 new sites proposed. Act now.",
    time: "2 days ago",
    read: true,
  },
];

const lpasByRegion = [
  { region: "South East", count: 28 },
  { region: "London", count: 33 },
  { region: "North West", count: 22 },
  { region: "West Midlands", count: 18 },
  { region: "East of England", count: 20 },
  { region: "South West", count: 19 },
  { region: "Yorkshire", count: 16 },
];

export default function DashboardOverview() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your planning intelligence overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                timeframe === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {stat.change}
                    </span>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Opportunities by Impact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Opportunities by Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "High Impact", count: 12, color: "bg-red-500" },
                { label: "Medium Impact", count: 28, color: "bg-amber-500" },
                { label: "Low Impact", count: 15, color: "bg-blue-500" },
              ].map((item) => {
                const total = 55;
                const pct = (item.count / total) * 100;
                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <span className="text-gray-500">{item.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* LPAs by Region */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              LPAs by Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lpasByRegion.map((item) => {
                const max = Math.max(...lpasByRegion.map((r) => r.count));
                const pct = (item.count / max) * 100;
                return (
                  <div key={item.region} className="flex items-center gap-3">
                    <span className="w-28 text-xs text-gray-600 dark:text-gray-400">
                      {item.region}
                    </span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-2 rounded-full bg-blue-500 dark:bg-blue-600"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Scraper Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Scraper Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    97.2% Uptime
                  </p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    2,847
                  </p>
                  <p className="text-xs text-gray-500">Scrapes Today</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    23
                  </p>
                  <p className="text-xs text-gray-500">Changes Detected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Opportunities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High-Value Opportunities
            </CardTitle>
            <Badge variant="info">AI Analyzed</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentOpportunities.slice(0, 4).map((opp) => (
                <div
                  key={opp.id}
                  className="group cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-gray-900 truncate dark:text-gray-100">
                          {opp.title}
                        </h4>
                        {opp.impact === "high" && (
                          <Badge variant="danger">HIGH</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{opp.lpa}</p>
                      <p className="mt-1.5 text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
                        {opp.ai_summary}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recent Alerts
            </CardTitle>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View all
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    !alert.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      alert.type === "new_call_for_sites"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : alert.type === "plan_update"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : alert.type === "deadline_approaching"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    }`}
                  >
                    {alert.type === "new_call_for_sites" ? (
                      <MapPin className="h-4 w-4" />
                    ) : alert.type === "plan_update" ? (
                      <FileText className="h-4 w-4" />
                    ) : alert.type === "deadline_approaching" ? (
                      <Clock className="h-4 w-4" />
                    ) : (
                      <Lightbulb className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {alert.title}
                      </h4>
                      {!alert.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {alert.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {alert.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}