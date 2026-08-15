import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — ALUMNEX" },
      { name: "description", content: "Manage your ALUMNEX account, privacy defaults and notification preferences." },
      { property: "og:title", content: "Settings — ALUMNEX" },
      { property: "og:description", content: "Manage your ALUMNEX account, privacy and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link to="/">
          <ArrowLeft className="mr-1 size-4" /> Back
        </Link>
      </Button>
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Account, privacy and notification controls for your ALUMNEX workspace.
      </p>

      <div className="mt-6 space-y-4">
        {[
          {
            title: "Privacy",
            desc: "Contact details are private by default. Visibility and contact permissions are captured during onboarding and editable from your profile.",
          },
          {
            title: "Notifications",
            desc: "Mentorship requests, opportunity matches and event reminders. Channel preferences arrive with the messaging build stage.",
          },
          {
            title: "Account",
            desc: "Email, password and connected sign-in methods are managed through your institution's ALUMNEX account.",
          },
        ].map((s) => (
          <Card key={s.title} className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Detailed controls unlock as each module ships.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
