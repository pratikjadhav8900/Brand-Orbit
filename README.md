# BrandOrbit Group — Website

Official marketing website for **BrandOrbit Group**, a founder-led, multi-vertical business group. Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Firebase (Firestore) for form data.

> "Building Businesses. Creating Growth. Shaping Opportunities."

## Business verticals

The site presents six verticals the group operates across:

1. **Marketing & Business Growth** — brand strategy, performance marketing, campaigns
2. **Technology, AI & Automation** — web/product development, AI tools, automation
3. **Education & Skill Development** — training programmes, corporate L&D
4. **Media & Creative Solutions**
5. **Business Consulting**
6. **Venture Building**

Each vertical has its own landing page under `/businesses/[slug]`, driven by a single data source so content stays consistent across the homepage, the businesses index, and individual pages.

## Pages

Home · About · Businesses (index + 6 vertical pages) · Services · Industries · Approach · Portfolio · Careers · Insights · Contact · Privacy Policy · Terms

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack, Cache Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens — navy / ocean-blue / teal brand palette)
- **Animation:** Framer Motion
- **Fonts:** Inter (body), Plus Jakarta Sans (headings), Baloo 2 (wordmark) — self-hosted via `next/font/google`
- **Forms & data:** Firebase Admin SDK + Firestore (enquiries, partnerships, careers applications, newsletter signups)

## Project structure

```
src/
  app/              Routes (App Router), one folder per page + API routes under app/api/*
  components/
    layout/          Header, Footer, WhatsApp floating button
    home/            Homepage sections (Hero, About, Capabilities, etc.)
    shared/          Reusable UI (forms, buttons, section headings, reveal animation)
    businesses/      Vertical-specific components
  data/              Single source of truth for site config, nav, verticals, industries, portfolio, insights
  lib/               Firebase Admin init, form validation helpers, client submit hook
  types/             Shared TypeScript types
public/
  brand/             Logo assets
  images/            Stock photography placeholders (see CREDITS.md for sourcing)
```

## Content policy

No fabricated client names, testimonials, metrics, logos, or legal details are used anywhere on the site. Sections that would otherwise require real data not yet available (portfolio case studies, published articles, client logos) are either omitted or shown as honest "coming soon" placeholders until real content is supplied.

Stock photography used as visual placeholders is credited in [`public/images/CREDITS.md`](public/images/CREDITS.md) and should be replaced with real BrandOrbit photography when available.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Forms write to Firestore via the Firebase Admin SDK. Copy `.env.example` to `.env.local` and fill in a Firebase service account's credentials:

```bash
cp .env.example .env.local
```

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Generate these from Firebase Console → Project Settings → Service Accounts → Generate new private key. Without them, forms fail gracefully with a user-facing error instead of crashing.

### Build

```bash
npm run build
npm run lint
```

## Still placeholder / pending real content

- Production domain, business email, and registered legal entity name (`src/data/site.ts`)
- Firebase project credentials (`.env.local`)
- Real portfolio case studies and published insights articles
- Real team/office photography to replace Unsplash placeholders
