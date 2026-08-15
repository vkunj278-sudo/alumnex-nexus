import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { setDemoRole } from "@/hooks/useAlumnex";
import { dashboardPath, type Role } from "@/lib/alumnex";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ALUMNEX" },
      { name: "description", content: "Sign in to your institution's alumni intelligence platform, or preview it in demo mode." },
      { property: "og:title", content: "Sign in — ALUMNEX" },
      { property: "og:description", content: "Sign in to ALUMNEX or preview the platform in demo mode." },
    ],
  }),
  ssr: false,
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();
    router.navigate({ to: dashboardPath((profile?.role as Role) ?? "student") });
  };

  const preview = (role: Role) => {
    setDemoRole(role);
    router.navigate({ to: dashboardPath(role) });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold">ALUMNEX</span>
        </Link>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Connect. Mentor. Grow. Give Back.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Sign in
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">
                Forgot password?
              </Link>
              <Link to="/register" className="font-medium text-ai hover:underline">
                Create an account
              </Link>
            </div>

            <div className="ai-panel mt-6 p-4">
              <p className="text-sm font-medium">Judging demo — no registration needed</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Open any workspace instantly against the seeded institution network.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["student", "alumni", "admin"] as Role[]).map((r) => (
                  <Button key={r} size="sm" variant="outline" onClick={() => preview(r)} className="capitalize">
                    {r}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
