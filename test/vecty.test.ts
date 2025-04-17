import { expect, test } from 'vitest'
import { readFile, writeFile } from 'node:fs/promises'
import Vecty from '@/index'

const montserrat400 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-400-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat500 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-500-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat600 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-600-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat700 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-700-normal.ttf')
  .then(data => data.arrayBuffer())
const montserrat900 = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/rubik@latest/latin-900-normal.ttf')
  .then(data => data.arrayBuffer())
const svg = await readFile(`${__dirname}/square.jsx`, { encoding: 'utf8' })
const photo = await fetchBase64('https://dh0ny4gbd8gek.cloudfront.net/properties/ilga43vqfs/img-1?w=1280&format=avif')

test('Lee un jsx y devuelve el SVG', async () => {

  const vecty = new Vecty(svg, {
    variables: {
      text: {
        operation: {
          type: 'Venta'
        },
        typology: "Quinta",
        features: [
          '5 dormitorios',
          '4 ambientes',
          'Cochera',
          '156 m² totales'
        ],
        title: 'Casa de 3 ambientes en Ranelagh, Berazategui',
        contact: {
          email: 'pedro@gmail.com',
          phone: '+54911 2565 2333'
        }
      },
      imgs: {
        property: [photo],
        realEstateLogo: photo
      }
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

/* test('Lee las variables de la etiqueta <vecty:variables/>', async () => {

  const svgx = `<svg>
    <vecty:variables content={{
      colors: {
        primary: '#424242',
        second: 'red',
        tercer: (() => 456 * 623)(),
        cuarto: {
          mes: 'Abril'
        }
        }
    }} />
  </svg>`

  const vecty = new Vecty(svgx)
  await writeFile('template.svg', vecty.svg)
  expect(vecty.svg.startsWith('<svg')).toBe(true)
}) */