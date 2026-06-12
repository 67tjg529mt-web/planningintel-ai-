// ============================================================
// PlanningIntel AI — Alerts Page
// ============================================================

import { Bell, MapPin, FileText, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const alerts = [
  { id: "1", type: "new_call_for_sites", title: "New Call for Sites: Birmingham City Council", description: "Call for Sites now open for residential allocations. Deadline: 15 Aug 2026.", time: "2 hours ago", read: false },
  { id: "2", type: "plan_update", title: "Plan Update: Greater Manchester", description: "Regulation 19 modifications to Places for Everyone published.", time: "5 hours ago", read: false },
  { id: "3", type: "deadline_approaching", title: "Deadline Approaching: Cornwall Climate DPD", description: "Consultation closes in 7 days. Submit your response.", time: "1 day ago", read: false },
  { id: "4", type: "opportunity", title: "High Impact: Leeds Site Allocations", description: "15 new sites proposed for allocation. AI confidence: 78%.", time: "2 days ago", read: true },
  { id: "5", type: "new_call_for_sites", title: "New Call for Sites: Cambridgeshire", description: "Transport infrastructure Call for Sites opening 1 Aug 2026.", time: "3 days ago", read: true },
  { id: "6", type: "plan_update", title: "Plan Update: Essex Minerals Plan", description: "Minor amendments to safeguarding areas published.", time: "5 days ago", read: true },
];

const alertIcons: Record<string, React.ReactNode> = {
  new_call_for_sites: <MapPin className="h-4 w-4" />,
  plan_update: <FileText className="h-4 w-4" />,
  deadline_approaching: <Clock className="h-4 w-4" />,
  opportunity: <Lightbulb className="h-4 w-4" />,
};

const alertColors: Record<string, string> = {
  new_call_for_sites: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  plan_update: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  deadline_approaching: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  opportunity: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AlertsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Alerts</h1>
          <p className="mt-1 text-sm text-gray-500">Stay informed about planning changes and opportunities</p>
        </div>
        <Button variant="outline" size="sm">Mark all as read</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!alert.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${alertColors[alert.type]}`}>
                  {alertIcons[alert.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.title}</h3>
                    {!alert.read && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                  <p className="mt-1 text-xs text-gray-400">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}