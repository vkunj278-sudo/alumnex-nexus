import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { BarChart3, Briefcase, GraduationCap, HeartHandshake, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setDemoRole } from "@/hooks/useAlumnex";
import { dashboardPath, type Role } from "@/lib/alumnex";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ALUMNEX — AI alumni intelligence for universities" },
      {
        name: "description",
        content:
          "ALUMNEX turns your alumni database into a living network: AI mentor matching, referrals, events and engagement analytics.",
      },
      { property: "og:title", content: "ALUMNEX — AI alumni intelligence for universities" },
      {
        property: "og:description",
        content: "AI mentor matching, referrals, events and engagement analytics for university alumni networks.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Sparkles, title: "Explainable AI matching", desc: "Every mentor suggestion is scored across skills, goals, industry and availability — and shows its reasoning." },
  { icon: HeartHandshake, title: "Mentorship that completes", desc: "Structured requests, agreed goals and session tracking instead of cold outreach." },
  { icon: Briefcase, title: "Alumni-posted opportunities", desc: "Referrals, internships and roles surfaced to the students who actually fit them." },
  { icon: Users, title: "Verified alumni graph", desc: "Education, employment and company data kept current and credential-checked." },
  { icon: BarChart3, title: "Engagement analytics", desc: "See which cohorts give back, who is drifting away, and where to intervene." },
  { icon: GraduationCap, title: "Built for institutions", desc: "Role-aware workspaces for students, alumni and administrators from day one." },
];

function Landing() {
  const router = useRouter();
  const startDemo = (role: Role) => {
    setDemoRole(role);
    router.navigate({ to: dashboardPath(role) });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold">ALUMNEX</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ai/30 bg-ai-soft px-3 py-1 text-xs font-medium text-foreground">
            <Sparkles className="size-3 text-ai" /> AI alumni intelligence
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Your alumni database is a <span className="text-gradient-brand">network waiting to happen</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            ALUMNEX connects students to the right graduates with explainable AI matching, then keeps the relationship
            alive through mentorship, referrals, events and giving.
          </p>
          <p className="mt-8 text-sm font-medium text-muted-foreground">Explore the live demo instantly</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {(["student", "alumni", "admin"] as Role[]).map((r) => (
              <Button key={r} onClick={() => startDemo(r)} variant={r === "student" ? "default" : "outline"} className="capitalize">
                Demo as {r}
              </Button>
            ))}
          </div>
        </section>

        <section className="border-t border-border bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-3xl font-semibold">One platform, three workspaces</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title} className="shadow-card">
                  <CardContent className="p-6">
                    <span className="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                      <f.icon className="size-4" />
                    </span>
                    <h3 className="mt-4 font-medium">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          ALUMNEX — Connect. Mentor. Grow. Give Back.
        </div>
      </footer>
    </div>
  );
}
