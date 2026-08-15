import {
  LayoutDashboard,
  Users,
  Sparkles,
  Briefcase,
  HandHeart,
  Network,
  MessagesSquare,
  CalendarDays,
  UsersRound,
  Bot,
  UserRound,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  HeartHandshake,
  Settings,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/alumnex";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  /** Routes that exist today. Anything without a path is announced as upcoming. */
  to?: string;
};

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/student/dashboard" },
    { label: "Find Alumni", icon: Users },
    { label: "Find Mentor", icon: Sparkles },
    { label: "Opportunities", icon: Briefcase },
    { label: "Mentorship", icon: HandHeart },
    { label: "Career Graph", icon: Network },
    { label: "Communities", icon: UsersRound },
    { label: "Events", icon: CalendarDays },
    { label: "Messages", icon: MessagesSquare },
    { label: "AI Assistant", icon: Bot },
    { label: "Profile", icon: UserRound },
  ],
  alumni: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/alumni/dashboard" },
    { label: "My Profile", icon: UserRound },
    { label: "Mentorship", icon: HandHeart },
    { label: "Opportunities", icon: Briefcase },
    { label: "Communities", icon: UsersRound },
    { label: "Events", icon: CalendarDays },
    { label: "Messages", icon: MessagesSquare },
    { label: "Engagement", icon: TrendingUp },
    { label: "AI Assistant", icon: Bot },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
    { label: "Alumni", icon: GraduationCap },
    { label: "Students", icon: Users },
    { label: "Mentorship", icon: HandHeart },
    { label: "Opportunities", icon: Briefcase },
    { label: "Events", icon: CalendarDays },
    { label: "Communities", icon: UsersRound },
    { label: "Analytics", icon: BarChart3 },
    { label: "Impact", icon: TrendingUp },
    { label: "Verification", icon: ShieldCheck },
    { label: "Donations", icon: HeartHandshake },
    { label: "Settings", icon: Settings, to: "/settings" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  student: "Student",
  alumni: "Alumni",
  admin: "Administrator",
};
