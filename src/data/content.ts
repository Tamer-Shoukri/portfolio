/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 *
 * All content below is from information Tamer verified directly. Nothing is
 * invented — where a detail (dates, links, metrics) was not provided, it is
 * intentionally omitted rather than guessed. The page is driven entirely by
 * this file, so content never requires touching the UI code.
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
  /** Short "how it works" points, shown on the featured card. */
  highlights?: string[];
  /** Small practical note under the links (e.g. hardware requirements). */
  note?: string;
  /** Private projects show no links and a "Private" marker. */
  isPrivate?: boolean;
  /** Coming-soon projects show a "Coming Soon" badge and no live links. */
  comingSoon?: boolean;
  /** Shown as a large spotlight card above the grid. */
  featured?: boolean;
  /** Screenshot path under /public (base path is prefixed at render time). */
  image?: string;
  imageAlt?: string;
  /** Accent color for this project's card (hex). */
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
 * Projects, in display order. A `featured` project gets the large spotlight
 * card; the rest render in the grid below it.
 */
export const projects: Project[] = [
  {
    id: "ninja-motion",
    name: "Ninja Motion",
    tagline: "Fruit Ninja you play with your body.",
    description:
      "A browser game where your webcam is the controller. You slice flying fruit by swinging your actual hands — a cut only lands when your fingertip sweeps through the fruit fast enough, so it feels like a real blade.",
    role: "Solo developer",
    tech: ["TypeScript", "MediaPipe", "Computer Vision", "Canvas", "Vite"],
    year: "2026",
    links: [
      { label: "Play", url: "https://tamer-shoukri.github.io/ninja-motion/" },
      { label: "Code", url: "https://github.com/Tamer-Shoukri/ninja-motion" },
    ],
    highlights: [
      "Real-time hand tracking with Google MediaPipe (21 landmarks per hand)",
      "Speed-gated slicing: fingertip trails hit-tested against each fruit every frame",
      "Physics tosses, split-and-splatter effects, combos and bombs",
      "Runs entirely in the browser at 60fps — no server",
    ],
    note: "Needs a webcam · best in desktop Chrome",
    featured: true,
    image: "/projects/ninja-motion.jpg",
    imageAlt: "Ninja Motion gameplay: a blade trail slicing a watermelon and an apple in half among flying fruit",
    accent: "#8ee6c8",
  },
  {
    id: "math-tug-of-war",
    name: "Math Tug-of-War",
    tagline: "A 2D browser arcade game.",
    description:
      "A two-player arcade game where players race to answer addition, subtraction, and multiplication questions — every correct answer pulls a shared rope toward their side, and the first to drag the opponent past the boundary wins. Includes a local two-player mode and a difficulty-scaled AI opponent.",
    role: "Solo developer",
    tech: ["Phaser 3", "TypeScript", "Vite"],
    year: "2026",
    links: [
      { label: "Play", url: "https://tamer-shoukri.github.io/math-tug-of-war/" },
      { label: "Code", url: "https://github.com/Tamer-Shoukri/math-tug-of-war" },
    ],
    image: "/projects/math-tug-of-war.jpg",
    imageAlt: "Math Tug-of-War title screen with blue and red players and mode and difficulty options",
    accent: "#7fb0e6",
  },
  {
    id: "d4c",
    name: "D4C — Weather & Market Prediction",
    tagline: "Coming soon.",
    description:
      "A research platform combining weather forecasting and prediction-market analysis. A full showcase — including how it was built and the thinking behind it — is coming soon.",
    role: "Developer",
    tech: ["Python", "Data Pipelines", "Forecasting"],
    year: "",
    links: [],
    comingSoon: true,
    accent: "#d6b98a",
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
    period: "2024 — Present",
    details: [],
  },
];
