console.time('testix')
import { createVecty } from '@/index'
import TextExpandedPlugin from '@vecty/expand-plugin'
import type { VectyConfig } from './vectyTypes'
import type { ElementNode } from '@/utils/xmlParser/commonTypes'
import { VectyPlugin } from './types-vecty/plugins'
import { readFile, readdir, writeFile } from 'node:fs/promises'

/* const candaraFont = await readFile('src/CascadiaCode.ttf')
  .then(nodeBuffer => {
    const { buffer, byteOffset, byteLength } = nodeBuffer
    return buffer.slice(byteOffset, byteOffset + byteLength) as ArrayBuffer
  }) */

const candaraFont = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())

const svg = `
<svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
  <vecty:variables content={{
    texto: "No me digas lo que tengo que hacer, porque si yo te dijera lo que tenés que hacer, sería un problema para todos. Por lo tanto, cuando asevero que la vida es una moneda acuñada sobre los lazos de un ex amante de \\"cameyos\\", hazme caso."
  }} />
  <rect width="800" height="800" fill="lightgray" cosa={template.type || user.type} />
  <plugin:text
    fill="#363636"
    font-family="Candara"
    font-size="32"
    font-weight="400"
    paragraph-gap="16"
    overflow="hidden"
    box={\`\${16 + 16} \${16 + 16} 650 500\`}
  >
    La vida es una lenteja
  </plugin:text>
</svg>`

const vecty = createVecty(svg, {
  variables: {
    type: 'Hermoso'
  },
  plugins: [TextExpandedPlugin],
  fonts: [
    {
      name: 'Candara',
      src: candaraFont,
      weight: 400
    }
  ]

})

writeFile('mi-svg.svg', vecty.svg)

console.timeEnd('testix')