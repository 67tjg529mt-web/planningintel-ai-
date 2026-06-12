// ============================================================
// PlanningIntel AI — Opportunities Dashboard
// Bloomberg Terminal high-density opportunity tracker
// ============================================================

"use client";

import { useState } from "react";
import { Lightbulb, Search, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const opportunities = [
  { id: "1", title: "Birmingham — Residential Land Call for Sites", lpa: "Birmingham City Council", type: "call_for_sites", impact: "high", score: 92, deadline: "2026-08-15", summary: "High-value residential sites sought. Green Belt review sites within commuter belt prioritised. Min site 0.5ha." },
  { id: "2", title: "Greater Manchester — Employment Land Policy Shift", lpa: "Greater Manchester Combined Authority", type: "policy_change", impact: "high", score: 85, deadline: "2026-07-30", summary: "Reg. 19 modifications signal increased employment land demand in Salford/Trafford. Strategic sites near M60." },
  { id: "3", title: "Leeds — New Site Allocations (15 Sites)", lpa: "Leeds City Council", type: "site_allocation", impact: "medium", score: 78, deadline: "2026-08-28", summary: "15 additional sites proposed. Mixed-use near transport hubs scoring highest for allocation." },
  { id: "4", title: "Cornwall — Renewable Energy Sites", lpa: "Cornwall Council", type: "call_for_sites", impact: "medium", score: 74, deadline: "2026-09-01", summary: "Growing demand for solar/wind energy sites. Council target areas identified for renewables." },
  { id: "5", title: "Cambs — Transport Infrastructure", lpa: "Cambridgeshire County Council", type: "call_for_sites", impact: "low", score: 65, deadline: "2026-10-15", summary: "Upcoming transport infrastructure site submissions. Park & ride, cycle routes, bus corridors." },
  { id: "6", title: "Essex — Minerals Plan Safeguarding", lpa: "Essex County Council", type: "policy_change", impact: "low", score: 42, deadline: "2026-12-01", summary: "Minor amendments to Minerals Local Plan safeguarding areas." },
];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "deadline">("score");

  const filtered = [...opportunities]
    .filter((o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.lpa.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortBy === "score" ? b.score - a.score : a.deadline.localeCompare(b.deadline));

  const avgScore = Math.round(opportunities.reduce((s, o) => s + o.score, 0) / opportunities.length);

  return (
    <div className="p-4 lg:p-6">
      {/* Terminal header */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-600 text-white">
            <Lightbulb className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Opportunity Tracker
            </h1>
            <p className="text-[10px] text-gray-500">{opportunities.length} active &middot; Avg score {avgScore}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSortBy("score")} className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${sortBy === "score" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>By Score</button>
          <button onClick={() => setSortBy("deadline")} className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${sortBy === "deadline" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>By Deadline</button>
        </div>
      </div>

      {/* Terminal stat bar */}
      <div className="mb-5 grid grid-cols-5 gap-[1px] bg-gray-200 dark:bg-gray-800">
        {[
          { label: "ACTIVE", value: opportunities.filter(o => o.impact === "high").length, color: "text-red-500" },
          { label: "HIGH IMPACT", value: opportunities.filter(o => o.impact === "high").length, color: "text-red-500" },
          { label: "MEDIUM", value: opportunities.filter(o => o.impact === "medium").length, color: "text-amber-500" },
          { label: "LOW", value: opportunities.filter(o => o.impact === "low").length, color: "text-blue-500" },
          { label: "AVG SCORE", value: `${avgScore}%`, color: opportunities.filter(o => o.score >= 70).length >= 3 ? "text-green-500" : "text-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-3 py-2 dark:bg-gray-950">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className={`data-value text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search opportunities..." className="h-8 border-gray-200 pl-8 text-xs dark:border-gray-700" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Opportunities — data row style */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((opp) => (
              <div key={opp.id} className="data-row group">
                {/* Score indicator bar */}
                <div className="mr-3 flex w-12 shrink-0 items-center gap-1.5">
                  <div className="h-3 w-12 overflow-hidden rounded-sm bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-sm transition-all ${
                        opp.score >= 80 ? "bg-green-500" : opp.score >= 60 ? "bg-amber-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${opp.score}%` }}
                    />
                  </div>
                  <span className="data-value w-6 text-right text-[10px] font-bold text-gray-700 dark:text-gray-300">
                    {opp.score}
                  </span>
                </div>

                {/* Title + LPA */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[11px] font-medium text-gray-900 dark:text-gray-100">{opp.title}</p>
                  <p className="truncate text-[10px] text-gray-500">{opp.lpa}</p>
                </div>

                {/* Deadline */}
                <div className="mx-3 flex w-20 shrink-0 items-center gap-1 text-[10px] text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {opp.deadline}
                </div>

                {/* Impact badge */}
                <div className="w-14 shrink-0 text-right">
                  <Badge variant={opp.impact === "high" ? "danger" : opp.impact === "medium" ? "warning" : "default"} className="text-[10px] px-1.5 py-0 uppercase">
                    {opp.impact}
                  </Badge>
                </div>

                <ArrowUpRight className="ml-2 h-3 w-3 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insight Panel */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">AI Opportunity Insights</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="rounded-sm border border-gray-200 p-3 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Top Opportunity</p>
              <p className="text-gray-600 dark:text-gray-400">{opportunities[0].title}</p>
              <p className="text-green-600 dark:text-green-400 mt-1 text-[10px] font-medium">Score: {opportunities[0].score} &middot; Urgency: High</p>
            </div>
            <div className="rounded-sm border border-gray-200 p-3 dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Market Trend</p>
              <p className="text-gray-600 dark:text-gray-400">Residential Call for Sites dominate. Rising interest in renewable energy sites across SW England.</p>
              <p className="text-amber-600 dark:text-amber-400 mt-1 text-[10px] font-medium">+23% opportunities vs last quarter</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}