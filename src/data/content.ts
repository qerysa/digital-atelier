import type { LucideIcon } from 'lucide-react'
import { Code2, LayoutTemplate, PenTool, Box, Wrench } from 'lucide-react'

export const hero = {
  lines: ['Building digital', 'experiences that', 'make an impact.'],
  /** The word in the headline rendered in the accent colour */
  accentWord: 'impact.',
  intro:
    'I design and build modern websites, intuitive interfaces and motion-driven digital experiences that help brands stand out.',
  labels: ['Design', 'Development', 'Motion', 'Interaction'],
}

export interface Service {
  id: string
  title: string
  summary: string
  description: string
  capabilities: string[]
  icon: LucideIcon
  relatedProject?: string
}

export const services: Service[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    summary: 'Modern, responsive and functional websites tailored to your business.',
    description:
      'From a small business site to a storefront with real frontend logic — built with modern, maintainable code and designed to look sharp on every screen.',
    capabilities: ['Multi-page business websites', 'E-commerce frontends & cart logic', 'React / TypeScript development', 'CMS-ready content structure', 'SEO-friendly, accessible markup'],
    icon: Code2,
    relatedProject: 'ember',
  },
  {
    id: 'landing-pages',
    title: 'Landing Page Development',
    summary: 'High-quality landing pages designed to present your product and guide visitors toward action.',
    description:
      'Focused pages with a clear story, strong visuals and a deliberate path to your call to action — for launches, campaigns and product pages.',
    capabilities: ['Launch & campaign pages', 'Conversion-focused structure', 'Copy layout & visual hierarchy', 'Scroll and reveal animations', 'Form & lead-capture setup'],
    icon: LayoutTemplate,
    relatedProject: 'aurel',
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    summary: 'Intuitive and visually consistent digital interfaces focused on user experience.',
    description:
      'Interfaces that are easy to understand and pleasant to use — from user flows and wireframes to a polished component system and clickable prototypes.',
    capabilities: ['User flows & wireframes', 'Dashboard & SaaS interfaces', 'Design systems & components', 'Interactive prototypes', 'Responsive & accessible UI'],
    icon: PenTool,
    relatedProject: 'pulse',
  },
  {
    id: '3d-motion',
    title: '3D & Motion Design',
    summary: 'Eye-catching 3D visuals, product animations and motion graphics.',
    description:
      'Real-time 3D scenes and motion pieces that make products and brands memorable — rendered directly in the browser or prepared for social and ads.',
    capabilities: ['Interactive 3D (Three.js / WebGL)', 'Product visualisation', 'Motion identity & logo animation', 'Kinetic typography', 'UI micro-interactions'],
    icon: Box,
    relatedProject: 'noire',
  },
  {
    id: 'improvements',
    title: 'Website Improvements',
    summary: 'Responsive fixes, performance improvements, interface refinements and website updates.',
    description:
      'Already have a site? I can make it faster, fix layout issues on mobile, refresh the interface and add the features you are missing.',
    capabilities: ['Responsive & cross-browser fixes', 'Performance optimisation', 'UI refresh & visual polish', 'Accessibility improvements', 'New sections & features'],
    icon: Wrench,
  },
]

export const about = {
  headline: ['Design minds.', 'Code builds.', 'Details matter.'],
  paragraphs: [
    "I'm an independent digital creator working across web development, UI/UX design and motion.",
    'I enjoy turning ideas into polished digital experiences by combining thoughtful design, modern frontend technologies and attention to detail.',
    'My approach is simple: understand the goal, create a clear direction, build with care and deliver within the agreed timeline.',
  ],
  values: ['Clear Communication', 'Attention to Detail', 'Responsive Design', 'Thoughtful Interactions', 'Reliable Delivery'],
  /** Tools actually used to build this website */
  toolkit: ['React', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'Vite', 'Recharts', 'SVG'],
}

export const processSteps = [
  { n: '01', title: 'Discover', text: 'Understanding your goals, requirements and project scope.' },
  { n: '02', title: 'Design', text: 'Creating the visual direction and user experience.' },
  { n: '03', title: 'Develop', text: 'Turning the approved concept into a functional digital product.' },
  { n: '04', title: 'Deliver', text: 'Testing, refining and delivering the project within the agreed timeline.' },
] as const

export const contactCopy = {
  headline: 'Have a project in mind?',
  intro: "Let's turn your idea into something exceptional. Tell me what you're building, and let's discuss how I can help.",
  projectTypes: ['Website Development', 'Landing Page', 'UI/UX Design', '3D & Motion Design', 'Website Improvements', 'Something else'],
  budgets: ['Under $1,000', '$1,000 – $3,000', '$3,000 – $7,500', '$7,500+', 'Not sure yet'],
}
