import { Link, useRouter } from "@tanstack/react-router";
import { Bell, GraduationCap, LogOut, Menu, PanelLeftClose, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_BY_ROLE, ROLE_LABEL, type NavItem } from "./nav-config";
import { initials, type Profile, type Role } from "@/lib/alumnex";
import { setDemoRole } from "@/hooks/useAlumnex";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

function NavList({
  role,
  activeLabel,
  onNavigate,
}: {
  role: Role;
  activeLabel: string;
  onNavigate?: () => void;
}) {
  const items = NAV_BY_ROLE[role];
  const handleUpcoming = (item: NavItem) => {
    toast(`${item.label} is coming in the next build stage`, {
      description: "The foundation ships first: data model, onboarding and the three dashboards.",
    });
    onNavigate?.();
  };

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.label === activeLabel;
        const className = cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full text-left",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        );
        return item.to ? (
          <Link key={item.label} to={item.to} className={className} onClick={onNavigate}>
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        ) : (
          <button key={item.label} type="button" className={className} onClick={() => handleUpcoming(item)}>
            <Icon className="size-4 shrink-0" />
            {item.label}
            <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground/70">soon</span>
          </button>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2 px-4 py-4">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="size-4" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">ALUMNEX</span>
    </Link>
  );
}

export function AppShell({
  role,
  profile,
  activeLabel,
  isDemo,
  title,
  subtitle,
  children,
}: {
  role: Role;
  profile: Profile | null;
  activeLabel: string;
  isDemo: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const exitDemo = () => {
    setDemoRole(null);
    router.navigate({ to: "/" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setDemoRole(null);
    router.navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {!collapsed && (
          <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
            <BrandMark />
            <div className="px-4 pb-2">
              <Badge variant="secondary" className="w-full justify-center py-1">
                {ROLE_LABEL[role]} workspace
              </Badge>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavList role={role} activeLabel={activeLabel} />
            </div>
            <div className="border-t border-sidebar-border p-3 text-xs text-muted-foreground">
              Centralize → Verify → Match → Engage → Measure
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-8">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <BrandMark />
                  <NavList role={role} activeLabel={activeLabel} onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:inline-flex"
                aria-label="Toggle sidebar"
                onClick={() => setCollapsed((c) => !c)}
              >
                <PanelLeftClose className={cn("size-5 transition-transform", collapsed && "rotate-180")} />
              </Button>

              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
                {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {isDemo && (
                  <Badge className="hidden bg-ai text-ai-foreground sm:inline-flex">
                    <Sparkles className="mr-1 size-3" /> Demo Mode
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                      <Bell className="size-5" />
                      <span className="absolute right-2 top-2 size-2 rounded-full bg-ai" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="space-y-2 p-2 text-sm">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="font-medium">Your alumni network grew this week</p>
                        <p className="text-xs text-muted-foreground">
                          New verified profiles were added to the institution directory.
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="font-medium">AI matching is live</p>
                        <p className="text-xs text-muted-foreground">
                          Mentor recommendations now show a full score breakdown.
                        </p>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2">
                      <Avatar className="size-8">
                        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                        <AvatarFallback>{initials(profile?.full_name ?? "Alumnex")}</AvatarFallback>
                      </Avatar>
                      <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
                        {profile?.full_name ?? "Guest"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium">{profile?.full_name ?? "Guest"}</p>
                      <p className="text-xs text-muted-foreground">{ROLE_LABEL[role]}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    {isDemo ? (
                      <DropdownMenuItem onClick={exitDemo}>
                        <LogOut className="mr-2 size-4" /> Exit demo mode
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 size-4" /> Sign out
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 lg:px-8 lg:pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
