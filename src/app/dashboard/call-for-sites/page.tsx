// ============================================================
// PlanningIntel AI — Call for Sites Dashboard
// Bloomberg Terminal high-density tracker
// ============================================================

"use client";

import { useState } from "react";
import { MapPin, Search, Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const callForSites = [
  { id: "1", lpa: "Birmingham City Council", title: "Development Plan — Call for Sites 2026", status: "open", openDate: "2026-06-01", closeDate: "2026-08-15", summary: "Residential allocations sought. Green Belt sites within 5km of city centre. Min 0.5ha." },
  { id: "2", lpa: "Leeds City Council", title: "Site Allocations Plan — Call for Sites", status: "open", openDate: "2026-05-15", closeDate: "2026-08-28", summary: "15 additional sites sought. Mixed-use and residential near transport corridors." },
  { id: "3", lpa: "Cornwall Council", title: "Climate Emergency DPD — Call for Sites", status: "open", openDate: "2026-06-10", closeDate: "2026-09-01", summary: "Renewable energy & BNG sites. Solar, wind, habitat creation." },
  { id: "4", lpa: "Cambs County Council", title: "Transport Plan — Call for Sites", status: "upcoming", openDate: "2026-08-01", closeDate: "2026-10-15", summary: "Transport infrastructure. Park & ride, cycle routes, bus corridors." },
  { id: "5", lpa: "Essex County Council", title: "Minerals Plan — Site Submissions", status: "closed", openDate: "2026-01-15", closeDate: "2026-03-30", summary: "Mineral extraction sites. Aggregate & silica sand." },
  { id: "6", lpa: "Bristol City Council", title: "Local Plan Review — Call for Sites", status: "open", openDate: "2026-06-15", closeDate: "2026-09-30", summary: "All development types. Council prioritising brownfield and city-centre sites." },
];

export default function CallForSitesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "upcoming" | "closed">("all");

  const filtered = callForSites.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (search && !s.lpa.toLowerCase().includes(search.toLowerCase()) && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCount = callForSites.filter(s => s.status === "open").length;

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-green-700 text-white">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">Call for Sites</h1>
            <p className="text-[10px] text-gray-500">{openCount} open now &middot; {callForSites.length} active consultations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "open", "upcoming", "closed"] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider ${statusFilter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-5 grid grid-cols-4 gap-[1px] bg-gray-200 dark:bg-gray-800">
        {[
          { label: "OPEN NOW", value: openCount, color: "text-green-600 dark:text-green-400" },
          { label: "UPCOMING", value: callForSites.filter(s => s.status === "upcoming").length, color: "text-amber-600 dark:text-amber-400" },
          { label: "CLOSING THIS MO", value: 2, color: "text-red-600 dark:text-red-400" },
          { label: "TOTAL YTD", value: 18, color: "text-blue-600 dark:text-blue-400" },
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
          <Input placeholder="Search by LPA..." className="h-8 border-gray-200 pl-8 text-xs dark:border-gray-700" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* List */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((site) => (
              <div key={site.id} className="data-row group">
                <span className={`status-dot ${site.status} mr-3 shrink-0`} />
                <div className="w-44 shrink-0 truncate text-[11px] font-medium text-gray-900 dark:text-gray-100">{site.lpa}</div>
                <div className="flex-1 min-w-0 truncate text-[11px] text-gray-600 dark:text-gray-400">{site.title}</div>
                <div className="mx-3 flex w-28 shrink-0 items-center gap-1 text-[10px] text-gray-500">
                  <Clock className="h-3 w-3" />
                  {site.closeDate}
                </div>
                <Badge variant={site.status === "open" ? "success" : site.status === "upcoming" ? "warning" : "outline"} className="text-[10px] px-1.5 py-0 uppercase">{site.status}</Badge>
                <ArrowUpRight className="ml-2 h-3 w-3 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}