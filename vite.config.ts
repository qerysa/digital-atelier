import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { site } from './src/config/site'
import { projects } from './src/data/projects'

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Injects SEO / Open Graph tags from `src/config/site.ts` (single source of truth)
 * and emits static-hosting helpers: robots.txt, sitemap.xml (when site.url is set)
 * and 404.html (SPA fallback for GitHub Pages).
 */
function siteMeta(): Plugin {
  const base = site.url.replace(/\/$/, '')
  const abs = (p: string) => (base ? `${base}${p}` : p)
  return {
    name: 'digital-atelier-site-meta',
    transformIndexHtml(html) {
      return html
        .replace(/%SITE_TITLE%/g, escapeHtml(site.seo.title))
        .replace(/%SITE_DESCRIPTION%/g, escapeHtml(site.seo.description))
        .replace(/%SITE_NAME%/g, escapeHtml(site.brand.name))
        .replace(/%SITE_URL%/g, escapeHtml(base || '/'))
        .replace(/%OG_IMAGE%/g, escapeHtml(abs('/og-image.png')))
        .replace(/%THEME_COLOR%/g, '#0B0D10')
    },
    generateBundle(_, bundle) {
      const routes = ['/', ...projects.map((p) => `/work/${p.slug}`)]
      const robots = ['User-agent: *', 'Allow: /']
      if (base) {
        robots.push(`Sitemap: ${base}/sitemap.xml`)
        const urls = routes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join('\n')
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        })
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })
      const index = bundle['index.html']
      if (index && index.type === 'asset') {
        this.emitFile({ type: 'asset', fileName: '404.html', source: index.source })
      }
    },
  }
}

export default defineConfig({
  // Set BASE_PATH=/repo-name/ when deploying to a sub-folder (e.g. GitHub Pages project sites).
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
})
