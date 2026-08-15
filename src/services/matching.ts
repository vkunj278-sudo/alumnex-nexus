/**
 * ALUMNEX matching service.
 *
 * score = 0.30·skill + 0.20·career + 0.15·industry + 0.10·experience
 *       + 0.10·location + 0.10·availability + 0.05·engagement
 *
 * This is the deterministic, explainable v1. A future embeddings-based
 * implementation can replace `scoreAlumni` as long as it keeps returning
 * a `MatchResult` — the UI contract does not change.
 */

export type MatchCriteria = {
  careerGoal?: string | null;
  skills: string[];
  helpNeeded?: string[];
  location?: string | null;
  availability?: string | null;
  industry?: string | null;
};

export type MatchCandidate = {
  id: string;
  fullName: string;
  designation?: string | null;
  companyName?: string | null;
  industryName?: string | null;
  location?: string | null;
  yearsExperience?: number | null;
  availability?: string | null;
  availableToMentor?: boolean | null;
  mentorshipFocus?: string[] | null;
  skills: string[];
  engagementScore?: number | null;
  studentsHelped?: number | null;
};

export type MatchResult = {
  matchScore: number;
  skillScore: number;
  careerScore: number;
  industryScore: number;
  experienceScore: number;
  locationScore: number;
  availabilityScore: number;
  engagementScore: number;
  explanation: string[];
};

const WEIGHTS = {
  skill: 0.3,
  career: 0.2,
  industry: 0.15,
  experience: 0.1,
  location: 0.1,
  availability: 0.1,
  engagement: 0.05,
};

const CAREER_KEYWORDS: Record<string, string[]> = {
  "Software Engineer": ["software", "engineer", "developer", "backend", "frontend", "full stack"],
  "AI Engineer": ["ai", "machine learning", "ml", "research", "data scientist"],
  "Data Scientist": ["data", "scientist", "analyst", "machine learning"],
  "Product Manager": ["product", "manager", "analyst"],
  Entrepreneur: ["founder", "manager", "lead", "director"],
  Cybersecurity: ["security", "cyber"],
  "Cloud Engineer": ["cloud", "devops", "architect", "infrastructure"],
};

const pct = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const norm = (s: string) => s.trim().toLowerCase();

function skillOverlap(wanted: string[], have: string[]) {
  if (wanted.length === 0) return { score: 50, shared: [] as string[] };
  const haveSet = new Set(have.map(norm));
  const shared = wanted.filter((s) => haveSet.has(norm(s)));
  return { score: (shared.length / wanted.length) * 100, shared };
}

export function scoreAlumni(criteria: MatchCriteria, candidate: MatchCandidate): MatchResult {
  const explanation: string[] = [];

  const { score: skillScoreRaw, shared } = skillOverlap(criteria.skills, candidate.skills);
  const skillScore = pct(skillScoreRaw);
  if (shared.length) explanation.push(`Shares ${shared.length} of your skills: ${shared.slice(0, 3).join(", ")}`);

  const goal = criteria.careerGoal ?? "";
  const haystack = norm(`${candidate.designation ?? ""} ${candidate.industryName ?? ""} ${(candidate.mentorshipFocus ?? []).join(" ")}`);
  const keywords = CAREER_KEYWORDS[goal] ?? (goal ? [norm(goal)] : []);
  const careerHits = keywords.filter((k) => haystack.includes(k)).length;
  const careerScore = goal ? pct(keywords.length ? (careerHits / keywords.length) * 140 : 40) : 50;
  if (goal && careerHits > 0) explanation.push(`Working in the same career direction as "${goal}"`);

  const industryScore = criteria.industry
    ? norm(criteria.industry) === norm(candidate.industryName ?? "")
      ? 100
      : 35
    : candidate.industryName
      ? 60
      : 40;
  if (criteria.industry && industryScore === 100) explanation.push(`Same industry: ${candidate.industryName}`);

  const yrs = candidate.yearsExperience ?? 0;
  const experienceScore = pct(yrs <= 1 ? 30 : yrs <= 3 ? 60 : yrs <= 8 ? 95 : 80);
  if (yrs >= 4) explanation.push(`${yrs} years of industry experience to draw on`);

  const locationScore = criteria.location
    ? norm(criteria.location) === norm(candidate.location ?? "")
      ? 100
      : norm(candidate.location ?? "") === "remote"
        ? 75
        : 40
    : 60;
  if (criteria.location && locationScore === 100) explanation.push(`Based in ${candidate.location}`);

  let availabilityScore = candidate.availableToMentor ? 70 : 20;
  if (candidate.availableToMentor && criteria.availability) {
    if (candidate.availability === "flexible" || candidate.availability === criteria.availability) {
      availabilityScore = 100;
      explanation.push(`Available on ${candidate.availability}`);
    } else {
      availabilityScore = 50;
    }
  } else if (candidate.availableToMentor) {
    explanation.push("Currently open to mentoring students");
  }

  const engagementScore = pct(candidate.engagementScore ?? 0);
  if ((candidate.studentsHelped ?? 0) > 0)
    explanation.push(`Previously mentored ${candidate.studentsHelped} students`);

  const helpFocus = criteria.helpNeeded ?? [];
  const focusHit = helpFocus.filter((h) =>
    (candidate.mentorshipFocus ?? []).some((f) => norm(f).includes(norm(h)) || norm(h).includes(norm(f))),
  );
  if (focusHit.length) explanation.push(`Mentors on ${focusHit.join(", ")}`);

  const matchScore = pct(
    skillScore * WEIGHTS.skill +
      careerScore * WEIGHTS.career +
      industryScore * WEIGHTS.industry +
      experienceScore * WEIGHTS.experience +
      locationScore * WEIGHTS.location +
      availabilityScore * WEIGHTS.availability +
      engagementScore * WEIGHTS.engagement,
  );

  if (explanation.length === 0) explanation.push("Part of your institution's verified alumni network");

  return {
    matchScore,
    skillScore,
    careerScore,
    industryScore,
    experienceScore,
    locationScore,
    availabilityScore,
    engagementScore,
    explanation,
  };
}

export function rankAlumni(criteria: MatchCriteria, candidates: MatchCandidate[]) {
  return candidates
    .map((candidate) => ({ candidate, match: scoreAlumni(criteria, candidate) }))
    .sort((a, b) => b.match.matchScore - a.match.matchScore);
}
