import { createServer, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { publicPages, publicPaths, siteUrl } from './src/data/site.ts'
import { pageMetadata, renderPageMetadata } from './src/lib/pageMetadata.ts'

export default defineConfig(({ mode }) => ({
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
      name: 'static-pages',
      transformIndexHtml(html, context) {
        const source = context.originalUrl ?? (context.path === '/index.html' ? '/' : context.path)
        const path = new URL(source, 'http://localhost').pathname
        return renderPageMetadata(html, pageMetadata(path))
      },
      generateBundle: {
        order: 'post',
        async handler(_options, bundle) {
          const index = bundle['index.html']
          if (!index || index.type !== 'asset' || typeof index.source !== 'string') {
            throw new Error('Missing compiled index.html for page metadata')
          }
          const renderer = await createServer({
            configFile: false,
            mode,
            logLevel: 'error',
            optimizeDeps: { noDiscovery: true },
            plugins: [react()],
            server: { middlewareMode: true, hmr: false, ws: false },
            appType: 'custom',
          })
          try {
            const { render } = await renderer.ssrLoadModule('/src/entry-server.tsx')
            const shell = index.source
            const renderHtml = async (path: string, template: string) => {
              const markup = render(path)
              if (markup.includes('data-route-loading') || markup.includes('<!--$!-->')) {
                throw new Error(`Incomplete prerender: ${path}`)
              }
              return renderPageMetadata(template, pageMetadata(path))
                .replace('<div id="root">', '<div id="root" data-prerendered>')
                .replace('<!--app-html-->', () => markup)
            }
            for (const { path, component } of publicPages) {
              const styles = new Set<string>()
              const visited = new Set<string>()
              const collectStyles = (name: string) => {
                if (visited.has(name)) return
                visited.add(name)
                const chunk = bundle[name]
                if (chunk?.type !== 'chunk') return
                const metadata = chunk as typeof chunk & {
                  viteMetadata?: { importedCss: Set<string> }
                }
                metadata.viteMetadata?.importedCss.forEach((css) => styles.add(css))
                chunk.imports.forEach(collectStyles)
              }
              const pageChunk = Object.values(bundle).find(
                (chunk) =>
                  chunk.type === 'chunk' &&
                  Object.keys(chunk.modules).some((id) =>
                    id.replaceAll('\\', '/').endsWith(`/components/${component}.tsx`),
                  ),
              )
              if (!pageChunk) throw new Error(`Missing page chunk: ${path}`)
              collectStyles(pageChunk.fileName)
              const pageShell = shell.replace(
                '</head>',
                `${[...styles]
                  .filter((css) => !shell.includes(`/${css}`))
                  .map((css) => `<link rel="stylesheet" href="/${css}">`)
                  .join('\n')}\n</head>`,
              )
              const html = await renderHtml(path, pageShell)
              if (path === '/') index.source = html
              else this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: html })
            }
            this.emitFile({
              type: 'asset',
              fileName: '404.html',
              source: await renderHtml('/404', shell),
            })
          } finally {
            await renderer.close()
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
}))
