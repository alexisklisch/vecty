import { expect, test } from 'vitest'
import { readFile, writeFile } from 'node:fs/promises'
import Vecty from '@/index'


const montserrat400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat500 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-500-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat600 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-600-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat700 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-700-normal.ttf')
  .then(data => data.arrayBuffer())

test('Lee un jsx y devuelve el SVG', async () => {
  const svg = await readFile(`${__dirname}/square.jsx`, { encoding: 'utf8' })


  const vecty = new Vecty(svg, {
    variables: {
      cuestion: 'La vida es así',
      colors: {
        blues: ['#123123', '#432343']
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
    ]
  })
  await writeFile('template.svg', vecty.svg)
  expect(vecty.svg.startsWith('<svg')).toBe(true)
})
