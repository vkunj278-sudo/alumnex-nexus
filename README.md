# Alumni Connect Hub

# ALUMNEX — Refined Lovable Build Prompt
### For SIH Problem Statement: "Digital Platform for Centralized Alumni Data Management and Engagement"

---

## How to use this document

Lovable builds best in **stages**, not one 60-section mega-prompt. Paste **PROMPT 1** first to get the foundation right (design system, auth, schema, landing page, 3 dashboards). Once that generates and looks right, paste the follow-up prompts **one at a time**, in order, in the same project. Each one assumes everything before it already exists — don't re-paste earlier prompts.

This keeps every generation focused enough that Lovable actually finishes it, instead of half-building 15 screens at once.

---

## PROMPT 1 — Foundation (paste first)

Build a web application called **ALUMNEX** — an AI-powered alumni intelligence and engagement platform for universities, built for Smart India Hackathon problem statement "Digital Platform for Centralized Alumni Data Management and Engagement."

**Tagline:** "Connect. Mentor. Grow. Give Back."

**The core problem it solves:**
1. Alumni data is scattered across spreadsheets and disconnected systems.
2. Alumni profiles go stale over time.
3. Students can't easily find relevant mentors.
4. Students miss jobs/internships alumni could offer.
5. Institutions can't measure alumni engagement or network value.

**Positioning:** This is not a directory. It's an intelligence layer: **Centralize → Verify → Match → Engage → Measure.** Every screen should reinforce that arc.

