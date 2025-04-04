import { expect, test } from 'vitest'
import { readFile } from 'node:fs/promises'
import Vecty from '@/index'


const montserrat400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat500 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-500-normal.ttf')
  .then(data => data.arrayBuffer())

test('Lee un jsx y devuelve el SVG', async () => {
  const svg = await readFile(`${__dirname}/square.jsx`, { encoding: 'utf8' })


  const vecty = new Vecty(svg, {
    variables: {
      cuestion: 'La vida es así',
      colors: {
        red: '#423423',
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
    ]
  })
  console.log(vecty.svg)
  expect(vecty.svg.startsWith('<svg')).toBe(true)
})
