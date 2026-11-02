/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 *
 * All content below is from information Tamer verified directly. Nothing is
 * invented — where a detail (dates, links, metrics) was not provided, it is
 * intentionally omitted rather than guessed. The 3D experience is driven
 * entirely by this file, so content never requires touching the scene code.
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
  /** Private projects show no links and a "Private" marker. */
  isPrivate?: boolean;
  /** Accent color for this floor/room (hex). */
  accent: string;
}

export interface ExperienceItem {
  role: string;
  org: string;
  period?: string;
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
  seeking: string;
  email?: string;
  socials: { label: string; url: string }[];
}

export const profile: Profile = {
  name: "Tamer Shoukri",
  // Factual, derived only from verified info (CS student at Western).
  title: "Computer Science Student · Software Developer",
  tagline: "Building polished software that solves real problems.",
  seeking: "Open to internships & co-ops",
  // Email intentionally omitted until confirmed.
  socials: [{ label: "GitHub", url: "https://github.com/Tamer-Shoukri" }],
};

/** Reusable skill list (verified). */
export const skills: string[] = [
  "Python",
  "Java",
  "C",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "R",
  "Git",
  "GitHub",
  "VS Code",
  "Linux",
  "API Integration",
  "Automation",
  "Software Testing",
];

/**
 * Projects map to FLOORS (top floor = first entry). Each is a room you enter.
 */
export const projects: Project[] = [
  {
    id: "math-tug-of-war",
    name: "Math Tug-of-War",
    tagline: "A 2D browser arcade game.",
    description:
      "A polished two-player arcade game where players race to answer addition, subtraction, and multiplication questions — every correct answer pulls a shared rope toward their side, and the first to drag the opponent past the boundary wins. Includes a local two-player mode and a difficulty-scaled AI opponent.",
    role: "Solo developer",
    tech: ["Phaser 3", "TypeScript", "Vite"],
    year: "2026",
    links: [
      { label: "Play", url: "https://tamer-shoukri.github.io/math-tug-of-war/" },
      { label: "Code", url: "https://github.com/Tamer-Shoukri/math-tug-of-war" },
    ],
    accent: "#7fb0e6",
  },
  {
    id: "d4c",
    name: "D4C — Prediction Market Intelligence",
    tagline: "Private research platform.",
    description:
      "A private research platform spanning data pipelines, weather forecasting, and prediction-market analysis. Proprietary implementation and data are kept private.",
    role: "Developer",
    tech: ["Python", "Data Pipelines", "Forecasting"],
    year: "",
    links: [],
    isPrivate: true,
    accent: "#d6b98a",
  },
  {
    id: "expense-tracker",
    name: "Python Expense Tracker",
    tagline: "Personal finance tracking tool.",
    description: "A Python application for tracking and categorizing personal expenses.",
    role: "Solo developer",
    tech: ["Python"],
    year: "",
    links: [],
    accent: "#a79ccf",
  },
  {
    id: "student-management-system",
    name: "Student Management System",
    tagline: "Records management application.",
    description:
      "An application for managing student records and related administrative data.",
    role: "Solo developer",
    tech: ["Java"],
    year: "",
    links: [],
    accent: "#8fcaa8",
  },
];

/** Experience — exactly as verified. Bullets/dates omitted where not provided. */
export const experience: ExperienceItem[] = [
  {
    role: "AI Trainer",
    org: "Outlier",
    period: "2025 — 2026",
    bullets: [],
  },
  {
    role: "Benchmark Engineer",
    org: "AfterQuery",
    bullets: [],
  },
  {
    role: "Museum Staff",
    org: "Royal Canadian Regiment Museum",
    period: "2025 — 2026",
    bullets: [],
  },
  {
    role: "Site Operator",
    org: "DECO Windshield Repair",
    bullets: [],
  },
  {
    role: "Sales, Inventory & Event Operations",
    org: "London Rock Comic Con",
    period: "2024 — 2026",
    bullets: [],
  },
];

export const education: EducationItem[] = [
  {
    school: "Western University",
    program: "Bachelor of Science in Computer Science · Minor in Software Engineering",
    period: "2022 — Present",
    details: [],
  },
];
