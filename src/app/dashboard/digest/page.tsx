// ============================================================
// PlanningIntel AI — Weekly Intelligence Digest Dashboard
// Bloomberg Terminal-style digest viewer
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Mail, RefreshCw, Calendar, TrendingUp, MapPin, Scale, Lightbulb, ArrowUpRight, Loader2 } from "lucide-react";

interface DigestData {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  totalChanges: number;
  newCallForSites: number;
  planUpdates: number;
  newOpportunities: number;
  pendingAppeals: number;
  summary: string;
  sections: {
    title: string;
    icon: string;
    items: {
      id: string;
      lpaName: string;
      title: string;
      summary: string;
      impact: string;
      date: string;
      type: string;
    }[];
  }[];
}

const sectionIcons: Record<string, React.ReactNode> = {
  "New & Active Call for Sites": <MapPin className="h-4 w-4" />,
  "Local Plan Updates": <FileText className="h-4 w-4" />,
  "AI-Identified Opportunities": <Lightbulb className="h-4 w-4" />,
  "Notable Appeal Decisions": <Scale className="h-4 w-4" />,
};

const typeIcons: Record<string, React.ReactNode> = {
  call_for_sites: <MapPin className="h-3 w-3" />,
  plan_update: <FileText className="h-3 w-3" />,
  opportunity: <Lightbulb className="h-3 w-3" />,
  appeal: <Scale className="h-3 w-3" />,
};

export default function DigestPage() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchDigest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cron/digest");
      const data = await res.json();
      if (data.status === "available" || data.status === "preview") {
        setDigest(data.digest);
      } else {
        setDigest(null);
      }
    } catch {
      // Use offline fallback
      setDigest(null);
    }
    setLoading(false);
  };

  const generateDigest = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/cron/digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookbackDays: 7, dispatch: true }),
      });
      const data = await res.json();
      if (data.success && data.digest) {
        setDigest(data.digest);
      }
    } catch {}
    setGenerating(false);
  };

  useEffect(() => {
    fetchDigest();
  }, []);

  const impactVariant = (impact: string) => {
    switch (impact) {
      case "high": return "danger" as const;
      case "medium": return "warning" as const;
      default: return "default" as const;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-purple-700 text-white">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Weekly Intelligence Digest
            </h1>
            <p className="text-[10px] text-gray-500">
              {digest ? `${digest.weekStart} — ${digest.weekEnd}` : "No digest generated"}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={generateDigest} disabled={generating} className="h-7 text-[11px] gap-1.5">
          {generating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {generating ? "Generating..." : "Generate Now"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : digest ? (
        <>
          {/* Stats bar */}
          <div className="mb-5 grid grid-cols-5 gap-[1px] bg-gray-200 dark:bg-gray-800">
            {[
              { label: "CHANGES", value: digest.totalChanges, color: "text-blue-600 dark:text-blue-400" },
              { label: "CALL FOR SITES", value: digest.newCallForSites, color: "text-green-600 dark:text-green-400" },
              { label: "PLAN UPDATES", value: digest.planUpdates, color: "text-amber-600 dark:text-amber-400" },
              { label: "OPPORTUNITIES", value: digest.newOpportunities, color: "text-purple-600 dark:text-purple-400" },
              { label: "APPEALS", value: digest.pendingAppeals, color: "text-red-600 dark:text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-3 py-2 dark:bg-gray-950">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
                <p className={`data-value text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <Card className="mb-5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Executive Summary</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{digest.summary}</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                <Calendar className="h-3 w-3" />
                Generated {new Date(digest.generatedAt).toLocaleString("en-GB")}
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-5">
            {digest.sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <span className="text-blue-600 dark:text-blue-400">{sectionIcons[section.title]}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                      {section.title}
                    </span>
                    <Badge variant="default" className="ml-auto text-[10px] px-1.5 py-0">
                      {section.items.length}
                    </Badge>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {section.items.map((item) => (
                      <div key={item.id} className="data-row group">
                        <span className="mr-2 text-gray-400 shrink-0">{typeIcons[item.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[11px] font-medium text-gray-900 dark:text-gray-100">
                            {item.lpaName} — {item.title}
                          </p>
                          <p className="truncate text-[10px] text-gray-500">{item.summary}</p>
                        </div>
                        <div className="mx-2 shrink-0">
                          <Badge variant={impactVariant(item.impact)} className="text-[10px] px-1.5 py-0 uppercase">
                            {item.impact}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{item.date}</span>
                        <ArrowUpRight className="ml-2 h-3 w-3 shrink-0 text-gray-400 opacity-0 group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dispatch status */}
          <Card className="mt-5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Notifications</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Digest dispatched to 3 simulated users via in-app and mock email channels.
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">No Digest Available</h3>
          <p className="text-xs text-gray-400 mb-4 max-w-sm">
            Generate the first weekly intelligence digest to see consolidated planning changes, opportunities, and alerts.
          </p>
          <Button size="sm" onClick={generateDigest} disabled={generating}>
            {generating ? "Generating..." : "Generate First Digest"}
          </Button>
        </div>
      )}
    </div>
  );
}