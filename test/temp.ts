/* console.time('testix')
import { createVecty } from '@/index'
import TextExpandedPlugin from '@vecty/expand-plugin'
import type { VectyConfig } from './vectyTypes'
import type { ElementNode } from '@/utils/xmlParser/commonTypes'
import { readFile, writeFile } from 'node:fs/promises'
import { fetchBase64 } from './utils/fetchBase64'

const image = await fetchBase64('https://images.pexels.com/photos/3288104/pexels-photo-3288104.png')
const rubik400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())
const rubik500 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-500-normal.ttf')
  .then(data => data.arrayBuffer())
const rubik600 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-600-normal.ttf')
  .then(data => data.arrayBuffer())
const rubik700 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-700-normal.ttf')
  .then(data => data.arrayBuffer())
const rubik800 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-800-normal.ttf')
  .then(data => data.arrayBuffer())
const rubik900 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-900-normal.ttf')
  .then(data => data.arrayBuffer())

const svg = await readFile('./src/test/square.jsx', { encoding: 'utf-8' })
const flyersLogoRaw = await readFile('./src/test/logo-flyers.png', { encoding: 'base64' })
const flyerLogo = `data:image/png;base64,${flyersLogoRaw}`

const vecty = createVecty(svg, {
  variables: {
    imgs: {
      property: [
        image
      ],
      brand: {
        flyers: flyerLogo
      }
    },
    text: {
      features: [
        'La vida es 2',
        '4 ambientes',
        '8 cocheras',
        'Vida nueva'
      ],
      typology: 'Departamento',
      operation: {
        price: '$ 1.000.000',
        type: 'Venta'
      }
    }
  },
  plugins: [TextExpandedPlugin],
  fonts: [

    {
      name: 'Rubik',
      src: rubik400,
      weight: 400
    },
    {
      name: 'Rubik',
      src: rubik500,
      weight: 500
    },
    {
      name: 'Rubik',
      src: rubik600,
      weight: 600
    },
    {
      name: 'Rubik',
      src: rubik700,
      weight: 700
    },
    {
      name: 'Rubik',
      src: rubik800,
      weight: 800
    },
    {
      name: 'Rubik',
      src: rubik900,
      weight: 900
    }
  ]

})

writeFile('dox.svg', vecty.svg)

console.timeEnd('testix') */

import { createVecty } from '../src/index'

const xml = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width={$assign({screen: "1920", story: "1080"}, "800")}
  height={$assign({story: "1920", tabloid: "3085"}, "800")}
>
<vecty:variants content={['square', 'story', 'a4', 'tabloid', 'screen']} />
<vecty:variables content={{
  color: $assign({square: 'red-pasioooon'}, "green-locooo")
}}/>
<text x="10" y="20" font-size="16" fill={$assign({}, "Red")}>{}</text>
<circle cx="50" cy={$assign({square: 43}, 88888)} r="40" stroke={template.color} stroke-width="2" fill="red"/>
<rect x="10" y="10" width="30" height="30" fill={template.color}/>
</svg>`
const vecty = createVecty(xml, {
  variables: {
    text: "Buenos días",
    String
  },
})
console.log(vecty.svgs())