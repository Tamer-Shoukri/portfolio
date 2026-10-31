/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 *
 * >>> PLACEHOLDER CONTENT <<<
 * Everything marked PLACEHOLDER is temporary and will be replaced with Tamer's
 * real details. The 3D experience is driven entirely by this file, so swapping
 * content never requires touching the scene code.
 */

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  tech: string[];
  year: string;
  links: { label: string; url: string }[];
  highlight?: string;
  /** Accent color for this floor/room (hex). */
  accent: string;
}

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  bullets: string[];
}

export interface EducationItem {
  school: string;
  program: string;
  period: string;
  details: string[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  seeking: string;
  email: string;
  socials: { label: string; url: string }[];
}

export const profile: Profile = {
  // PLACEHOLDER — confirm exact spelling/casing
  name: "Tamer Shoukri",
  // PLACEHOLDER
  title: "AI / Full-Stack Developer",
  // PLACEHOLDER
  tagline: "Building polished products that solve real problems.",
  // PLACEHOLDER
  location: "Toronto, Canada",
  // PLACEHOLDER
  seeking: "Open to Summer 2027+ internships & co-ops",
  // PLACEHOLDER
  email: "you@example.com",
  socials: [
    // PLACEHOLDER — Math Tug-of-War repo is real; others to confirm
    { label: "GitHub", url: "https://github.com/Tamer-Shoukri" },
    { label: "LinkedIn", url: "#" },
  ],
};

/**
 * Projects map to FLOORS (top floor = first entry). Each is a room you enter.
 * The only real, confirmed project right now is Math Tug-of-War.
 */
export const projects: Project[] = [
  {
    id: "math-tug-of-war",
    name: "Math Tug-of-War",
    tagline: "A polished 2D arcade math battler.",
    description:
      "Two players race to answer addition, subtraction, and multiplication questions; every correct answer pulls a shared rope toward their side. First to drag the opponent past the boundary wins. Features local 2-player and a difficulty-scaled AI opponent, combo scoring, and juicy arcade feedback.",
    role: "Solo developer — design, engine, tests, deploy",
    tech: ["Phaser 3", "TypeScript", "Vite", "Vitest"],
    year: "2026",
    links: [
      { label: "Play", url: "https://tamer-shoukri.github.io/math-tug-of-war/" },
      { label: "Code", url: "https://github.com/Tamer-Shoukri/math-tug-of-war" },
    ],
    highlight: "37 unit tests, browser-verified, auto-deployed via GitHub Actions.",
    accent: "#7fb0e6",
  },
  {
    // PLACEHOLDER project
    id: "project-two",
    name: "Project Two",
    tagline: "PLACEHOLDER — a second flagship project.",
    description:
      "PLACEHOLDER. Replace with a real project: what problem it solves, your role, the interesting technical decisions, and the outcome.",
    role: "PLACEHOLDER",
    tech: ["Next.js", "Node.js", "PostgreSQL"],
    year: "2026",
    links: [{ label: "Code", url: "#" }],
    accent: "#d6b98a",
  },
  {
    // PLACEHOLDER project
    id: "project-three",
    name: "Project Three",
    tagline: "PLACEHOLDER — a third notable project.",
    description:
      "PLACEHOLDER. Replace with a real project. Emphasize product thinking, technical depth, and measurable results.",
    role: "PLACEHOLDER",
    tech: ["Python", "FastAPI", "ML"],
    year: "2025",
    links: [{ label: "Code", url: "#" }],
    accent: "#a79ccf",
  },
];

export const experience: ExperienceItem[] = [
  {
    // PLACEHOLDER
    role: "Software Engineering Intern",
    org: "Company Name",
    period: "2026",
    bullets: [
      "PLACEHOLDER — a concrete accomplishment with impact/metrics.",
      "PLACEHOLDER — a technical contribution and the tools used.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    // PLACEHOLDER
    school: "University Name",
    program: "BSc, Computer Science",
    period: "2024 — 2028",
    details: ["PLACEHOLDER — relevant coursework, honors, or activities."],
  },
];
