console.time('testix')
import Vecty from '@/index'
import { XMLBuilder } from './utils/xmlParser/xmlBuilder'

const svg = `
<svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0" />
  <circle cx="100" cy="100" r="50" fill="#ff5733" stroke="#333" stroke-width="3" />
  <text x="50" y="50" font-family="Arial" font-size="24" fill="#333" font-weight="bold">SVG con Texto</text>
  <text x="85" y="105" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle">Hola</text>
  <line x1="150" y1="80" x2="300" y2="80" stroke="#333" stroke-width="2" />
  <text x="200" y="150" font-family="Arial" font-size="18" fill="#0077cc" transform="rotate(-10 200,150)">
    {user.cuestion}
  </text>
  <text vecty:expand vecty:box="150 80 120 100" font-family="Montserrat">¿El cielo reesplandece?</text>
</svg>
`

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