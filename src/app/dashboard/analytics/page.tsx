// ============================================================
// PlanningIntel AI — Analytics Page
// ============================================================

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Trends and insights across your monitored LPAs</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Globe, label: "LPAs with Changes", value: "23", change: "+12%", color: "text-blue-600" },
          { icon: TrendingUp, label: "Opportunities Found", value: "145", change: "+18%", color: "text-green-600" },
          { icon: BarChart3, label: "Avg. Response Time", value: "2.4hrs", change: "-32%", color: "text-purple-600" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-gray-800">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className={`text-xs font-medium ${stat.color}`}>{stat.change} vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Opportunities by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: "London", count: 33, pct: 100 },
                { region: "South East", count: 28, pct: 85 },
                { region: "North West", count: 22, pct: 67 },
                { region: "West Midlands", count: 18, pct: 55 },
                { region: "East of England", count: 20, pct: 61 },
              ].map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="w-28 text-xs">{r.region}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full dark:bg-gray-800">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="text-xs font-medium">{r.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Detection Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Local Plan Updates", count: 67, trend: "+15%" },
                { label: "Call for Sites", count: 23, trend: "+8%" },
                { label: "Policy Changes", count: 45, trend: "+22%" },
                { label: "Consultations", count: 34, trend: "+11%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <span className="text-xs text-green-600">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}