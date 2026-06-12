// ============================================================
// PlanningIntel AI — Opportunities Dashboard Page
// ============================================================

"use client";

import { useState } from "react";
import {
  Lightbulb,
  Search,
  Filter,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const opportunities = [
  {
    id: "1",
    title: "Birmingham Call for Sites — Residential Land",
    lpa: "Birmingham City Council",
    type: "call_for_sites",
    impact: "high",
    status: "active",
    deadline: "2026-08-15",
    confidence: 92,
    summary:
      "High-value opportunity to submit residential sites. Green Belt review sites within commuter belt of Birmingham city centre are being prioritised.",
  },
  {
    id: "2",
    title: "Greater Manchester — Employment Land Policy Shift",
    lpa: "Greater Manchester Combined Authority",
    type: "policy_change",
    impact: "high",
    status: "active",
    deadline: "2026-07-30",
    confidence: 85,
    summary:
      "Regulation 19 modifications signal increased demand for employment land in Salford and Trafford. Strategic sites near M60 corridor.",
  },
  {
    id: "3",
    title: "Leeds — New Site Allocations",
    lpa: "Leeds City Council",
    type: "site_allocation",
    impact: "medium",
    status: "active",
    deadline: "2026-08-28",
    confidence: 78,
    summary:
      "15 additional sites proposed. Mixed-use developments near transport hubs scoring highest for allocation.",
  },
  {
    id: "4",
    title: "Cornwall — Renewable Energy Sites",
    lpa: "Cornwall Council",
    type: "call_for_sites",
    impact: "medium",
    status: "active",
    deadline: "2026-09-01",
    confidence: 74,
    summary:
      "Growing demand for solar and wind energy sites. Council has identified target areas for renewable energy development.",
  },
  {
    id: "5",
    title: "Cambridgeshire — Transport Infrastructure",
    lpa: "Cambridgeshire County Council",
    type: "call_for_sites",
    impact: "low",
    status: "upcoming",
    deadline: "2026-10-15",
    confidence: 65,
    summary:
      "Upcoming opportunity for transport-related site submissions. Park and ride facilities and cycle infrastructure.",
  },
];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");

  const filtered = opportunities.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.lpa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Opportunities
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-identified planning opportunities ranked by impact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* AI Confidence Legend */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "High Impact", count: "2", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Medium Impact", count: "2", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "Low Impact", count: "1", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "AI Confidence >80%", count: "2", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className={`p-4 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.map((opp) => (
          <Card
            key={opp.id}
            className="transition-all hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    opp.impact === "high"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : opp.impact === "medium"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
                >
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {opp.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">{opp.lpa}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {opp.impact === "high" && (
                        <Badge variant="danger">HIGH</Badge>
                      )}
                      {opp.impact === "medium" && (
                        <Badge variant="warning">MEDIUM</Badge>
                      )}
                      {opp.impact === "low" && (
                        <Badge variant="default">LOW</Badge>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
                    {opp.summary}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-3 w-3" />
                      Deadline: {opp.deadline}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 font-medium">
                        {opp.confidence}% confidence
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}