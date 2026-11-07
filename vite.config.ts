import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { publicPaths, siteUrl } from './src/data/site.ts'
import { pageMetadata, renderPageMetadata } from './src/lib/pageMetadata.ts'

export default defineConfig({
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Cache the reusable engine separately from the portfolio's scene code.
          groups: [
            { name: 'three-core', test: /node_modules[\\/]three[\\/]build[\\/]three\.core\.js$/ },
            {
              name: 'three-renderer',
              test: /node_modules[\\/]three[\\/]build[\\/]three\.module\.js$/,
            },
          ],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'site-metadata',
      transformIndexHtml(html, context) {
        const source = context.originalUrl ?? (context.path === '/index.html' ? '/' : context.path)
        const path = new URL(source, 'http://localhost').pathname
        return renderPageMetadata(html, pageMetadata(path))
      },
      generateBundle: {
        order: 'post',
        handler(_options, bundle) {
          const index = bundle['index.html']
          if (!index || index.type !== 'asset' || typeof index.source !== 'string') {
            throw new Error('Missing compiled index.html for page metadata')
          }
          for (const path of publicPaths.filter((path) => path !== '/')) {
            this.emitFile({
              type: 'asset',
              fileName: `${path.slice(1)}.html`,
              source: renderPageMetadata(index.source, pageMetadata(path)),
            })
          }
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
    },
  ],
})
