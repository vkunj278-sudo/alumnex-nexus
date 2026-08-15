import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, CalendarClock, Sparkles, Target, UserCheck } from "lucide-react";

import { AppShell } from "@/components/navigation/AppShell";
import { AlumniMatchCard } from "@/components/alumni/AlumniMatchCard";
import { AskAlumnexButton } from "@/components/ai/AskAlumnexButton";
import { CardSkeletonRow, EmptyState, PanelCard, StatCard } from "@/components/dashboard/primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveProfile, useAlumniDirectory, useProfileSkills } from "@/hooks/useAlumnex";
import { rankAlumni } from "@/services/matching";
import { GuestGate } from "@/components/navigation/GuestGate";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — ALUMNEX" },
      {
        name: "description",
        content: "Your mentor matches, recommended opportunities and mentorship sessions in one place.",
      },
      { property: "og:title", content: "Student Dashboard — ALUMNEX" },
      { property: "og:description", content: "Mentor matches, opportunities and sessions for students." },
    ],
  }),
  ssr: false,
  component: StudentDashboard,
});

function StudentDashboard() {
  const { profile, isDemo, loading } = useActiveProfile();
  const { data: mySkills = [] } = useProfileSkills(profile?.id);
  const { data: alumni, isLoading: alumniLoading } = useAlumniDirectory();

  if (!loading && !profile) return <GuestGate role="student" />;

  const ranked = alumni
    ? rankAlumni(
        {
          careerGoal: profile?.career_goal ?? null,
          skills: mySkills,
          location: profile?.location ?? null,
          availability: null,
        },
        alumni.map((a) => ({
          id: a.id,
          fullName: a.full_name,
          designation: a.designation,
          companyName: a.company_name,
          industryName: a.industryName,
          location: a.location,
          yearsExperience: a.years_experience,
          availability: a.availability,
          availableToMentor: a.available_to_mentor,
          mentorshipFocus: a.mentorship_focus,
          skills: a.skills,
          engagementScore: a.engagement_score,
          studentsHelped: a.students_helped,
        })),
      ).slice(0, 5)
    : [];

  const topMatch = ranked[0]?.match.matchScore ?? 0;
  const recommendedOpportunities = ranked.length ? Math.max(4, Math.round(topMatch / 8)) : 0;

  return (
    <AppShell
      role="student"
      profile={profile}
      isDemo={isDemo}
      activeLabel="Dashboard"
      title={`Welcome back, ${profile?.full_name?.split(" ")[0] ?? "student"}`}
      subtitle="Your network, scored and explained"
    >
      {loading ? (
        <CardSkeletonRow />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Profile completion"
            value={`${profile?.profile_completion ?? 0}%`}
            hint="Higher completion improves match quality"
            icon={UserCheck}
            progress={profile?.profile_completion ?? 0}
          />
          <StatCard
            label="Career goal"
            value={profile?.career_goal ?? "Not set"}
            hint={profile?.department ?? undefined}
            icon={Target}
          />
          <StatCard label="Top mentor match" value={`${topMatch}%`} hint="Scored across 7 signals" icon={Sparkles} tone="ai" />
          <StatCard
            label="Recommended roles"
            value={recommendedOpportunities}
            hint="Openings posted by alumni"
            icon={Briefcase}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <PanelCard title="Recommended mentors" className="lg:col-span-2">
          {alumniLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
              ))}
            </div>
          ) : ranked.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No mentor matches yet"
              description="Add your skills and career goal so the matching engine has something to work with."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {ranked.map(({ candidate, match }) => {
                const source = alumni?.find((a) => a.id === candidate.id);
                return (
                  <AlumniMatchCard
                    key={candidate.id}
                    name={candidate.fullName}
                    avatarUrl={source?.avatar_url}
                    designation={candidate.designation}
                    companyName={candidate.companyName}
                    location={candidate.location}
                    verified={source?.is_verified}
                    skills={candidate.skills}
                    match={match}
                  />
                );
              })}
            </div>
          )}
        </PanelCard>

        <PanelCard title="Upcoming mentorship session">
          <EmptyState
            icon={CalendarClock}
            title="No session scheduled"
            description="Once an alumnus accepts your mentorship request, your next session appears here with the agreed agenda."
          />
        </PanelCard>
      </div>

      <AskAlumnexButton />
    </AppShell>
  );
}
