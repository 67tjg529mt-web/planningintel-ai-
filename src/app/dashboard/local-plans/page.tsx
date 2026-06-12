// ============================================================
// PlanningIntel AI — Local Plans Dashboard Page
// ============================================================

"use client";

import { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const localPlans = [
  {
    id: "1",
    lpa: "Birmingham City Council",
    title: "Birmingham Development Plan 2031",
    stage: "adopted",
    lastUpdated: "2026-05-15",
    nextReview: "2028-03-01",
    aiSummary:
      "Adopted plan with housing target of 89,000 homes. Green Belt review scheduled for 2027.",
  },
  {
    id: "2",
    lpa: "Greater Manchester Combined Authority",
    title: "Places for Everyone",
    stage: "regulation_19",
    lastUpdated: "2026-06-10",
    nextReview: null,
    aiSummary:
      "Regulation 19 publication stage. Modifications to employment land designations published.",
  },
  {
    id: "3",
    lpa: "Cornwall Council",
    title: "Cornwall Local Plan Strategic Policies 2010-2030",
    stage: "review",
    lastUpdated: "2026-06-01",
    nextReview: "2026-09-01",
    aiSummary:
      "Partial review underway. Climate Emergency DPD being prepared alongside main plan review.",
  },
  {
    id: "4",
    lpa: "Leeds City Council",
    title: "Leeds Core Strategy",
    stage: "regulation_18",
    lastUpdated: "2026-06-08",
    nextReview: null,
    aiSummary:
      "Regulation 18 consultation on new site allocations. Additional 15 sites proposed.",
  },
  {
    id: "5",
    lpa: "Essex County Council",
    title: "Essex Minerals Local Plan",
    stage: "adopted",
    lastUpdated: "2026-04-20",
    nextReview: "2027-06-01",
    aiSummary:
      "Adopted minerals plan. Minor amendments to safeguarding areas published.",
  },
  {
    id: "6",
    lpa: "Cambridgeshire County Council",
    title: "Cambridgeshire Local Transport and Connectivity Plan",
    stage: "regulation_19",
    lastUpdated: "2026-06-12",
    nextReview: null,
    aiSummary:
      "Regulation 19 stage. New sustainable transport corridors proposed.",
  },
];

const stageConfig: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }
> = {
  emerging: { label: "Emerging", variant: "default" },
  regulation_18: { label: "Reg. 18", variant: "warning" },
  regulation_19: { label: "Reg. 19", variant: "info" },
  submission: { label: "Submission", variant: "info" },
  adopted: { label: "Adopted", variant: "success" },
  review: { label: "Under Review", variant: "warning" },
};

export default function LocalPlansPage() {
  const [search, setSearch] = useState("");

  const filtered = localPlans.filter(
    (p) =>
      p.lpa.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Local Plans
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track Local Plan progress across all monitored LPAs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "Total Plans", value: "156", color: "text-blue-600" },
          { label: "Under Consultation", value: "34", color: "text-amber-600" },
          { label: "Recently Updated", value: "12", color: "text-green-600" },
          { label: "Awaiting Review", value: "8", color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by LPA or plan name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Plans List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((plan) => (
              <div
                key={plan.id}
                className="flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {plan.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">{plan.lpa}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={stageConfig[plan.stage]?.variant}>
                        {stageConfig[plan.stage]?.label || plan.stage}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
                    {plan.aiSummary}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated: {plan.lastUpdated}
                    </span>
                    {plan.nextReview && (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        Review: {plan.nextReview}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}