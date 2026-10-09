/** Keep ROLES in sync with VALID_ROLES in app/api/tid/route.ts (the API rejects anything else). */
export const ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "AI/ML Engineer",
  "Other",
];

export const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular",
  "Node.js", "Python", "Go", "Rust", "Java", "Swift", "Flutter",
  "Docker", "AWS", "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS",
];

export const MAX_SKILLS = 5;

/** Suggestions only (free text is still allowed); helps keep country names consistent. */
export const COUNTRY_SUGGESTIONS = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Rwanda", "Uganda", "Tanzania",
  "Ethiopia", "Cameroon", "Senegal", "Côte d'Ivoire", "Morocco", "Tunisia", "Algeria",
  "Zambia", "Zimbabwe", "Botswana", "Namibia", "Malawi", "Mozambique", "Angola",
  "Benin", "Togo", "Sierra Leone", "Liberia", "The Gambia", "DR Congo", "Sudan",
  "United Kingdom", "United States", "Canada", "Germany",
];

export const STEPS = [
  {
    title: "About you",
    description: "Your name goes on your passport. Your email stays private and is only used to send you your TID.",
  },
  {
    title: "Your role",
    description: "Pick the discipline that best describes your work. You can add a GitHub or portfolio link too.",
  },
  {
    title: "Your skills",
    description: `Choose up to ${MAX_SKILLS} skills to show on your passport. Add your own if it isn't listed.`,
  },
  {
    title: "Review & claim",
    description: "Check your details. Your TID is created as soon as you claim it.",
  },
] as const;
