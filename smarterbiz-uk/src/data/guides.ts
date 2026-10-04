import type { Guide } from "@/lib/types";
import { GUIDES_1 } from "./guides-1";
import { GUIDES_2 } from "./guides-2";
import { GUIDES_3 } from "./guides-3";

export const GUIDES: Guide[] = [...GUIDES_1, ...GUIDES_2, ...GUIDES_3].sort((a, b) => b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published));

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
export const featuredGuide = () => GUIDES.find((g) => g.featured) ?? GUIDES[0]!;
