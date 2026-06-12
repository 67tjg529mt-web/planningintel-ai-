// ============================================================
// PlanningIntel AI — Dashboard Data Hook
// Fetches from Supabase with graceful fallback to mock data
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ============================================================
// MOCK DATA (fallback when Supabase is not configured)
// ============================================================

export const MOCK_APPEALS = [
  { id: "1", caseRef: "APP/K2420/W/25/3345678", lpa: "Leeds City Council", siteAddress: "Land off Kirkstall Road, Leeds, LS4 2AB", description: "Appeal against refusal of 48 residential dwellings", status: "allowed", decisionDate: "2026-05-28", aiSummary: "Appeal allowed on grounds of housing land supply shortfall." },
  { id: "2", caseRef: "APP/B4560/W/25/3390123", lpa: "Birmingham City Council", siteAddress: "123 Bordesley Green, Birmingham, B9 5NA", description: "Change of use from office (E) to residential (C3)", status: "dismissed", decisionDate: "2026-06-02", aiSummary: "Dismissed due to loss of employment land." },
  { id: "3", caseRef: "APP/C3456/W/25/3412345", lpa: "Cornwall Council", siteAddress: "Trevarthian Farm, St Austell, PL25 4EJ", description: "Appeal against enforcement notice", status: "pending", decisionDate: null, aiSummary: "Hearing listed for July 2026." },
  { id: "4", caseRef: "APP/D1234/W/25/3423456", lpa: "Cambridgeshire County Council", siteAddress: "Cambridge Science Park, CB4 0WN", description: "Appeal against refusal of 12,000sqm office/lab space", status: "allowed", decisionDate: "2026-05-15", aiSummary: "Economic benefits outweighed landscape harm." },
  { id: "5", caseRef: "APP/E5678/W/25/3434567", lpa: "Essex County Council", siteAddress: "Land adj. A127, Basildon, SS15 6QE", description: "Appeal against refusal of 150-bed hotel", status: "dismissed", decisionDate: "2026-04-20", aiSummary: "Green Belt conflict. Very special circumstances not demonstrated." },
  { id: "6", caseRef: "APP/F9012/W/25/3445678", lpa: "Greater Manchester CA", siteAddress: "Salford Quays, M50 3SN", description: "32-storey residential tower (286 units)", status: "pending", decisionDate: null, aiSummary: "Inquiry scheduled for September 2026." },
];

export const MOCK_OPPORTUNITIES = [
  { id: "1", title: "Birmingham — Residential Land Call for Sites", lpa: "Birmingham City Council", type: "call_for_sites", impact: "high", score: 92, deadline: "2026-08-15", summary: "High-value residential sites sought. Green Belt review sites prioritised." },
  { id: "2", title: "Greater Manchester — Employment Land Policy Shift", lpa: "Greater Manchester CA", type: "policy_change", impact: "high", score: 85, deadline: "2026-07-30", summary: "Reg. 19 modifications signal increased employment land demand." },
  { id: "3", title: "Leeds — New Site Allocations", lpa: "Leeds City Council", type: "site_allocation", impact: "medium", score: 78, deadline: "2026-08-28", summary: "15 additional sites proposed for allocation." },
  { id: "4", title: "Cornwall — Renewable Energy Sites", lpa: "Cornwall Council", type: "call_for_sites", impact: "medium", score: 74, deadline: "2026-09-01", summary: "Growing demand for solar/wind energy sites." },
  { id: "5", title: "Cambs — Transport Infrastructure", lpa: "Cambridgeshire County Council", type: "call_for_sites", impact: "low", score: 65, deadline: "2026-10-15", summary: "Upcoming transport infrastructure submissions." },
  { id: "6", title: "Essex — Minerals Safeguarding", lpa: "Essex County Council", type: "policy_change", impact: "low", score: 42, deadline: "2026-12-01", summary: "Minor amendments to Minerals Local Plan." },
];

