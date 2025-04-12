console.time('testix')
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

const vecty = createVecty(svg, {
  variables: {
    imgs: {
      property: [
        image
      ]
    },
    text: {
      features: [
        'La vida es 2',
        '4 ambientes',
        '8 cocheras',
        'Vida nueva'
      ]
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

console.timeEnd('testix')