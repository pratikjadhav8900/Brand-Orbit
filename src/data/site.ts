export const siteConfig = {
  name: "BrandOrbit Group",
  shortName: "BrandOrbit",
  tagline: "Building Businesses. Creating Growth. Shaping Opportunities.",
  description:
    "An integrated business ecosystem combining strategy, technology, creativity and expertise to build ventures and accelerate business growth.",
  url: "https://brandorbit.example", // TODO: replace with confirmed production domain
  leadership: [
    { name: "Lalit Kumawat", role: "Founder" },
    { name: "Jitendra Kumar Kumawat", role: "Founder & Advisor" },
  ],
  contact: {
    email: "hello@brandorbit.example", // TODO: confirm business email
    phoneDisplay: "+91 86966 40524",
    whatsapp: {
      number: "918696640524", // international format, no symbols, used for wa.me links
      message: "Hi BrandOrbit Group, I'd like to know more about your services.",
    },
    location: "India", // TODO: confirm city/state for full address
  },
  legal: {
    entityName: null as string | null, // TODO: confirm registered legal entity name
  },
  social: {
    linkedin: null as string | null,
    instagram: null as string | null,
    twitter: null as string | null,
  },
};

export const whatsappHref = `https://wa.me/${siteConfig.contact.whatsapp.number}?text=${encodeURIComponent(
  siteConfig.contact.whatsapp.message
)}`;
