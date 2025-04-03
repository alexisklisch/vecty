console.time('testix')
import Vecty from '@/index'
import { XMLBuilder } from './utils/xmlParser/xmlBuilder'

const svg = `
<svg standar="4,3,2,1">
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
    {tag: 'group', children: [0, 0].map((el, i) => ({tag: 'text', attr:{arcoliris: 'De muchos colores'}, children: [{text: "Fua loco, que hambre"}]}))}
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

console.log(vecty.svg)

console.timeEnd('testix')