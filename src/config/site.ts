/**
 * ─────────────────────────────────────────────────────────────
 *  DIGITAL ATELIER — personal settings
 *  Everything about you lives here. Edit this file only;
 *  components read from it automatically.
 * ─────────────────────────────────────────────────────────────
 */

export type SocialKey = 'github' | 'linkedin' | 'behance' | 'fiverr' | 'upwork' | 'contra' | 'dribbble'

export interface SiteConfig {
  /** Production URL without trailing slash, e.g. "https://yourname.dev". Enables canonical URLs + sitemap. */
  url: string
  brand: {
    /** Studio / brand name used in the logo and meta tags. */
    name: string
    /** 1–3 characters shown in the logo mark. */
    initials: string
  }
  owner: {
    /** Your public name. Leave empty to present under the brand name only. */
    name: string
    role: string
  }
  /** The small status block in the navigation. */
  status: {
    label: string
    availability: string
    /** false → shows a neutral dot instead of the live "available" pulse. */
    available: boolean
  }
  contact: {
    /**
     * Your public business email. Powers "Copy email", the mailto links and the contact form.
     * While empty, email actions are hidden and the form explains that contact isn't configured yet.
     */
    email: string
    /**
     * Optional form backend (Formspree, Getform, Basin, your own API…) that accepts a JSON POST.
     * When empty, the form prepares a ready-to-send email in the visitor's mail app instead.
     */
    formEndpoint: string
  }
  /** Leave any value empty ('') to hide that link everywhere. */
  socials: Record<SocialKey, string>
  seo: {
    title: string
    description: string
  }
}

export const site: SiteConfig = {
  url: 'https://adorable-caramel-aef8b8.netlify.app/',
  brand: {
    name: 'SkutinDigital',
    initials: 'SD',
  },
  owner: {
    name: 'Dmitrii',
    role: 'Web Developer · UI/UX Designer · Motion Designer',
  },
  status: {
    label: 'Independent digital creator',
    availability: 'Available for projects',
    available: true,
  },
  contact: {
    email: 'skutindigital@gmail.com',
    formEndpoint: '',
  },
  socials: {
    github: '',
    linkedin: '',
    behance: '',
    fiverr: '',
    upwork: '',
    contra: '',
    dribbble: '',
  },
  seo: {
    title: 'Digital Atelier — Web Development, UI/UX & Motion Design',
    description:
      'Independent web developer and designer crafting modern websites, intuitive interfaces and motion-driven digital experiences that help brands stand out.',
  },
}

export const socialLabels: Record<SocialKey, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  behance: 'Behance',
  fiverr: 'Fiverr',
  upwork: 'Upwork',
  contra: 'Contra',
  dribbble: 'Dribbble',
}

/** Only the links you actually filled in. */
export const activeSocials = (Object.keys(site.socials) as SocialKey[])
  .filter((k) => site.socials[k].trim() !== '')
  .map((k) => ({ key: k, label: socialLabels[k], href: site.socials[k].trim() }))

export const contactEmail = site.contact.email.trim()
export const hasEmail = contactEmail.length > 0
export const hasFormEndpoint = site.contact.formEndpoint.trim().length > 0
export const displayName = site.owner.name.trim() || site.brand.name
