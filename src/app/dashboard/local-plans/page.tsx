// ============================================================
// PlanningIntel AI — Local Plans Dashboard
// Bloomberg Terminal high-density tracker
// ============================================================

"use client";

import { useState } from "react";
import { FileText, Search, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const localPlans = [
  { id: "1", lpa: "Birmingham City Council", title: "Birmingham Development Plan 2031", stage: "adopted", lastUpdated: "2026-05-15", nextReview: "2028-03-01", summary: "Adopted. Housing target 89,000 homes. Green Belt review 2027." },
  { id: "2", lpa: "Greater Manchester CA", title: "Places for Everyone", stage: "regulation_19", lastUpdated: "2026-06-10", nextReview: null, summary: "Reg. 19 stage. Employment land modifications published." },
  { id: "3", lpa: "Cornwall Council", title: "Local Plan Strategic Policies 2010-2030", stage: "review", lastUpdated: "2026-06-01", nextReview: "2026-09-01", summary: "Partial review underway. Climate Emergency DPD in preparation." },
  { id: "4", lpa: "Leeds City Council", title: "Leeds Core Strategy", stage: "regulation_18", lastUpdated: "2026-06-08", nextReview: null, summary: "Reg. 18 consultation. 15 additional sites proposed for allocation." },
  { id: "5", lpa: "Essex County Council", title: "Essex Minerals Local Plan", stage: "adopted", lastUpdated: "2026-04-20", nextReview: "2027-06-01", summary: "Adopted minerals plan. Minor safeguarding amendments." },
  { id: "6", lpa: "Cambs County Council", title: "Local Transport & Connectivity Plan", stage: "regulation_19", lastUpdated: "2026-06-12", nextReview: null, summary: "Reg. 19 stage. New sustainable transport corridors proposed." },
];

const stageConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "info" }> = {
  adopted: { label: "ADOPTED", variant: "success" },
  regulation_18: { label: "REG.18", variant: "warning" },
  regulation_19: { label: "REG.19", variant: "info" },
  review: { label: "REVIEW", variant: "warning" },
};

export default function LocalPlansPage() {
  const [search, setSearch] = useState("");
  const filtered = localPlans.filter(p => p.lpa.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-700 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">Local Plans</h1>
            <p className="text-[10px] text-gray-500">{localPlans.length} plans &middot; {localPlans.filter(p => p.stage === "regulation_18" || p.stage === "regulation_19").length} in consultation</p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-5 grid grid-cols-4 gap-[1px] bg-gray-200 dark:bg-gray-800">
        {[
          { label: "TOTAL PLANS", value: "156", color: "text-blue-600" },
          { label: "IN CONSULTATION", value: "34", color: "text-amber-600" },
          { label: "RECENTLY UPDTD", value: "12", color: "text-green-600" },
          { label: "AWAIT REVIEW", value: "8", color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-3 py-2 dark:bg-gray-950">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className={`data-value text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search plans..." className="h-8 border-gray-200 pl-8 text-xs dark:border-gray-700" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((plan) => (
              <div key={plan.id} className="data-row group">
                <div className="w-44 shrink-0 truncate text-[11px] font-medium text-gray-900 dark:text-gray-100">{plan.lpa}</div>
                <div className="flex-1 min-w-0 truncate text-[11px] text-gray-600 dark:text-gray-400">{plan.title}</div>
                <div className="mx-3 flex w-20 shrink-0 items-center gap-1 text-[10px] text-gray-500">
                  <Clock className="h-3 w-3" />{plan.lastUpdated}
                </div>
                <Badge variant={stageConfig[plan.stage]?.variant || "default"} className="text-[10px] px-1.5 py-0 uppercase">{stageConfig[plan.stage]?.label || plan.stage}</Badge>
                <ArrowUpRight className="ml-2 h-3 w-3 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}