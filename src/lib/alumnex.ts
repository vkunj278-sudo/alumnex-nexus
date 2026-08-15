import type { Database } from "@/integrations/supabase/types";

export type Role = "student" | "alumni" | "admin";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Opportunity = Database["public"]["Tables"]["opportunities"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];

export const CAREER_GOALS = [
  "Software Engineer",
  "AI Engineer",
  "Data Scientist",
  "Product Manager",
  "Entrepreneur",
  "Cybersecurity",
  "Cloud Engineer",
  "Other",
] as const;

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Civil",
  "Data Science",
  "Other",
] as const;

export const LOOKING_FOR = [
  "mentorship",
  "jobs",
  "internships",
  "networking",
  "events",
] as const;

export const MENTORSHIP_FOCUS = [
  "Career guidance",
  "Technical interviews",
  "AI/ML",
  "Resume review",
  "System design",
  "Higher studies",
  "Entrepreneurship",
  "Product thinking",
] as const;

export const AVAILABILITY = ["weekdays", "weekends", "flexible"] as const;

export const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public — anyone can view" },
  { value: "students_only", label: "Students only" },
  { value: "alumni_only", label: "Alumni only" },
  { value: "institution_only", label: "Institution only" },
] as const;

export const COMMON_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Java",
  "SQL",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Data Analysis",
  "AWS",
  "Azure",
  "Kubernetes",
  "Docker",
  "System Design",
  "DSA",
  "Product Management",
  "UX Research",
  "Figma",
  "Cybersecurity",
  "Networking",
  "Leadership",
  "Public Speaking",
];

export const DEMO_PASSWORD = "alumnex2026";
export const DEMO_ACCOUNTS = [
  { email: "student@alumnex.demo", role: "student" as Role, label: "Student" },
  { email: "alumni@alumnex.demo", role: "alumni" as Role, label: "Alumni" },
  { email: "admin@alumnex.demo", role: "admin" as Role, label: "Admin" },
];

export function dashboardPath(role: Role) {
  return `/${role}/dashboard`;
}

/** Profile completion is derived from what the user actually filled in. */
export function computeCompletion(p: Partial<Profile>, skillCount: number): number {
  const shared: Array<boolean> = [
    !!p.full_name,
    !!p.department,
    !!p.graduation_year,
    !!p.location,
    skillCount > 0,
    skillCount >= 3,
    !!p.headline,
    !!p.bio,
  ];
  const roleSpecific: Array<boolean> =
    p.role === "alumni"
      ? [
          !!p.company_name,
          !!p.designation,
          !!p.industry_id,
          p.years_experience != null,
          !!p.available_to_mentor,
          (p.mentorship_focus?.length ?? 0) > 0,
          !!p.availability,
        ]
      : [!!p.career_goal, (p.looking_for?.length ?? 0) > 0, !!p.location];

  const all = [...shared, ...roleSpecific];
  return Math.round((all.filter(Boolean).length / all.length) * 100);
}

export function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A"
  );
}
