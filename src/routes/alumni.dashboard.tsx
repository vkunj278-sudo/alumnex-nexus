import { createFileRoute } from "@tanstack/react-router";
import { Award, HeartHandshake, Sparkles, Users } from "lucide-react";

import { AppShell } from "@/components/navigation/AppShell";
import { AskAlumnexButton } from "@/components/ai/AskAlumnexButton";
import { GuestGate } from "@/components/navigation/GuestGate";
import { CardSkeletonRow, EmptyState, PanelCard, StatCard } from "@/components/dashboard/primitives";
import { useActiveProfile } from "@/hooks/useAlumnex";

export const Route = createFileRoute("/alumni/dashboard")({
  head: () => ({
    meta: [
      { title: "Alumni Dashboard — ALUMNEX" },
      { name: "description", content: "Track your mentees, impact score and the students who match your expertise." },
      { property: "og:title", content: "Alumni Dashboard — ALUMNEX" },
      { property: "og:description", content: "Mentees, impact score and student matches for alumni." },
    ],
  }),
  ssr: false,
  component: AlumniDashboard,
});

function AlumniDashboard() {
  const { profile, isDemo, loading } = useActiveProfile();
  if (!loading && !profile) return <GuestGate role="alumni" />;

  return (
    <AppShell
      role="alumni"
      profile={profile}
      isDemo={isDemo}
      activeLabel="Dashboard"
      title={`Welcome back, ${profile?.full_name?.split(" ")[0] ?? "alumnus"}`}
      subtitle="Your mentoring impact at a glance"
    >
      {loading ? (
        <CardSkeletonRow />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Students helped" value={profile?.students_helped ?? 0} icon={Users} />
          <StatCard
            label="Engagement score"
            value={profile?.engagement_score ?? 0}
            hint="Mentoring, referrals and events"
            icon={Award}
            progress={Math.min(100, profile?.engagement_score ?? 0)}
          />
          <StatCard
            label="Mentoring status"
            value={profile?.available_to_mentor ? "Open" : "Paused"}
            hint={profile?.availability ?? undefined}
            icon={HeartHandshake}
          />
          <StatCard
            label="Profile completion"
            value={`${profile?.profile_completion ?? 0}%`}
            icon={Sparkles}
            tone="ai"
            progress={profile?.profile_completion ?? 0}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PanelCard title="Pending mentorship requests">
          <EmptyState
            icon={HeartHandshake}
            title="No pending requests"
            description="Students matched to your expertise will appear here with their goal and why the engine matched you."
          />
        </PanelCard>
        <PanelCard title="Students who match your expertise">
          <EmptyState
            icon={Users}
            title="Matches load with the mentorship module"
            description="Your skills, industry and availability already feed the scoring engine powering student recommendations."
          />
        </PanelCard>
      </div>

      <AskAlumnexButton />
    </AppShell>
  );
}
