import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { publicPaths, siteUrl } from './src/data/site.ts'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-metadata',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
        })
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map((path) => `  <url><loc>${new URL(path, siteUrl).href}</loc></url>`).join('\n')}\n</urlset>\n`,
        })
      },
    },
  ],
})
