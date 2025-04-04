console.time('testix')
import Vecty from '@/index'
import { readFile } from 'node:fs/promises'

const svg = await readFile('./temp.jsx', { encoding: 'utf8' })
console.log(svg)

const montserrat400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())

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
    }
  ]
})

console.log(vecty.svg)

console.timeEnd('testix')