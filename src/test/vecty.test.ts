import Vecty from '@/index'
import { expect, test } from 'vitest'
import { XMLBuilder } from '@/utils/xmlBuilder'
import { SimpleXMLParser } from '@/utils/xmlParser';

test('Dasarma y vuelve a armar un SVG complejo', () => {
  const svg = `
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
    <text>Es lo que es<p>Mas cosas</p></text>
    <image src={{src: 'https://images.com/img.jpg', mode: 'url'}} />
    {
      {tag: 'group', children: [0, 0, 0].map((el, i) => ({tag: 'text', children: [text: 'Pepe pelotas']}))}
    }
  </svg>
  `

  const vecty = new Vecty(svg, {
    variables: {
      cuestion: 'La vida es así',
      colors: {
        red: '#423423',
        blues: ['#123123', '#432343']
      },
      JSON
    }
  })

  expect(vecty.svg).toBe(svg)
}