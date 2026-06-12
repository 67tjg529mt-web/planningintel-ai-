// ============================================================
// PlanningIntel AI — Dashboard Layout
// Bloomberg Terminal-inspired high-density sidebar
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { useTheme } from "@/components/theme-provider";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Lightbulb,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Globe,
  Scale,
  Sun,
  Moon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Local Plans",
    href: "/dashboard/local-plans",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "Call for Sites",
    href: "/dashboard/call-for-sites",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    label: "Opportunities",
    href: "/dashboard/opportunities",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    label: "Appeals",
    href: "/dashboard/appeals",
    icon: <Scale className="h-4 w-4" />,
    badge: 3,
  },
  {
    label: "Alerts",
    href: "/dashboard/alerts",
    icon: <Bell className="h-4 w-4" />,
    badge: 3,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: "LPAs",
    href: "/dashboard/lpas",
    icon: <Globe className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar — Bloomberg Terminal style */}
      <aside
        className={cn(
          "flex flex-col border-r transition-all duration-150",
          "bg-gray-900 text-gray-300 border-gray-800",
          collapsed ? "w-[52px]" : "w-56"
        )}
      >
        {/* Logo — terminal-style header */}
        <div className={cn(
          "flex h-10 items-center border-b border-gray-800",
          collapsed ? "justify-center px-2" : "justify-between px-3"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600">
                <span className="text-[9px] font-bold text-white">PI</span>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-100">
                PlanningIntel
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600">
              <span className="text-[9px] font-bold text-white">PI</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </div>

        {/* Navigation — dense terminal nav */}
        <nav className="flex-1 space-y-[1px] px-1.5 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-[11px] font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
                  collapsed && "justify-center px-1"
                )}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded bg-blue-600 px-1 text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section — theme toggle + user */}
        <div className="border-t border-gray-800 p-2">
          {!collapsed ? (
            <div className="space-y-2">
              <button
                onClick={toggleTheme}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-[8px] font-semibold text-gray-300">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[10px] font-medium text-gray-300">John D.</p>
                  <p className="text-[9px] text-gray-500">Pro Plan</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={toggleTheme}
                className="rounded-sm p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-[8px] font-semibold text-gray-300">
                JD
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}