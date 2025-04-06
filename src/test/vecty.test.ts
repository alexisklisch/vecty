import { expect, test } from 'vitest'
import { readFile, writeFile } from 'node:fs/promises'
import Vecty, { fetchBase64 } from '@/index'


const montserrat400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat500 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-500-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat600 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-600-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat700 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-700-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat900 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-900-normal.ttf')
  .then(data => data.arrayBuffer())
const svg = await readFile(`${__dirname}/square.jsx`, { encoding: 'utf8' })
const photo = await fetchBase64('https://dh0ny4gbd8gek.cloudfront.net/properties/ilga43vqfs/img-1?w=1280&format=avif')

test('Lee un jsx y devuelve el SVG', async () => {

  const vecty = new Vecty(svg, {
    variables: {
      publication: {
        operation: {
          currency: 'USD',
          price: 4396399
        }
      },
      features: [
        '5 dormitorios',
        '4 ambientes',
        'cochera',
        '156 m² totales'
      ],
      imgs: {
        photo
      },
      JSON
    },
    fonts: [
      {
        name: 'Montserrat',
        weight: 400,
        src: montserrat400
      },
      {
        name: 'Montserrat',
        weight: 500,
        src: montserrat500
      },
      {
        name: 'Montserrat',
        weight: 600,
        src: montserrat600
      },
      {
        name: 'Montserrat',
        weight: 700,
        src: montserrat700
      },
      {
        name: 'Montserrat',
        weight: 900,
        src: montserrat900
      },
    ]
  })
  await writeFile('template.svg', vecty.svg)
  expect(vecty.svg.startsWith('<svg')).toBe(true)
})