export const MOCK_SITES = [
  { id: "1", lpa: "Birmingham City Council", title: "Development Plan — Call for Sites 2026", status: "open", openDate: "2026-06-01", closeDate: "2026-08-15", summary: "Residential allocations sought. Min 0.5ha." },
  { id: "2", lpa: "Leeds City Council", title: "Site Allocations Plan — Call for Sites", status: "open", openDate: "2026-05-15", closeDate: "2026-08-28", summary: "15 additional sites sought." },
  { id: "3", lpa: "Cornwall Council", title: "Climate Emergency DPD — Call for Sites", status: "open", openDate: "2026-06-10", closeDate: "2026-09-01", summary: "Renewable energy & BNG sites." },
  { id: "4", lpa: "Cambs County Council", title: "Transport Plan — Call for Sites", status: "upcoming", openDate: "2026-08-01", closeDate: "2026-10-15", summary: "Transport infrastructure." },
  { id: "5", lpa: "Essex County Council", title: "Minerals Plan — Site Submissions", status: "closed", openDate: "2026-01-15", closeDate: "2026-03-30", summary: "Mineral extraction sites." },
  { id: "6", lpa: "Bristol City Council", title: "Local Plan Review — Call for Sites", status: "open", openDate: "2026-06-15", closeDate: "2026-09-30", summary: "All development types." },
];

export const MOCK_PLANS = [
  { id: "1", lpa: "Birmingham City Council", title: "Birmingham Development Plan 2031", stage: "adopted", lastUpdated: "2026-05-15", nextReview: "2028-03-01", summary: "Adopted. Housing target 89,000." },
  { id: "2", lpa: "Greater Manchester CA", title: "Places for Everyone", stage: "regulation_19", lastUpdated: "2026-06-10", nextReview: null, summary: "Reg. 19 stage. Employment modifications." },
  { id: "3", lpa: "Cornwall Council", title: "Local Plan Strategic Policies", stage: "review", lastUpdated: "2026-06-01", nextReview: "2026-09-01", summary: "Partial review underway." },
  { id: "4", lpa: "Leeds City Council", title: "Leeds Core Strategy", stage: "regulation_18", lastUpdated: "2026-06-08", nextReview: null, summary: "Reg. 18 consultation open." },
  { id: "5", lpa: "Essex County Council", title: "Essex Minerals Local Plan", stage: "adopted", lastUpdated: "2026-04-20", nextReview: "2027-06-01", summary: "Adopted minerals plan." },
  { id: "6", lpa: "Cambs County Council", title: "Local Transport & Connectivity Plan", stage: "regulation_19", lastUpdated: "2026-06-12", nextReview: null, summary: "New transport corridors proposed." },
];

// ============================================================
// GENERIC DATA FETCHER with Supabase + mock fallback
// ============================================================

async function fetchFromSupabaseOrMock<T>(
  tableName: string,
  mockData: T[],
  query?: (client: ReturnType<typeof createClient>) => Promise<{ data: T[] | null; error: any }>
): Promise<T[]> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co") {
      return mockData;
    }

    const supabase = createClient();
    if (query) {
      const { data, error } = await query(supabase);
      if (error) throw error;
      if (data && data.length > 0) return data;
    } else {
      const { data, error } = await supabase.from(tableName).select("*");
      if (error) throw error;
      if (data && data.length > 0) return data;
    }

    return mockData;
  } catch {
    return mockData;
  }
}

// ============================================================
// HOOKS
// ============================================================

export function useAppealsData() {
  const [data, setData] = useState<typeof MOCK_APPEALS>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchFromSupabaseOrMock("appeals", MOCK_APPEALS);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useOpportunitiesData() {
  const [data, setData] = useState<typeof MOCK_OPPORTUNITIES>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchFromSupabaseOrMock("planning_opportunities", MOCK_OPPORTUNITIES);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useCallForSitesData() {
  const [data, setData] = useState<typeof MOCK_SITES>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchFromSupabaseOrMock("call_for_sites", MOCK_SITES);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useLocalPlansData() {
  const [data, setData] = useState<typeof MOCK_PLANS>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await fetchFromSupabaseOrMock("local_plans", MOCK_PLANS);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, refresh };
}

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalLpas: 156,
    activeCallForSites: 4,
    newOpportunities: 8,
    unreadAlerts: 3,
    pendingAppeals: 2,
  });

  useEffect(() => {
    const load = async () => {
      try {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co") {
          const supabase = createClient();
          const [{ count: lpas }, { count: sites }, { count: opps }] = await Promise.all([
            supabase.from("local_plans").select("*", { count: "exact", head: true }),
            supabase.from("call_for_sites").select("*", { count: "exact", head: true }).eq("status", "open"),
            supabase.from("planning_opportunities").select("*", { count: "exact", head: true }).eq("status", "active"),
          ]);
          setStats({
            totalLpas: lpas || 156,
            activeCallForSites: sites || 4,
            newOpportunities: opps || 8,
            unreadAlerts: 3,
            pendingAppeals: 2,
          });
        }
      } catch {}
    };
    load();
  }, []);

  return stats;
}