### Tech & integrations
- React + Vite + Tailwind + shadcn/ui (Lovable's native stack)
- Connect **Supabase** for auth, database, and storage — use Lovable's native Supabase integration rather than a separate backend
- Design the schema so it's ready for `pgvector` later (embeddings column on alumni profiles), but don't require it to work now
- No secrets or API keys in frontend code; anything AI-related goes through a Supabase edge function

### Design direction
Premium university SaaS product — think a modern fintech dashboard crossed with a university platform, not a hackathon-student template.
- White/light neutral backgrounds, deep navy/indigo primary, restrained purple-blue AI accents
- Rounded cards, soft shadows, generous whitespace, clean sans-serif typography
- Lucide icons throughout
- Avoid: heavy gradients, cartoon illustrations, cluttered dashboards, over-animation
- Fully responsive; mobile uses a bottom nav or slide-out drawer, not a shrunk desktop layout

### Roles
Three roles with distinct dashboards and permissions: **Student, Alumni, Admin.** Admin accounts are never publicly self-registerable.

### Supabase schema (create these tables now)
`profiles` (extends auth.users; role enum: student/alumni/admin), `education`, `employment`, `skills`, `companies`, `industries`, `mentorships`, `mentorship_requests`, `opportunities`, `applications`, `events`, `event_registrations`, `communities`, `community_members`, `messages`, `notifications`, `engagement_scores`, `donations`, `verifications`

Key relationships: a mentorship links one student ↔ one alumni; an opportunity belongs to one alumni and has many applications; students and alumni each have many skills (many-to-many via a join table).

Enable Row Level Security: users edit only their own profile/records; admins have broader read access; alumni contact fields (email, phone) default to private and respect a visibility setting (public / students-only / alumni-only / institution-only).

### Onboarding — collect real data from every new user
Registration alone should not drop a user straight into an empty dashboard. After signup, route them into a **multi-step onboarding wizard** that actually writes to Supabase, so the platform is populated by real user input, not just demo seed data:

**Student onboarding** (after choosing "Student" at signup):
1. Basic info — full name, department, graduation year, phone (optional)
2. Career goal — pick from a list (Software Engineer, AI Engineer, Data Scientist, Product Manager, Entrepreneur, Cybersecurity, Cloud Engineer, Other)
3. Skills — multi-select / free-add chips
4. What they're looking for — mentorship, jobs, internships, networking, events (multi-select)
5. Location preference

**Alumni onboarding** (after choosing "Alumni" at signup):
1. Basic info — full name, graduation year, department, current location
2. Current role — company, designation, industry, years of experience
3. Skills — multi-select / free-add chips
4. Mentorship — available to mentor? (yes/no), focus areas if yes (career guidance, technical interviews, AI/ML, resume review, etc.), availability (weekdays/weekends/flexible)
5. Privacy — profile visibility (public / students-only / alumni-only / institution-only) and contact permissions (allow mentorship requests, allow messages, show email, show phone) — default sensitive fields to private

Each step should save progress (don't lose data on refresh), show a progress indicator, and let the user skip non-essential fields and fill them in later from their profile page — but block dashboard access until at least name, role-specific goal/role, and one skill are captured, since that's what the matching engine needs to function.

On completion, redirect to the relevant dashboard and set `profile_completion` based on how many optional fields were actually filled in — this should be a real calculated value driven by their onboarding answers, not a hardcoded number.

This is what makes "Centralize" real: alumni and students are supplying their own data, which the platform then verifies and matches against — the seeded demo profiles exist alongside this just so judges have enough volume to see search/matching/analytics work on day one.

### Build in this pass
1. **Landing page** — hero with headline "Turn Your Alumni Network Into Your Institution's Greatest Advantage," the four-card problem section, the Centralize→Verify→Match→Engage→Measure solution section, an AI-matching example block (student query → 3 ranked alumni matches with % and "why this match"), institutional impact stats, and a CTA section. Include a **"Demo Mode"** button in the nav that lets a visitor instantly preview the Student, Alumni, or Admin dashboard without registering — this is critical for live judging.
2. **Auth** — `/login`, `/register`, `/forgot-password` via Supabase Auth (email/password). Registration lets the user pick Student or Alumni only. Seed three demo accounts (student@alumnex.demo, alumni@alumnex.demo, admin@alumnex.demo) with obvious demo passwords, documented on the login page.
3. **Student dashboard** (`/student/dashboard`) — profile completion, career goal, top mentor match %, recommended-opportunities count, upcoming mentorship session, a row of 3-5 recommended-mentor cards (photo, role, company, skills, match %), and a floating "Ask ALUMNEX AI" button (can be a stub for now).
4. **Alumni dashboard** (`/alumni/dashboard`) — profile completion, incoming mentorship requests, students helped, opportunities posted, engagement score (0-100), and an "AI suggests" panel (e.g. "3 students are looking for your expertise").
5. **Admin dashboard** (`/admin/dashboard`) — top-line metrics (total/verified/active alumni, mentorships, engagement rate) plus placeholder chart containers for industry/location/graduation-year breakdowns (real charts come in a later prompt).
6. **Navigation** — role-specific sidebar (see below), notification bell, and a settings page stub.

### Demo data
Seed 30-40 realistic Indian alumni profiles (fictional identities — do not use real people), 15-20 students, 10-15 companies (Google, Microsoft, Amazon, TCS, Infosys, Flipkart, Zoho, etc. — used as fictional employers only, clearly demo data), 10-15 opportunities, a handful of events. No lorem ipsum anywhere.

### Sidebars
- **Student:** Dashboard, Find Alumni, Find Mentor, Opportunities, Mentorship, Career Graph, Communities, Events, Messages, AI Assistant, Profile
- **Alumni:** Dashboard, My Profile, Mentorship, Opportunities, Communities, Events, Messages, Engagement, AI Assistant
- **Admin:** Dashboard, Alumni, Students, Mentorship, Opportunities, Events, Communities, Analytics, Impact, Verification, Donations, Settings

Build reusable components (`components/dashboard`, `components/alumni`, `components/mentorship`, `components/opportunities`, `components/ai`, `components/navigation`) — don't build one giant page file per route. Add skeleton loaders for anything data-driven and a clean empty state for anything that could be empty (e.g. "No mentorship requests yet — complete your profile to improve visibility").

---

## PROMPT 2 — Alumni discovery & profiles

Now build:
- `/student/alumni` — search + filters (graduation year, department, industry, company, location, skills, experience, mentorship availability, verified status), results as cards with a verification badge
- `/alumni/:id` — full profile page: header with photo/name/badge/role/company, About, a career-journey timeline (graduation → roles → current), skill chips, education, mentorship availability + focus areas, opportunities they've posted, and their engagement stats (sessions, students helped, events run)
- `/alumni/profile` — the editable version of the above for the logged-in alumni, plus "Profile last verified: X days ago," a data-confidence %, and an "Update Profile" flow that refreshes the verification timestamp

---

## PROMPT 3 — AI mentor matching (the core differentiator)

Build `/student/find-mentor` as a 5-step flow: target career → skills (multi-select) → type of help needed → preferred location → availability. Then show ranked results.

Each match must show a **score breakdown**, never a bare percentage:
- Skill similarity, career-goal alignment, industry match, experience relevance, availability — each as its own progress bar, rolling up to an overall %
- A "Why this match?" checklist (e.g. "✓ Same career direction," "✓ Previously mentored 11 students," "✓ Available on weekends")

Implement this as a `services/matching` module with a clear scoring function:
`score = 0.30·skill + 0.20·career + 0.15·industry + 0.10·experience + 0.10·location + 0.10·availability + 0.05·engagement`

Run it client-side (or in a Supabase edge function) against the seeded alumni data now — structure it so a real embeddings-based version can swap in later without changing the UI contract (it should return `{matchScore, skillScore, careerScore, industryScore, experienceScore, locationScore, availabilityScore, engagementScore, explanation[]}`).

Wire "Request Mentorship" into a real Supabase insert against `mentorship_requests`, with a modal capturing goal, reason, and preferred schedule.

---

## PROMPT 4 — Mentorship workflow & opportunities

- `/student/mentorship` and `/alumni/mentorship` — pending/active/completed views on both sides, with a mentorship workspace once a request is accepted (a simple week-by-week milestone tracker students and alumni can both check off)
- `/opportunities` — tabbed (All/Jobs/Internships/Projects/Referrals), search + filters, each card showing AI match % and a "why this matches you" + "skills to learn" breakdown reusing the matching module from Prompt 3
- `/alumni/post-opportunity` — posting form that, on submit, shows "AI has identified N students who may be suitable" using the same matching logic in reverse

---

## PROMPT 5 — Admin analytics & institutional impact

- `/admin/alumni`, `/admin/students`, `/admin/opportunities`, `/admin/events` — management tables with search/filter/sort, verify/approve/reject actions, bulk actions where noted
- `/admin/impact` — mentorship/internship/job/referral/donation totals, a year-over-year impact timeline chart, and an engagement-risk panel (Active / Declining / Inactive alumni, with a suggested action like "Invite Rahul to the upcoming AI Alumni Summit")
- Real charts (not placeholder boxes) for alumni by industry, location, graduation year, top companies, and skills distribution, using the seeded demo data

---

## PROMPT 6 — Career graph, AI assistant, communities, events, messaging, donations

Build these as a batch once the core loop above works end-to-end:
- `/student/career-graph` — interactive node graph: student → career goal → required skills → relevant alumni → their companies
- `/ai-assistant` — chat UI ("ALUMNEX AI") with suggested prompts, backed by a Supabase edge function calling an LLM; if no API key is configured, fall back to rule-based demo answers pulled from the seeded data rather than failing
- `/communities`, `/events`, `/messages` — as described in the original spec, using the schema from Prompt 1
- `/donate` — campaign cards with target/raised/progress bars and a payment UI placeholder only (no real payment processing — leave a clear TODO for Razorpay/Stripe integration)

---

## Notes carried through every prompt

- **Real user input drives the platform, not just demo data.** Onboarding (Prompt 1), profile editing (Prompt 2), opportunity posting (Prompt 4), and event/community creation (Prompt 6) are all places where the *user* supplies data that gets written to Supabase and immediately reflected elsewhere (search results, matches, admin analytics). Demo-seeded records exist for volume, not as a substitute for these input flows.
- **Explainability is non-negotiable:** any AI-generated score or recommendation must show its reasoning, not just a number.
- **Never leave a primary button non-functional** — if a feature is out of scope for that prompt, either don't show the button yet or make it open a "coming soon" state, not a dead click.
- **Privacy defaults:** alumni contact info (email/phone) is private by default; visibility is opt-in.
- **Demo Mode stays central** — a judge should be able to walk Student → AI match → request mentorship → Alumni → accept + post opportunity → Student → apply → Admin → see it reflected in analytics, all without logging in and out of separate accounts.




# ALUMNEX — Refined Lovable Build Prompt
### For SIH Problem Statement: "Digital Platform for Centralized Alumni Data Management and Engagement"

---

## How to use this document

Lovable builds best in **stages**, not one 60-section mega-prompt. Paste **PROMPT 1** first to get the foundation right (design system, auth, schema, landing page, 3 dashboards). Once that generates and looks right, paste the follow-up prompts **one at a time**, in order, in the same project. Each one assumes everything before it already exists — don't re-paste earlier prompts.

This keeps every generation focused enough that Lovable actually finishes it, instead of half-building 15 screens at once.

---

## PROMPT 1 — Foundation (paste first)

Build a web application called **ALUMNEX** — an AI-powered alumni intelligence and engagement platform for universities, built for Smart India Hackathon problem statement "Digital Platform for Centralized Alumni Data Management and Engagement."

**Tagline:** "Connect. Mentor. Grow. Give Back."

**The core problem it solves:**
1. Alumni data is scattered across spreadsheets and disconnected systems.
2. Alumni profiles go stale over time.
3. Students can't easily find relevant mentors.
4. Students miss jobs/internships alumni could offer.
5. Institutions can't measure alumni engagement or network value.

**Positioning:** This is not a directory. It's an intelligence layer: **Centralize → Verify → Match → Engage → Measure.** Every screen should reinforce that arc.

### Tech & integrations
- React + Vite + Tailwind + shadcn/ui (Lovable's native stack)
- Connect **Supabase** for auth, database, and storage — use Lovable's native Supabase integration rather than a separate backend
- Design the schema so it's ready for `pgvector` later (embeddings column on alumni profiles), but don't require it to work now
- No secrets or API keys in frontend code; anything AI-related goes through a Supabase edge function

### Design direction
Premium university SaaS product — think a modern fintech dashboard crossed with a university platform, not a hackathon-student template.
- White/light neutral backgrounds, deep navy/indigo primary, restrained purple-blue AI accents
- Rounded cards, soft shadows, generous whitespace, clean sans-serif typography
- Lucide icons throughout
- Avoid: heavy gradients, cartoon illustrations, cluttered dashboards, over-animation
- Fully responsive; mobile uses a bottom nav or slide-out drawer, not a shrunk desktop layout

### Roles
Three roles with distinct dashboards and permissions: **Student, Alumni, Admin.** Admin accounts are never publicly self-registerable.

### Supabase schema (create these tables now)
`profiles` (extends auth.users; role enum: student/alumni/admin), `education`, `employment`, `skills`, `companies`, `industries`, `mentorships`, `mentorship_requests`, `opportunities`, `applications`, `events`, `event_registrations`, `communities`, `community_members`, `messages`, `notifications`, `engagement_scores`, `donations`, `verifications`

Key relationships: a mentorship links one student ↔ one alumni; an opportunity belongs to one alumni and has many applications; students and alumni each have many skills (many-to-many via a join table).

Enable Row Level Security: users edit only their own profile/records; admins have broader read access; alumni contact fields (email, phone) default to private and respect a visibility setting (public / students-only / alumni-only / institution-only).

### Onboarding — collect real data from every new user
Registration alone should not drop a user straight into an empty dashboard. After signup, route them into a **multi-step onboarding wizard** that actually writes to Supabase, so the platform is populated by real user input, not just demo seed data:

**Student onboarding** (after choosing "Student" at signup):
1. Basic info — full name, department, graduation year, phone (optional)
2. Career goal — pick from a list (Software Engineer, AI Engineer, Data Scientist, Product Manager, Entrepreneur, Cybersecurity, Cloud Engineer, Other)
3. Skills — multi-select / free-add chips
4. What they're looking for — mentorship, jobs, internships, networking, events (multi-select)
5. Location preference

**Alumni onboarding** (after choosing "Alumni" at signup):
1. Basic info — full name, graduation year, department, current location
2. Current role — company, designation, industry, years of experience
3. Skills — multi-select / free-add chips
4. Mentorship — available to mentor? (yes/no), focus areas if yes (career guidance, technical interviews, AI/ML, resume review, etc.), availability (weekdays/weekends/flexible)
5. Privacy — profile visibility (public / students-only / alumni-only / institution-only) and contact permissions (allow mentorship requests, allow messages, show email, show phone) — default sensitive fields to private

Each step should save progress (don't lose data on refresh), show a progress indicator, and let the user skip non-essential fields and fill them in later from their profile page — but block dashboard access until at least name, role-specific goal/role, and one skill are captured, since that's what the matching engine needs to function.

On completion, redirect to the relevant dashboard and set `profile_completion` based on how many optional fields were actually filled in — this should be a real calculated value driven by their onboarding answers, not a hardcoded number.

This is what makes "Centralize" real: alumni and students are supplying their own data, which the platform then verifies and matches against — the seeded demo profiles exist alongside this just so judges have enough volume to see search/matching/analytics work on day one.

### Build in this pass
1. **Landing page** — hero with headline "Turn Your Alumni Network Into Your Institution's Greatest Advantage," the four-card problem section, the Centralize→Verify→Match→Engage→Measure solution section, an AI-matching example block (student query → 3 ranked alumni matches with % and "why this match"), institutional impact stats, and a CTA section. Include a **"Demo Mode"** button in the nav that lets a visitor instantly preview the Student, Alumni, or Admin dashboard without registering — this is critical for live judging.
2. **Auth** — `/login`, `/register`, `/forgot-password` via Supabase Auth (email/password). Registration lets the user pick Student or Alumni only. Seed three demo accounts (student@alumnex.demo, alumni@alumnex.demo, admin@alumnex.demo) with obvious demo passwords, documented on the login page.
3. **Student dashboard** (`/student/dashboard`) — profile completion, career goal, top mentor match %, recommended-opportunities count, upcoming mentorship session, a row of 3-5 recommended-mentor cards (photo, role, company, skills, match %), and a floating "Ask ALUMNEX AI" button (can be a stub for now).
4. **Alumni dashboard** (`/alumni/dashboard`) — profile completion, incoming mentorship requests, students helped, opportunities posted, engagement score (0-100), and an "AI suggests" panel (e.g. "3 students are looking for your expertise").
5. **Admin dashboard** (`/admin/dashboard`) — top-line metrics (total/verified/active alumni, mentorships, engagement rate) plus placeholder chart containers for industry/location/graduation-year breakdowns (real charts come in a later prompt).
6. **Navigation** — role-specific sidebar (see below), notification bell, and a settings page stub.

### Demo data
Seed 30-40 realistic Indian alumni profiles (fictional identities — do not use real people), 15-20 students, 10-15 companies (Google, Microsoft, Amazon, TCS, Infosys, Flipkart, Zoho, etc. — used as fictional employers only, clearly demo data), 10-15 opportunities, a handful of events. No lorem ipsum anywhere.

### Sidebars
- **Student:** Dashboard, Find Alumni, Find Mentor, Opportunities, Mentorship, Career Graph, Communities, Events, Messages, AI Assistant, Profile
- **Alumni:** Dashboard, My Profile, Mentorship, Opportunities, Communities, Events, Messages, Engagement, AI Assistant
- **Admin:** Dashboard, Alumni, Students, Mentorship, Opportunities, Events, Communities, Analytics, Impact, Verification, Donations, Settings

Build reusable components (`components/dashboard`, `components/alumni`, `components/mentorship`, `components/opportunities`, `components/ai`, `components/navigation`) — don't build one giant page file per route. Add skeleton loaders for anything data-driven and a clean empty state for anything that could be empty (e.g. "No mentorship requests yet — complete your profile to improve visibility").

---

## PROMPT 2 — Alumni discovery & profiles

Now build:
- `/student/alumni` — search + filters (graduation year, department, industry, company, location, skills, experience, mentorship availability, verified status), results as cards with a verification badge
- `/alumni/:id` — full profile page: header with photo/name/badge/role/company, About, a career-journey timeline (graduation → roles → current), skill chips, education, mentorship availability + focus areas, opportunities they've posted, and their engagement stats (sessions, students helped, events run)
- `/alumni/profile` — the editable version of the above for the logged-in alumni, plus "Profile last verified: X days ago," a data-confidence %, and an "Update Profile" flow that refreshes the verification timestamp

---

## PROMPT 3 — AI mentor matching (the core differentiator)

Build `/student/find-mentor` as a 5-step flow: target career → skills (multi-select) → type of help needed → preferred location → availability. Then show ranked results.

Each match must show a **score breakdown**, never a bare percentage:
- Skill similarity, career-goal alignment, industry match, experience relevance, availability — each as its own progress bar, rolling up to an overall %
- A "Why this match?" checklist (e.g. "✓ Same career direction," "✓ Previously mentored 11 students," "✓ Available on weekends")

Implement this as a `services/matching` module with a clear scoring function:
`score = 0.30·skill + 0.20·career + 0.15·industry + 0.10·experience + 0.10·location + 0.10·availability + 0.05·engagement`

Run it client-side (or in a Supabase edge function) against the seeded alumni data now — structure it so a real embeddings-based version can swap in later without changing the UI contract (it should return `{matchScore, skillScore, careerScore, industryScore, experienceScore, locationScore, availabilityScore, engagementScore, explanation[]}`).

Wire "Request Mentorship" into a real Supabase insert against `mentorship_requests`, with a modal capturing goal, reason, and preferred schedule.

---

## PROMPT 4 — Mentorship workflow & opportunities

- `/student/mentorship` and `/alumni/mentorship` — pending/active/completed views on both sides, with a mentorship workspace once a request is accepted (a simple week-by-week milestone tracker students and alumni can both check off)
- `/opportunities` — tabbed (All/Jobs/Internships/Projects/Referrals), search + filters, each card showing AI match % and a "why this matches you" + "skills to learn" breakdown reusing the matching module from Prompt 3
- `/alumni/post-opportunity` — posting form that, on submit, shows "AI has identified N students who may be suitable" using the same matching logic in reverse

---

## PROMPT 5 — Admin analytics & institutional impact

- `/admin/alumni`, `/admin/students`, `/admin/opportunities`, `/admin/events` — management tables with search/filter/sort, verify/approve/reject actions, bulk actions where noted
- `/admin/impact` — mentorship/internship/job/referral/donation totals, a year-over-year impact timeline chart, and an engagement-risk panel (Active / Declining / Inactive alumni, with a suggested action like "Invite Rahul to the upcoming AI Alumni Summit")
- Real charts (not placeholder boxes) for alumni by industry, location, graduation year, top companies, and skills distribution, using the seeded demo data

---

## PROMPT 6 — Career graph, AI assistant, communities, events, messaging, donations

Build these as a batch once the core loop above works end-to-end:
- `/student/career-graph` — interactive node graph: student → career goal → required skills → relevant alumni → their companies
- `/ai-assistant` — chat UI ("ALUMNEX AI") with suggested prompts, backed by a Supabase edge function calling an LLM; if no API key is configured, fall back to rule-based demo answers pulled from the seeded data rather than failing
- `/communities`, `/events`, `/messages` — as described in the original spec, using the schema from Prompt 1
- `/donate` — campaign cards with target/raised/progress bars and a payment UI placeholder only (no real payment processing — leave a clear TODO for Razorpay/Stripe integration)

---

## Notes carried through every prompt

- **Real user input drives the platform, not just demo data.** Onboarding (Prompt 1), profile editing (Prompt 2), opportunity posting (Prompt 4), and event/community creation (Prompt 6) are all places where the *user* supplies data that gets written to Supabase and immediately reflected elsewhere (search results, matches, admin analytics). Demo-seeded records exist for volume, not as a substitute for these input flows.
- **Explainability is non-negotiable:** any AI-generated score or recommendation must show its reasoning, not just a number.
- **Never leave a primary button non-functional** — if a feature is out of scope for that prompt, either don't show the button yet or make it open a "coming soon" state, not a dead click.
- **Privacy defaults:** alumni contact info (email/phone) is private by default; visibility is opt-in.
- **Demo Mode stays central** — a judge should be able to walk Student → AI match → request mentorship → Alumni → accept + post opportunity → Student → apply → Admin → see it reflected in analytics, all without logging in and out of separate accounts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f240d3a8-c574-44e8-a425-a7860e5a57ed).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
