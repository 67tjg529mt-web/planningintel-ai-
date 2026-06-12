// ============================================================
// PlanningIntel AI — Call for Sites Dashboard Page
// ============================================================

"use client";

import { useState } from "react";
import {
  MapPin,
  Search,
  Calendar,
  ExternalLink,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const callForSites = [
  {
    id: "1",
    lpa: "Birmingham City Council",
    title: "Birmingham Development Plan — Call for Sites 2026",
    status: "open",
    openDate: "2026-06-01",
    closeDate: "2026-08-15",
    siteArea: "Various sites across Birmingham",
    aiSummary:
      "High-priority Call for Sites seeking residential allocations. Green Belt sites within 5km of city centre particularly welcome. Minimum site size: 0.5ha.",
  },
  {
    id: "2",
    lpa: "Leeds City Council",
    title: "Leeds Site Allocations Plan — Call for Sites",
    status: "open",
    openDate: "2026-05-15",
    closeDate: "2026-08-28",
    siteArea: "All areas within Leeds district",
    aiSummary:
      "Additional 15 sites sought for allocation. Mixed-use and residential opportunities. Sites near transport corridors preferred.",
  },
  {
    id: "3",
    lpa: "Cornwall Council",
    title: "Cornwall Climate Emergency DPD — Call for Sites",
    status: "open",
    openDate: "2026-06-10",
    closeDate: "2026-09-01",
    siteArea: "Cornwall region",
    aiSummary:
      "Call for renewable energy and biodiversity net gain sites. Solar, wind, and habitat creation opportunities sought.",
  },
  {
    id: "4",
    lpa: "Cambridgeshire County Council",
    title: "Cambridgeshire Transport Plan — Call for Sites",
    status: "upcoming",
    openDate: "2026-08-01",
    closeDate: "2026-10-15",
    siteArea: "Cambridgeshire region",
    aiSummary:
      "Upcoming Call for Sites for transport infrastructure. Park and ride, cycle routes, and bus corridors.",
  },
  {
    id: "5",
    lpa: "Essex County Council",
    title: "Essex Minerals Local Plan — Site Submissions",
    status: "closed",
    openDate: "2026-01-15",
    closeDate: "2026-03-30",
    siteArea: "Essex county",
    aiSummary:
      "Closed Call for Sites for mineral extraction. Aggregate and silica sand sites considered.",
  },
];

export default function CallForSitesPage() {
  const [search, setSearch] = useState("");

  const filtered = callForSites.filter(
    (s) =>
      s.lpa.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase())
  );

  const openCount = callForSites.filter((s) => s.status === "open").length;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Call for Sites
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track active Call for Sites consultations across England
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Calendar View
        </Button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {[
          { label: "Open Now", value: String(openCount), color: "text-green-600" },
          { label: "Upcoming", value: "1", color: "text-blue-600" },
          { label: "Closing This Month", value: "2", color: "text-amber-600" },
          { label: "Total This Year", value: "18", color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by LPA or site title..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((site) => (
              <div
                key={site.id}
                className="flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    site.status === "open"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : site.status === "upcoming"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {site.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">{site.lpa}</p>
                    </div>
                    <Badge
                      variant={
                        site.status === "open"
                          ? "success"
                          : site.status === "upcoming"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {site.status === "open"
                        ? "Open"
                        : site.status === "upcoming"
                          ? "Upcoming"
                          : "Closed"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 dark:text-gray-400">
                    {site.aiSummary}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Opens: {site.openDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Closes: {site.closeDate}
                    </span>
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