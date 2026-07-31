/**
 * Team roster.
 *
 * This is the STATIC fallback shown on the public /team page before Supabase
 * is connected (and as SEO-friendly server-rendered content). Once the admin
 * dashboard is live, the public page reads live rows from Supabase and this
 * list is used only to seed the database the first time.
 *
 * Real members: Muhammad Haseeb, Arooba Shafique, Nafia Aziz, Malaika Farooq.
 * The rest are placeholders — edit or remove them from the admin dashboard.
 */
export type TeamLevel = "Junior" | "Mid" | "Senior" | "Lead";

export interface TeamMember {
  slug: string;
  full_name: string;
  title: string;        // job role
  level: TeamLevel;
  bio: string;
  photo_url: string;    // /team/... or remote
  email?: string;
  linkedin?: string;
  skills: string[];
  stars: number;        // 0–5 (admin-set)
  is_public: boolean;
}

export const TEAM: TeamMember[] = [
  {
    slug: "muhammad-haseeb",
    full_name: "Muhammad Haseeb",
    title: "Founder & CEO",
    level: "Lead",
    bio: "Founder of HaadinGlobal. Leads strategy, client growth, and the team behind campaigns that have driven measurable results for businesses across Pakistan, the UAE, Qatar, Saudi Arabia, the UK and the USA.",
    photo_url: "/team/muhammad-haseeb.png",
    email: "haadinglobal@gmail.com",
    skills: ["Growth Strategy", "Paid Ads", "Team Leadership", "Client Success"],
    stars: 5,
    is_public: true,
  },
  {
    slug: "malaika-farooq",
    full_name: "Malaika Farooq",
    title: "Relationship Manager",
    level: "Senior",
    bio: "Drives client onboarding and long-term relationships — managing follow-ups, sourcing strategic leads, coordinating client meetings, mentoring the team, and overseeing the agency's day-to-day operations and account handling.",
    photo_url: "/team/malaika-farooq.jpeg",
    email: "malaikafarooq381@gmail.com",
    skills: ["Client Management", "Lead Generation", "Operations", "Team Coordination"],
    stars: 5,
    is_public: true,
  },
  {
    slug: "arooba-shafique",
    full_name: "Arooba Shafique",
    title: "Full-Stack Developer",
    level: "Mid",
    bio: "Full-stack developer with a portfolio of real-world builds — from a complete ISP management system to professional websites deployed for international businesses. Focused on clean, reliable delivery.",
    photo_url: "/team/arooba-shafique.jpeg",
    email: "aroobas2004@gmail.com",
    linkedin: "https://linkedin.com/in/arooba-shafique",
    skills: ["Full-Stack Development", "Web Apps", "Databases", "Deployment"],
    stars: 5,
    is_public: true,
  },
  {
    slug: "nafia-aziz",
    full_name: "Nafia Aziz",
    title: "Full-Stack Developer",
    level: "Mid",
    bio: "Full-stack developer who has built and delivered professional websites for international clients — including Royal Painters Dubai — alongside ISP management systems and business catalogues, with a strong focus on quality and client satisfaction.",
    photo_url: "/team/nafia-aziz.jpeg",
    email: "nafiaaziz.500@gmail.com",
    linkedin: "https://linkedin.com/in/nafia-aziz059",
    skills: ["Full-Stack Development", "Client Websites", "eCommerce", "UI Development"],
    stars: 5,
    is_public: true,
  },
  // ── Placeholder members (edit/remove from the admin dashboard) ───────────
  ph("ahmed-raza", "Ahmed Raza", "SEO Specialist", "Mid", ["SEO", "Technical SEO", "Content"]),
  ph("hina-malik", "Hina Malik", "Social Media Manager", "Mid", ["Social Media", "Community", "Content Calendar"]),
  ph("bilal-khan", "Bilal Khan", "Google Ads Specialist", "Senior", ["Google Ads", "PPC", "Analytics"]),
  ph("sana-tariq", "Sana Tariq", "Graphic Designer", "Junior", ["Graphic Design", "Branding", "Social Creatives"]),
  ph("usman-ali", "Usman Ali", "Meta Ads Specialist", "Mid", ["Meta Ads", "Creative Testing", "Retargeting"]),
  ph("ayesha-noor", "Ayesha Noor", "Content Writer", "Junior", ["Copywriting", "SEO Writing", "Email"]),
];

function ph(slug: string, name: string, title: string, level: TeamLevel, skills: string[]): TeamMember {
  return {
    slug,
    full_name: name,
    title,
    level,
    bio: `${name} is part of the HaadinGlobal team, contributing to client work across ${title.toLowerCase()} projects. This is placeholder content — update it from the admin dashboard.`,
    photo_url: "/logo-small.png",
    skills,
    stars: 4,
    is_public: true,
  };
}

export function getMember(slug: string) {
  return TEAM.find((m) => m.slug === slug);
}
