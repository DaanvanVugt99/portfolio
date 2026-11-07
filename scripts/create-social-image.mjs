import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { Resvg } from '@resvg/resvg-js'

// Reuse the landing page's local typeface; outline text so the exported image needs no fonts.
const font = JSON.parse(
  await readFile(
    new URL('../public/fonts/space-grotesk-bold.typeface.json', import.meta.url),
    'utf8',
  ),
)
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
const mark = (await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8')).replace(
  '<svg ',
  '<svg x="66" y="58" width="54" height="54" ',
)

function lettering(text, x, baseline, size, fill) {
  const scale = size / font.resolution
  let cursor = 0
  const paths = [...text].map((character) => {
    const glyph = font.glyphs[character]
    if (!glyph) throw new Error(`Missing glyph: ${character}`)
    const tokens = glyph.o?.trim().split(/\s+/).filter(Boolean) ?? []
    const commands = []
    for (let i = 0; i < tokens.length;) {
      const command = tokens[i++]
      if (command === 'm' || command === 'l') {
        commands.push(`${command.toUpperCase()}${Number(tokens[i++]) + cursor} ${tokens[i++]}`)
      } else if (command === 'q' || command === 'b') {
        const end = [Number(tokens[i++]) + cursor, tokens[i++]]
        const first = [Number(tokens[i++]) + cursor, tokens[i++]]
        const second = command === 'b' ? [Number(tokens[i++]) + cursor, tokens[i++]] : []
        commands.push(`${command === 'q' ? 'Q' : 'C'}${[...first, ...second, ...end].join(' ')}`)
      } else {
        throw new Error(`Unknown outline command: ${command}`)
      }
    }
    cursor += glyph.ha
    return commands.join(' ')
  })
  return `<g aria-label="${escape(text)}" transform="translate(${x} ${baseline}) scale(${scale} ${-scale})" fill="${fill}"><path d="${paths.join(' ')}"/></g>`
}

const name = lettering('Daan van Vugt', 66, 317, 148, 'url(#face)')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title description">
  <title id="title">Daan van Vugt — Software developer</title>
  <desc id="description">Large blue lettering on white. Fullstack and backend development. daanvanvugt.com.</desc>
  <defs>
    <linearGradient id="face" x2="0" y2="1"><stop stop-color="#5475f5"/><stop offset="1" stop-color="#294cde"/></linearGradient>
    <filter id="shadow" x="-20%" y="-50%" width="150%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
  </defs>
  <path fill="#fff" d="M0 0H1200V630H0z"/>
  ${mark}
  <g opacity=".13" filter="url(#shadow)" transform="translate(3 21)">${name}</g>
  <g transform="translate(0 10)">${name.replace('url(#face)', '#203cae')}</g>
  <g transform="translate(0 6)">${name.replace('url(#face)', '#2942bc')}</g>
  ${name}
  ${lettering('Software developer', 69, 421, 32, '#202637')}
  ${lettering('Fullstack and backend development', 69, 464, 22, '#677087')}
  <path d="M69 535H1131" stroke="#e4e8f3"/>
  ${lettering('daanvanvugt.com', 69, 581, 22, '#294cde')}
  <path d="M1093 570h34m-12-12 12 12-12 12" fill="none" stroke="#294cde" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const directory = new URL('../public/social/', import.meta.url)
await mkdir(directory, { recursive: true })
await writeFile(new URL('portfolio.svg', directory), svg)
await writeFile(new URL('portfolio.png', directory), new Resvg(svg).render().asPng())
console.log('Created public/social/portfolio.svg and portfolio.png (1200 × 630).')
