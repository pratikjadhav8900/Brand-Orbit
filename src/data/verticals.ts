import type { Vertical } from "@/types";

export const verticals: Vertical[] = [
  {
    slug: "marketing-growth",
    index: "01",
    name: "Marketing & Business Growth",
    shortName: "Marketing & Growth",
    tagline: "Strategy and creative that move the growth metrics that matter.",
    description:
      "We plan and run marketing programmes that build brands and drive measurable growth — from positioning and campaigns to performance marketing and brand communication.",
    capabilities: [
      "Brand strategy & positioning",
      "Performance & growth marketing",
      "Campaign planning & execution",
      "Content & social media marketing",
    ],
    accent: "ocean",
    cardImage: "/images/vertical-marketing-growth.jpg",
  },
  {
    slug: "technology-ai",
    index: "02",
    name: "Technology, AI & Automation",
    shortName: "Technology & AI",
    tagline: "Practical technology and automation built for real business problems.",
    description:
      "We design and build software, AI-driven tools and automation systems that help businesses operate faster, smarter and at lower cost.",
    capabilities: [
      "Web & product development",
      "AI & automation solutions",
      "Systems integration",
      "Technical consulting",
    ],
    accent: "teal",
    cardImage: "/images/vertical-technology-ai.jpg",
  },
  {
    slug: "education",
    index: "03",
    name: "Education & Skill Development",
    shortName: "Education",
    tagline: "Learning programmes that build real, employable skills.",
    description:
      "We create training programmes and learning experiences that help individuals and teams build the skills today's businesses need.",
    capabilities: [
      "Skill development programmes",
      "Corporate training",
      "Curriculum design",
      "Learning & development consulting",
    ],
    accent: "ocean",
    cardImage: "/images/vertical-education.jpg",
  },
  {
    slug: "media-creative",
    index: "04",
    name: "Media & Creative Solutions",
    shortName: "Media & Creative",
    tagline: "Production and creative work that gives brands a distinct voice.",
    description:
      "We produce media and creative assets — from visual identity to video and photography — that give businesses a distinctive, professional presence.",
    capabilities: [
      "Visual identity & design",
      "Photography & video production",
      "Creative direction",
      "Content production",
    ],
    accent: "teal",
    cardImage: "/images/vertical-media-creative.jpg",
  },
  {
    slug: "business-consulting",
    index: "05",
    name: "Business Consulting",
    shortName: "Consulting",
    tagline: "Clear-headed strategy and operations guidance for growing businesses.",
    description:
      "We advise businesses on strategy, operations and structure — helping founders and leadership teams make sound decisions as they grow.",
    capabilities: [
      "Business strategy",
      "Operations & process consulting",
      "Market entry & planning",
      "Organisational advisory",
    ],
    accent: "ocean",
    cardImage: "/images/vertical-business-consulting.jpg",
  },
  {
    slug: "venture-building",
    index: "06",
    name: "Venture Building",
    shortName: "Venture Building",
    tagline: "Where BrandOrbit develops and grows its own ventures.",
    description:
      "Beyond client services, BrandOrbit develops, builds and grows its own ventures and brands — applying the group's combined expertise to new opportunities.",
    capabilities: [
      "Venture ideation & validation",
      "Venture development",
      "Brand incubation",
      "Growth & scaling support",
    ],
    accent: "teal",
    cardImage: "/images/vertical-venture-building.jpg",
  },
];

export function getVerticalBySlug(slug: string) {
  return verticals.find((v) => v.slug === slug);
}
