import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { GraduationCap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPath, type Role } from "@/lib/alumnex";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your ALUMNEX account" },
      { name: "description", content: "Join your institution's alumni network as a student or alumnus." },
      { property: "og:title", content: "Create your ALUMNEX account" },
      { property: "og:description", content: "Join your institution's alumni network as a student or alumnus." },
    ],
  }),
  ssr: false,
  component: RegisterPage,
});

function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: fullName, role },
      },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    if (data.user && data.session) {
      await supabase.from("profiles").insert({ user_id: data.user.id, role, full_name: fullName });
      setBusy(false);
      toast.success("Account created — finish your profile to unlock matching.");
      router.navigate({ to: dashboardPath(role) });
      return;
    }
    setBusy(false);
    toast.success("Check your inbox to confirm your email, then sign in.");
    router.navigate({ to: "/login" });
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
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Administrator accounts are provisioned by the institution.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="grid grid-cols-2 gap-2">
                {(["student", "alumni"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-sm font-medium capitalize transition-colors",
                      role === r ? "border-ai bg-ai-soft text-foreground" : "border-border text-muted-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" />} Create account
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="font-medium text-ai hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
