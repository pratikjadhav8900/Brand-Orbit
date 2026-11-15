export type VerticalSlug =
  | "marketing-growth"
  | "technology-ai"
  | "education"
  | "media-creative"
  | "business-consulting"
  | "venture-building";

export interface Vertical {
  slug: VerticalSlug;
  index: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  capabilities: string[];
  heroImage?: string;
  cardImage?: string;
  accent: "ocean" | "teal";
}

export interface ServiceGroup {
  verticalSlug: VerticalSlug;
  services: string[];
}

export interface Industry {
  name: string;
  description: string;
  image?: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export type PortfolioStatus = "published" | "unpublished";

export interface PortfolioProject {
  slug: string;
  title: string;
  verticalSlug: VerticalSlug;
  summary: string;
  description: string;
  image?: string;
  status: PortfolioStatus;
}

export interface InsightArticle {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  status: PortfolioStatus;
  date?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
