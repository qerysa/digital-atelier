# Digital Atelier — interactive portfolio

A premium portfolio for an independent **web developer · UI/UX designer · motion designer**.
Five self-initiated concept projects, each with a full case study and a **working live demo**:

| # | Project | Service shown | Live demo |
|---|---------|---------------|-----------|
| 01 | **Ember** — specialty coffee storefront | Website development | Shop, filters, product options, persistent cart |
| 02 | **Aurel** — skincare launch page | Landing page design | Staged hero, ingredient hotspots, collection, FAQ, sign-up |
| 03 | **Pulse** — SaaS project dashboard | UI/UX design | Overview, projects, tasks, analytics, team, light/dark |
| 04 | **Noiré** — real-time 3D perfume film | 3D & motion | WebGL glass bottle, camera timeline, lighting moods |
| 05 | **Signal** — festival motion identity | Motion graphics | 20 s SVG motion piece with scrubber & chapters |

All projects are **fictional concepts** — no fake clients, metrics or testimonials.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve dist/ locally
```

Requires Node 20+.

## Make it yours — edit one file

Everything personal lives in **`src/config/site.ts`**:

| Field | What it does |
|-------|--------------|
| `url` | Your production URL (e.g. `https://yourname.dev`). Enables canonical tags, absolute OG image and `sitemap.xml`. |
| `brand.name`, `brand.initials` | Logo, footer and meta tags. |
| `owner.name`, `owner.role` | Your public name (optional) and role line. |
| `status` | The "Available for projects" badge in the navigation. |
| `contact.email` | **Your business email.** Turns on mailto links, "Copy email" and the contact form. |
| `contact.formEndpoint` | Optional form backend (Formspree, Getform, Basin, own API) that accepts a JSON `POST`. |
| `socials` | GitHub, LinkedIn, Behance, Fiverr, Upwork, Contra, Dribbble — empty values are hidden everywhere. |
| `seo.title`, `seo.description` | Default page title and description. |

Copy (hero lines, services, about, process, values) is in `src/data/content.ts`.
Project data and case-study text are in `src/data/projects.ts`.

### Contact form

There is no backend in this project. The form validates every field, then:

1. **`formEndpoint` set** → sends the inquiry as JSON to that endpoint and shows a success state.
2. **Only `email` set** → opens the visitor's mail app with a pre-filled message (mailto).
3. **Neither set** → shows a friendly "contact is being set up" message and logs a console hint.

Nothing is stored in the browser.

## Adding or editing a project

1. Add an entry to `src/data/projects.ts` (title, theme colours, case-study sections, demo settings).
2. Create `src/projects/<slug>/Cover.tsx` (home-page preview) and optionally `Demo.tsx` (live demo).
3. Register both in `src/projects/registry.ts`. Everything is code-split, so a project's code only loads when needed.
4. Put images in `public/images/` (WebP, two widths — see existing `img()` helper in `projects.ts`).

Demos render inside `DemoViewport` (`src/projects/DemoContext.tsx`) — they have their own scroll container
and overlay layer, so the same component works in the case-study frame and at `/work/<slug>/live`.

## Project structure

```
src/
  config/site.ts         ← personal settings
  data/content.ts        ← page copy
  data/projects.ts       ← projects + case studies
  components/            ← layout, home sections, case-study blocks, UI kit
  pages/                 ← Home, CaseStudy, Live demo, 404
  projects/<slug>/       ← each project's cover + live demo
  three/heroScene.ts     ← hero WebGL scene
  lib/                   ← tiny router, hooks, utils
public/
  images/                ← concept photography + 3D posters
  favicon.svg, apple-touch-icon.png, og-image.png
```

## Deploy

The build output in `dist/` is a static site.

**Vercel** — import the repo, framework "Vite". `vercel.json` already rewrites routes to `index.html`.

**Netlify** — build `npm run build`, publish `dist`. `public/_redirects` handles SPA routes.

**GitHub Pages** (project site at `https://user.github.io/repo/`):

```bash
BASE_PATH=/repo/ npm run build
```

The build also emits `404.html` as an SPA fallback. If your host can't serve that fallback,
use hash URLs instead (`/#/work/ember`):

```bash
BASE_PATH=/repo/ VITE_ROUTER_MODE=hash npm run build
```

After deploying, set `url` in `src/config/site.ts` and rebuild so canonical/OG URLs and the sitemap are absolute.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Three.js · Recharts · Lucide icons ·
self-hosted variable fonts (Space Grotesk, Inter, IBM Plex Mono + per-project typefaces).

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus states, keyboard-operable demos, `prefers-reduced-motion` respected.
- WebGL scenes load lazily and pause off-screen. The hero shows a pre-rendered poster on phones, with reduced motion or without WebGL; the Noiré demo falls back to a still frame if WebGL is unavailable.
- Demos are code-split per project; fonts are self-hosted.

## Honest limitations

- All brands, products, prices, people and data shown in the demos are fictional sample content.
- Aurel's reviews are clearly labelled as placeholder content.
- Concept photography was created with AI image generation and art-directed for each brand.
- Checkout, sign-up and contact flows don't process payments or store data.
