/**
 * Project catalogue.
 * To add a project: append an entry here. Optionally register a custom cover /
 * live demo in `src/projects/registry.ts` — otherwise the cover image is used.
 */

export interface ResponsiveImage {
  src: string
  srcSet?: string
  alt: string
  width: number
  height: number
}

export interface ProjectTheme {
  /** Case-study page background */
  bg: string
  /** Raised surfaces on the case-study page */
  surface: string
  /** Primary text */
  fg: string
  /** Secondary text (contrast-checked against bg) */
  muted: string
  /** Project accent */
  accent: string
  /** Text colour to use on top of the accent */
  onAccent: string
  /** Hairlines / borders */
  line: string
  scheme: 'dark' | 'light'
}

export interface Swatch {
  name: string
  hex: string
}

export interface TypeSpec {
  role: string
  family: string
  /** CSS font-family stack used to render the specimen */
  css: string
  sample: string
  weight?: number
}

export interface Project {
  slug: string
  index: string
  title: string
  category: string
  type: string
  description: string
  year: string
  /** Technologies genuinely used to build the concept */
  tags: string[]
  theme: ProjectTheme
  cover?: ResponsiveImage
  caseStudy: {
    tagline: string
    overview: string
    deliverables: string[]
    role: string
    challenge: { summary: string; points: string[] }
    direction: {
      summary: string
      palette: Swatch[]
      typography: TypeSpec[]
      principles: string[]
    }
    process: { title: string; text: string }[]
    features: { title: string; text: string }[]
    finalNote: string
    tools: { name: string; purpose: string }[]
  }
  demo: {
    /** Label shown above the embedded live demo */
    label: string
    frame: 'browser' | 'stage'
    hint: string
    /** Optional Tailwind aspect classes for stage frames (default: 4/5 mobile, 16/9 desktop) */
    aspect?: string
  }
}

const img = (name: string, widths: [number, number], ratio: number, alt: string): ResponsiveImage => ({
  src: `/images/${name}-${widths[0]}.webp`,
  srcSet: `/images/${name}-${widths[1]}.webp ${widths[1]}w, /images/${name}-${widths[0]}.webp ${widths[0]}w`,
  alt,
  width: widths[0],
  height: Math.round(widths[0] * ratio),
})

