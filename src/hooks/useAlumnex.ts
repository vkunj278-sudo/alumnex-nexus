import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, Role } from "@/lib/alumnex";

const DEMO_KEY = "alumnex.demo-role";
const DEMO_EVENT = "alumnex-demo-change";

export function getDemoRole(): Role | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(DEMO_KEY);
  return v === "student" || v === "alumni" || v === "admin" ? v : null;
}

export function setDemoRole(role: Role | null) {
  if (typeof window === "undefined") return;
  if (role) window.localStorage.setItem(DEMO_KEY, role);
  else window.localStorage.removeItem(DEMO_KEY);
  window.dispatchEvent(new Event(DEMO_EVENT));
}

export function useDemoRole() {
  const [role, setRole] = useState<Role | null>(null);
  useEffect(() => {
    const sync = () => setRole(getDemoRole());
    sync();
    window.addEventListener(DEMO_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(DEMO_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return role;
}

export function useSession() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUserId(data.session?.user.id ?? null);
      setEmail(data.session?.user.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      setEmail(session?.user.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { userId, email, loading };
}

/**
 * The profile every dashboard renders against: the signed-in user's profile,
 * or — in Demo Mode — a representative seeded profile for the chosen role.
 */
export function useActiveProfile() {
  const { userId, loading: sessionLoading } = useSession();
  const demoRole = useDemoRole();

  const query = useQuery({
    queryKey: ["active-profile", userId, demoRole],
    enabled: !sessionLoading,
    queryFn: async (): Promise<{ profile: Profile | null; isDemo: boolean }> => {
      if (userId) {
        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
        if (error) throw error;
        if (data) return { profile: data as Profile, isDemo: false };
      }
      if (demoRole) {
        if (demoRole === "admin") {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "alumni")
            .order("engagement_score", { ascending: false })
            .limit(1)
            .maybeSingle();
          return {
            profile: data ? ({ ...(data as Profile), role: "admin", full_name: "Demo Administrator" } as Profile) : null,
            isDemo: true,
          };
        }
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", demoRole)
          .order("profile_completion", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        return { profile: (data as Profile) ?? null, isDemo: true };
      }
      return { profile: null, isDemo: false };
    },
  });

  const refresh = useCallback(() => query.refetch(), [query]);

  return {
    profile: query.data?.profile ?? null,
    isDemo: query.data?.isDemo ?? false,
    isSignedIn: !!userId,
    loading: sessionLoading || query.isLoading,
    refresh,
  };
}

export function useProfileSkills(profileId?: string | null) {
  return useQuery({
    queryKey: ["profile-skills", profileId],
    enabled: !!profileId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_skills")
        .select("skill_id, skills(name)")
        .eq("profile_id", profileId!);
      if (error) throw error;
      return (data ?? []).map((r) => (r.skills as { name: string } | null)?.name).filter(Boolean) as string[];
    },
  });
}

export type AlumniWithSkills = Profile & { skills: string[]; industryName: string | null };

export function useAlumniDirectory() {
  return useQuery({
    queryKey: ["alumni-directory"],
    queryFn: async (): Promise<AlumniWithSkills[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, industries(name), profile_skills(skills(name))")
        .eq("role", "alumni")
        .order("engagement_score", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row) => {
        const r = row as unknown as Profile & {
          industries: { name: string } | null;
          profile_skills: Array<{ skills: { name: string } | null }>;
        };
        return {
          ...(r as Profile),
          industryName: r.industries?.name ?? null,
          skills: (r.profile_skills ?? []).map((s) => s.skills?.name).filter(Boolean) as string[],
        };
      });
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [alumni, students, companies, verified] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "alumni"),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("role", "alumni")
          .eq("is_verified", true),
      ]);
      const alumniCount = alumni.count ?? 0;
      return {
        alumni: alumniCount,
        students: students.count ?? 0,
        companies: companies.count ?? 0,
        verifiedPct: alumniCount ? Math.round(((verified.count ?? 0) / alumniCount) * 100) : 0,
      };
    },
  });
}
