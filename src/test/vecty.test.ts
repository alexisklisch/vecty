import Vecty from '@/index'
import { expect, test } from 'vitest'

const svg1 = `
<svg standar="4,3,2,1" calidad="243">
<rect cosa="La vida es una cosa"/>
  <manifest vecty>
    <metadata>
        {
          "author": "Alexis Fleitas Klisch",
          "flyers-name": "Pochoclo",
          "tags": ["Real Estate", "Ventas"]
        }
      </metadata>
      <variables>
      {
        "cosas": "Las nuevas cosas",
        "otrasCosas2": 4324234
        }
        </variables>
  </manifest>
  <text expr={2 + 2} >Es lo que es<p>Mas cosas</p></text>
  <image src={{src: 'https://images.com/img.jpg', mode: 'url'}} />
  {
    {tag: 'group', children: [0, 0, 0].map((el, i) => ({tag: 'text', children: [{text: "Fua loco, que hambre"}]}))}
  }
</svg>
`

test('Devuelve el svg en formato objeto', () => {
  const vecty = new Vecty(svg1, {
    variables: {
      cuestion: 'La vida es así',
      colors: {
        red: '#423423',
        blues: ['#123123', '#432343']
      },
      JSON
    }
  })

  expect(typeof vecty.object).toBe('object')
})

test('Dasarma y vuelve a armar un SVG complejo', () => {
  const vecty = new Vecty(svg1, {
    variables: {
      cuestion: 'La vida es así',
      colors: {
        red: '#423423',
        blues: ['#123123', '#432343']
      },
      JSON
    }
  })

  expect(vecty.svg.startsWith('<svg standar="4,3,2,1"')).toBe(true)
})