export const projects: Project[] = [
  {
    slug: 'ember',
    index: '01',
    title: 'Ember',
    category: 'Website Development',
    type: 'Specialty coffee e-commerce',
    description:
      'A responsive digital storefront for a specialty coffee brand, featuring an editorial product catalogue, an interactive shopping cart and a streamlined ordering experience.',
    year: '2026',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    theme: {
      bg: '#17100B',
      surface: '#241912',
      fg: '#F3E9DC',
      muted: '#B8A390',
      accent: '#E0703F',
      onAccent: '#17100B',
      line: 'rgba(243,233,220,0.14)',
      scheme: 'dark',
    },
    cover: img('ember-hero', [1600, 960], 1067 / 1600, 'Ceramic cup of black coffee on a walnut table in warm window light'),
    caseStudy: {
      tagline: 'A warm, editorial storefront for slow-roasted specialty coffee.',
      overview:
        'Ember is a self-initiated concept for an independent roaster selling single-origin beans online. The goal was a storefront that feels as considered as the coffee itself — editorial and atmospheric — while keeping the path from discovery to checkout short and familiar.',
      deliverables: ['Home', 'Shop', 'Product details', 'About', 'Cart'],
      role: 'Concept, UI design, frontend development',
      challenge: {
        summary:
          'Specialty coffee is chosen on story and detail — origin, process, tasting notes — yet too much information slows shopping down. The storefront had to carry rich detail without ever hiding the next step.',
        points: [
          'Present origin and tasting detail without burying the “Add to cart” action.',
          'Make roast level and flavour easy to compare across the whole catalogue.',
          'Keep cart logic transparent: quantities, removal, shipping threshold and totals update instantly.',
          'Feel just as premium and usable on a phone as on a large display.',
        ],
      },
      direction: {
        summary:
          'Warm editorial: espresso darks and roasted-cream lights, a soft optical serif for headlines and generous photography. Each coffee has its own colour-coded pouch, so the catalogue reads like a curated shelf rather than a spreadsheet.',
        palette: [
          { name: 'Espresso', hex: '#1E140F' },
          { name: 'Roast', hex: '#4A2E1F' },
          { name: 'Terracotta', hex: '#C4552D' },
          { name: 'Amber', hex: '#E39A4F' },
          { name: 'Crema', hex: '#F3E9DC' },
        ],
        typography: [
          { role: 'Display', family: 'Fraunces', css: "'Fraunces Variable', Georgia, serif", sample: 'Slow-roasted.', weight: 500 },
          { role: 'Interface', family: 'Inter', css: "'Inter Variable', system-ui, sans-serif", sample: 'Add to cart — $18.00', weight: 500 },
        ],
        principles: ['Photography leads, interface follows', 'One primary action per view', 'Colour-coded products for quick scanning'],
      },
      process: [
        {
          title: 'Structure first',
          text: 'Mapped the five pages and a single shared cart state before any visual design, so every page could add, read or change the cart through the same logic.',
        },
        {
          title: 'A parametric packaging system',
          text: 'Designed one SVG pouch component that renders six colourways, labels and roast indicators directly from product data — new coffees need no new artwork.',
        },
        {
          title: 'Commerce logic',
          text: 'Built a typed cart reducer (add, update quantity, remove, clear) persisted to local storage, with subtotal, shipping threshold and total derived from state.',
        },
        {
          title: 'Motion and polish',
          text: 'Added scroll reveals, gentle image parallax, add-to-cart confirmations and a responsive navigation drawer, all respecting reduced-motion settings.',
        },
      ],
      features: [
        { title: 'Editorial catalogue', text: 'Filter by roast level and sort by price or name, with instant visual feedback.' },
        { title: 'Configurable products', text: 'Bag size and grind options update the price before the item is added.' },
        { title: 'Persistent cart', text: 'Quantity steppers, item removal and totals that survive a page reload.' },
        { title: 'Shipping progress', text: 'A live indicator shows how far the order is from the free-shipping threshold.' },
        { title: 'Honest checkout', text: 'A clear demo summary instead of a fake payment step — no data leaves the browser.' },
        { title: 'Responsive navigation', text: 'Compact header on desktop, accessible slide-in menu on mobile.' },
      ],
      finalNote:
        'The live demo below is the actual storefront. Browse the shop, open a product, change the options and build a cart — everything runs in the browser.',
      tools: [
        { name: 'React', purpose: 'Pages, components and cart state' },
        { name: 'TypeScript', purpose: 'Typed product and cart models' },
        { name: 'Tailwind CSS', purpose: 'Design tokens and responsive layout' },
        { name: 'Framer Motion', purpose: 'Page transitions and reveals' },
        { name: 'SVG', purpose: 'Parametric packaging artwork' },
        { name: 'AI image generation', purpose: 'Art-directed concept photography' },
      ],
    },
    demo: { label: 'Live storefront', frame: 'browser', hint: 'Try: Shop → open a coffee → choose size → add to cart' },
  },
  {
    slug: 'aurel',
    index: '02',
    title: 'Aurel',
    category: 'Landing Page Design',
    type: 'Premium skincare launch page',
    description:
      'A conversion-focused product launch page designed to present a premium skincare line through elegant visuals, clear messaging and a seamless customer journey.',
    year: '2026',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    theme: {
      bg: '#EEE6DA',
      surface: '#F7F2EA',
      fg: '#2A2623',
      muted: '#655B50',
      accent: '#9A7442',
      onAccent: '#FBF8F2',
      line: 'rgba(42,38,35,0.14)',
      scheme: 'light',
    },
    cover: img('aurel-hero', [1600, 960], 1067 / 1600, 'Frosted serum bottle with a gold dropper on a travertine plinth'),
    caseStudy: {
      tagline: 'A quiet, conversion-focused launch page for a premium skincare line.',
      overview:
        'Aurel is a concept launch page for a minimalist skincare brand introducing its first collection. The page has one job: present the hero serum, earn trust through clarity and guide visitors toward the collection — calmly, without pressure.',
      deliverables: ['Hero', 'Brand story', 'Benefits', 'Ingredients', 'Featured products', 'Reviews', 'FAQ', 'Final CTA'],
      role: 'Concept, art direction, landing page design & build',
      challenge: {
        summary:
          'Luxury pages often trade clarity for mood. The challenge was to keep a calm, premium atmosphere while making benefits, ingredients and the next step instantly scannable.',
        points: [
          'Build a clear narrative from first impression to purchase decision.',
          'Explain ingredients visually instead of with a wall of text.',
          'Answer common objections (FAQ) before they turn into exits.',
          'End every section with an obvious, low-friction next step.',
        ],
      },
      direction: {
        summary:
          'Warm beige, milk and soft gold with graphite type. A refined serif carries the brand voice; a neutral sans keeps details legible. Sharp natural shadows and slow, soft motion create a sense of quiet confidence.',
        palette: [
          { name: 'Sand', hex: '#E3D6C4' },
          { name: 'Milk', hex: '#F7F3EC' },
          { name: 'Soft Gold', hex: '#B8925A' },
          { name: 'Clay', hex: '#8C6E52' },
          { name: 'Graphite', hex: '#2B2826' },
        ],
        typography: [
          { role: 'Display', family: 'Cormorant Garamond', css: "'Cormorant Garamond', Georgia, serif", sample: 'Skin, quietly restored.', weight: 500 },
          { role: 'Body', family: 'Inter', css: "'Inter Variable', system-ui, sans-serif", sample: 'Squalane · Oat lipids · Chamomile', weight: 400 },
        ],
        principles: ['Whitespace as a luxury signal', 'Product always in view', 'Soft motion, sharp shadows'],
      },
      process: [
        {
          title: 'Narrative wireframe',
          text: 'Ordered the eight sections as a decision journey: desire → trust → understanding → proof → reassurance → action.',
        },
        {
          title: 'Art direction',
          text: 'Defined a consistent photographic language — travertine, warm beige backdrops, botanical shadows — and generated concept imagery to match it.',
        },
        {
          title: 'Interaction design',
          text: 'Turned the ingredient flat-lay into an interactive map and kept every interaction reachable by keyboard.',
        },
        {
          title: 'Responsive build',
          text: 'Composed the layout mobile-first; the hero, product grid and ingredient map each have a dedicated small-screen arrangement.',
        },
      ],
      features: [
        { title: 'Staged hero reveal', text: 'Headline, product and call to action enter in a deliberate sequence.' },
        { title: 'Ingredient map', text: 'Hotspots on the flat-lay reveal what each ingredient does.' },
        { title: 'Featured products', text: 'Hover detail and an add-to-bag interaction with a live bag counter.' },
        { title: 'Review carousel', text: 'Built for real testimonials; currently shows clearly marked sample content.' },
        { title: 'Accessible FAQ', text: 'Keyboard-friendly accordion with proper ARIA states.' },
        { title: 'Validated sign-up', text: 'Email field with inline validation; nothing is stored in this demo.' },
      ],
      finalNote:
        'The full landing page runs below. Scroll inside the frame, explore the ingredient map and try the FAQ — or open it full screen.',
      tools: [
        { name: 'React', purpose: 'Section components and interactions' },
        { name: 'TypeScript', purpose: 'Typed content model' },
        { name: 'Tailwind CSS', purpose: 'Layout and responsive styling' },
        { name: 'Framer Motion', purpose: 'Reveals, carousel and accordion motion' },
        { name: 'AI image generation', purpose: 'Art-directed concept photography' },
      ],
    },
    demo: { label: 'Live landing page', frame: 'browser', hint: 'Scroll inside the frame · tap the ingredient hotspots' },
  },
  {
    slug: 'pulse',
    index: '03',
    title: 'Pulse',
    category: 'UI/UX Design',
    type: 'SaaS project & analytics dashboard',
    description:
      'A clean, intuitive SaaS dashboard concept designed to simplify project management, visualize performance and make complex information easier to understand.',
    year: '2026',
    tags: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'],
    theme: {
      bg: '#0E1015',
      surface: '#161922',
      fg: '#E9EBF2',
      muted: '#959AAB',
      accent: '#8B8BFF',
      onAccent: '#0E1015',
      line: 'rgba(233,235,242,0.12)',
      scheme: 'dark',
    },
    caseStudy: {
      tagline: 'A calm SaaS dashboard that turns project noise into clear signals.',
      overview:
        'Pulse is a concept for a project-management and analytics platform for small product teams. It brings projects, tasks, team workload and performance into one interface that answers the question every lead asks on Monday morning: what needs my attention?',
      deliverables: ['Overview', 'Projects', 'Tasks', 'Analytics', 'Team', 'Settings'],
      role: 'Product thinking, UI/UX design, interactive prototype',
      challenge: {
        summary:
          'Dashboards fail when every number competes for attention. The challenge was to design a clear hierarchy where the most important information surfaces first and every view stays fast to scan.',
        points: [
          'Establish a visual hierarchy: status first, detail on demand.',
          'Make filtering and status changes feel instant and reversible.',
          'Keep charts readable at a glance with direct labels and restrained colour.',
          'Support light and dark themes, and remain usable on tablets and phones.',
        ],
      },
      direction: {
        summary:
          'Neutral surfaces with a single iris accent; mint, amber and coral are reserved strictly for status. Inter with tabular figures keeps numbers aligned, and an 8-point grid keeps density comfortable.',
        palette: [
          { name: 'Ink', hex: '#0E1015' },
          { name: 'Slate', hex: '#1E2230' },
          { name: 'Iris', hex: '#8B8BFF' },
          { name: 'Mint', hex: '#3DD6A5' },
          { name: 'Amber', hex: '#F5B544' },
        ],
        typography: [
          { role: 'Interface', family: 'Inter', css: "'Inter Variable', system-ui, sans-serif", sample: '87% on track', weight: 600 },
          { role: 'Data', family: 'IBM Plex Mono', css: "'IBM Plex Mono', ui-monospace, monospace", sample: 'TSK-1042 · Due Fri', weight: 400 },
        ],
        principles: ['Status before detail', 'One accent, semantic colours only', 'Every view filterable in one click'],
      },
      process: [
        {
          title: 'Information architecture',
          text: 'Grouped the product into six sections and defined what each must answer, from “Are we on track?” to “Who is overloaded?”.',
        },
        {
          title: 'Component system',
          text: 'Designed reusable KPI cards, status badges, table rows, progress bars and chart containers that work on both light and dark surfaces.',
        },
        {
          title: 'One source of truth',
          text: 'A single task store drives the table, KPIs and charts — change a status and every view updates immediately.',
        },
        {
          title: 'Responsive behaviour',
          text: 'The sidebar collapses into a drawer, tables become scrollable regions and charts resize fluidly.',
        },
      ],
      features: [
        { title: 'Six working sections', text: 'Overview, Projects, Tasks, Analytics, Team and Settings with real navigation.' },
        { title: 'Live KPIs', text: 'Metrics are calculated from the demo data, not hard-coded.' },
        { title: 'Task management', text: 'Search, filter by status, priority and assignee, and change status inline.' },
        { title: 'Connected charts', text: 'Charts react to task changes and to the selected time range.' },
        { title: 'Light & dark themes', text: 'A theme switch with contrast-checked palettes for both.' },
        { title: 'Responsive layout', text: 'Comfortable on desktop, tablet and phone.' },
      ],
      finalNote:
        'This is the working prototype. Switch sections in the sidebar, filter tasks, change a status and watch the overview update.',
      tools: [
        { name: 'React', purpose: 'Application shell, views and shared state' },
        { name: 'TypeScript', purpose: 'Typed data model for tasks, projects and people' },
        { name: 'Recharts', purpose: 'Area, bar and donut charts' },
        { name: 'Tailwind CSS', purpose: 'Theme tokens and responsive grid' },
        { name: 'Lucide', purpose: 'Interface icons' },
      ],
    },
    demo: { label: 'Interactive prototype', frame: 'browser', hint: 'Try: Tasks → change a status → back to Overview' },
  },
  {
    slug: 'noire',
    index: '04',
    title: 'Noiré',
    category: '3D Animation',
    type: 'Real-time 3D fragrance film',
    description:
      'A cinematic 3D product study exploring glass materials, liquid reflections, dramatic lighting and smooth camera movement for a premium fragrance concept.',
    year: '2026',
    tags: ['Three.js', 'WebGL', 'React', 'TypeScript'],
    theme: {
      bg: '#070607',
      surface: '#131114',
      fg: '#EEE6D8',
      muted: '#9C958B',
      accent: '#D2A867',
      onAccent: '#070607',
      line: 'rgba(238,230,216,0.12)',
      scheme: 'dark',
    },
    cover: {
      src: '/images/noire-poster-1600.webp',
      srcSet: '/images/noire-poster-960.webp 960w, /images/noire-poster-1600.webp 1600w',
      alt: 'Glass perfume bottle with amber liquid and gold cap, rendered in real-time 3D',
      width: 1600,
      height: 1000,
    },
    caseStudy: {
      tagline: 'A cinematic, real-time study of glass, liquid and light.',
      overview:
        'Noiré is a 3D product film for a fictional fragrance — rendered live in the browser with Three.js instead of exported as video. Because the scene is real time, visitors can pause it, change the lighting mood and turn the bottle in their hands.',
      deliverables: ['Real-time 3D scene', 'Camera & lighting timeline', 'Typography sequence', 'Interactive mode'],
      role: '3D design, lighting, animation, WebGL development',
      challenge: {
        summary:
          'Glass is one of the hardest materials to render convincingly in real time. Transmission, refraction and reflections had to look premium while the scene stayed smooth on an ordinary laptop.',
        points: [
          'Achieve believable glass, liquid and metal using physically based materials.',
          'Sequence camera, light and typography like a commercial.',
          'Allow interaction without breaking the cinematic mood.',
          'Scale quality to the device and stop rendering when off-screen.',
        ],
      },
      direction: {
        summary:
          'A near-black stage, amber liquid and brushed gold. A high-contrast didone for the wordmark, wide-tracked captions and a slow, deliberate camera — luxury expressed through restraint.',
        palette: [
          { name: 'Obsidian', hex: '#070607' },
          { name: 'Smoke', hex: '#2A2528' },
          { name: 'Amber', hex: '#B5621E' },
          { name: 'Gold', hex: '#D2A867' },
          { name: 'Ivory', hex: '#EEE6D8' },
        ],
        typography: [
          { role: 'Wordmark', family: 'Bodoni Moda', css: "'Bodoni Moda Variable', Didot, serif", sample: 'Noiré', weight: 500 },
          { role: 'Captions', family: 'IBM Plex Mono', css: "'IBM Plex Mono', ui-monospace, monospace", sample: 'EAU DE PARFUM — 50 ML', weight: 400 },
        ],
        principles: ['Light reveals form', 'Slow camera, precise timing', 'Interaction as an invitation'],
      },
      process: [
        {
          title: 'Procedural modelling',
          text: 'The bottle, liquid, collar and cap are built from code — rounded boxes, cylinders and lathe profiles — so the scene loads without any external model files.',
        },
        {
          title: 'Physical materials',
          text: 'Glass uses transmission, thickness and index of refraction; the liquid uses attenuation colour; the cap is brushed metal with clearcoat.',
        },
        {
          title: 'Lighting',
          text: 'A procedural studio environment provides reflections, while animated key, rim and fill lights sculpt the bottle across three lighting moods.',
        },
        {
          title: 'Direction',
          text: 'A 24-second timeline drives the camera path, light intensities and typography cues, then loops into the final composition.',
        },
      ],
      features: [
        { title: 'Real-time glass & liquid', text: 'Refraction and reflections computed live in WebGL.' },
        { title: 'Directed camera', text: 'Eased dolly, orbit and close-up moves on a timeline.' },
        { title: 'Three lighting moods', text: 'Amber, Midnight and Gold — switchable at any moment.' },
        { title: 'Hands-on mode', text: 'Drag to rotate the bottle with inertia; release to resume the film.' },
        { title: 'Playback controls', text: 'Play, pause and replay the sequence.' },
        { title: 'Adaptive performance', text: 'Resolution scales to the device; rendering pauses off-screen.' },
      ],
      finalNote:
        'The scene below is live WebGL. Drag the bottle, switch the lighting mood or pause the film.',
      tools: [
        { name: 'Three.js', purpose: 'Scene, physical materials, lighting and rendering' },
        { name: 'WebGL', purpose: 'GPU rendering in the browser' },
        { name: 'React', purpose: 'Player UI and lifecycle' },
        { name: 'TypeScript', purpose: 'Typed timeline and scene configuration' },
      ],
    },
    demo: { label: 'Real-time 3D film', frame: 'stage', hint: 'Drag to rotate · switch lighting mood · pause' },
  },
  {
    slug: 'signal',
    index: '05',
    title: 'Signal',
    category: 'Motion Graphics',
    type: 'Motion identity for a digital festival',
    description:
      'A bold motion identity concept for a digital culture festival, combining expressive typography, geometric transitions and rhythm-driven graphic animations.',
    year: '2026',
    tags: ['React', 'TypeScript', 'SVG', 'Motion'],
    theme: {
      bg: '#0A0A14',
      surface: '#14142A',
      fg: '#F4F1EA',
      muted: '#A5A3B8',
      accent: '#3D4BFF',
      onAccent: '#F4F1EA',
      line: 'rgba(244,241,234,0.14)',
      scheme: 'dark',
    },
    caseStudy: {
      tagline: 'A motion identity that moves like music.',
      overview:
        'Signal is a concept identity for a fictional digital culture festival, designed motion-first. The logo, typography and shapes are a system of animated parts that can be recombined for stage screens, social formats and the web.',
      deliverables: ['Logo reveal', 'Kinetic typography', 'Shape transitions', 'Animated brand elements', 'Seamless loop'],
      role: 'Identity concept, motion design, animation engineering',
      challenge: {
        summary:
          'Festival identities live on every kind of screen. The system had to be recognisable in any single frame, yet constantly varied in motion — and loop seamlessly.',
        points: [
          'A logo that works both animated and as a still frame.',
          'Typography that is expressive but stays readable at speed.',
          'A simple shape language that can carry rhythm on its own.',
          'Five chapters that flow into one seamless loop.',
        ],
      },
      direction: {
        summary:
          'Cobalt, blush, paper and ink. A variable grotesque with a width axis lets words stretch and compress with the rhythm, while circle, square and triangle act as visual beats.',
        palette: [
          { name: 'Cobalt', hex: '#3D4BFF' },
          { name: 'Blush', hex: '#FFB8DA' },
          { name: 'Paper', hex: '#F4F1EA' },
          { name: 'Ink', hex: '#0A0A14' },
          { name: 'Volt', hex: '#FF6B3D' },
        ],
        typography: [
          { role: 'Kinetic display', family: 'Archivo (variable width)', css: "'Archivo Variable', system-ui, sans-serif", sample: 'SIGNAL', weight: 800 },
          { role: 'Information', family: 'IBM Plex Mono', css: "'IBM Plex Mono', ui-monospace, monospace", sample: 'CH.03 — SHAPE', weight: 400 },
        ],
        principles: ['Rhythm over decoration', 'Every frame is a poster', 'Width as expression'],
      },
      process: [
        {
          title: 'Identity system',
          text: 'Defined the mark (a broadcasting pulse), the colour pairs and three primitive shapes as the building blocks of every scene.',
        },
        {
          title: 'Timeline engine',
          text: 'Built a deterministic timeline: one clock drives every element, so play, pause and scrubbing are frame-exact.',
        },
        {
          title: 'Five chapters',
          text: 'Logo reveal, kinetic type, shape transitions, brand elements and a loop chapter that returns to frame one without a cut.',
        },
        {
          title: 'Resolution-independent output',
          text: 'Everything renders as SVG with variable-font typography — crisp on any screen and light to load.',
        },
      ],
      features: [
        { title: 'Logo reveal', text: 'The pulse mark draws itself before the wordmark rises into place.' },
        { title: 'Kinetic typography', text: 'Words stretch along the font’s width axis in time with the beat.' },
        { title: 'Shape transitions', text: 'Circle, square and triangle morph into each other.' },
        { title: 'Brand elements', text: 'Tickers, waveforms and pattern tiles built from the same system.' },
        { title: 'Seamless loop', text: 'A 20-second piece with no visible cut between end and start.' },
        { title: 'Full playback control', text: 'Play/pause, scrubbing, chapter jumps and keyboard shortcuts.' },
      ],
      finalNote:
        'The motion piece below is rendered live. Pause it, scrub the timeline or jump between chapters — every frame is a poster.',
      tools: [
        { name: 'React', purpose: 'Scene composition and player UI' },
        { name: 'TypeScript', purpose: 'Typed timeline and easing functions' },
        { name: 'SVG', purpose: 'Resolution-independent graphics' },
        { name: 'requestAnimationFrame', purpose: 'Custom deterministic animation clock' },
        { name: 'Variable fonts', purpose: 'Width-axis kinetic typography' },
      ],
    },
    demo: {
      label: 'Motion piece',
      frame: 'stage',
      hint: 'Space to play/pause · drag the timeline · jump to chapters',
      aspect: 'aspect-[3/5] sm:aspect-[4/3] lg:aspect-[16/10]',
    },
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
