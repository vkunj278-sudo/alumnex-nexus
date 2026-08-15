import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Building2, GraduationCap, Users } from "lucide-react";

import { AppShell } from "@/components/navigation/AppShell";
import { GuestGate } from "@/components/navigation/GuestGate";
import { CardSkeletonRow, EmptyState, PanelCard, StatCard } from "@/components/dashboard/primitives";
import { useActiveProfile, useAdminStats } from "@/hooks/useAlumnex";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ALUMNEX" },
      { name: "description", content: "Institution-wide view of alumni, students, verification and engagement." },
      { property: "og:title", content: "Admin Dashboard — ALUMNEX" },
      { property: "og:description", content: "Institution-wide alumni, student and engagement analytics." },
    ],
  }),
  ssr: false,
  component: AdminDashboard,
});

function AdminDashboard() {
  const { profile, isDemo, loading } = useActiveProfile();
  const { data: stats, isLoading } = useAdminStats();
  if (!loading && !profile) return <GuestGate role="admin" />;

  return (
    <AppShell
      role="admin"
      profile={profile}
      isDemo={isDemo}
      activeLabel="Dashboard"
      title="Institution overview"
      subtitle="Network health, verification and engagement"
    >
      {isLoading ? (
        <CardSkeletonRow />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Alumni" value={stats?.alumni ?? 0} hint="Registered graduates" icon={Users} />
          <StatCard label="Students" value={stats?.students ?? 0} hint="Active on the platform" icon={GraduationCap} />
          <StatCard label="Companies" value={stats?.companies ?? 0} hint="Represented by alumni" icon={Building2} />
          <StatCard
            label="Verified alumni"
            value={`${stats?.verifiedPct ?? 0}%`}
            hint="Credential-checked profiles"
            icon={BarChart3}
            tone="ai"
            progress={stats?.verifiedPct ?? 0}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PanelCard title="Engagement trend">
          <EmptyState
            icon={BarChart3}
            title="Charts arrive with the analytics module"
            description="Engagement scores are already computed per alumnus and ready to aggregate."
          />
        </PanelCard>
        <PanelCard title="Verification queue">
          <EmptyState
            icon={Users}
            title="No profiles awaiting review"
            description="New alumni registrations land here for credential verification."
          />
        </PanelCard>
      </div>
    </AppShell>
  );
}
