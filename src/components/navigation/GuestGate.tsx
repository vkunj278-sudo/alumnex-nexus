import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setDemoRole } from "@/hooks/useAlumnex";
import type { Role } from "@/lib/alumnex";
import { ROLE_LABEL } from "./nav-config";

/** Shown when nobody is signed in and demo mode is off. */
export function GuestGate({ role }: { role: Role }) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="surface-panel max-w-md p-8 text-center">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-ai text-ai-foreground">
          <Sparkles className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-xl font-semibold">
          Sign in to open the {ROLE_LABEL[role].toLowerCase()} workspace
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Or preview it instantly with demo mode — no registration, populated with the institution&apos;s demo network.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => setDemoRole(role)}>Preview in demo mode</Button>
          <Button asChild variant="outline">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
