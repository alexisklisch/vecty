import { expect, test } from 'vitest'
import {createVecty} from '../../src/index'

test('Resuelve los valores de la primera variante por defecto', () => {
  const xml = `<v><vecty:variants content={['ar','pt']} />
    <text>{$assign({ar:'La vida es hermosa',pt:'El café es feo'}, 'Es una vida y ya.')}</text>
  </v>`
  const vecty = createVecty(xml, {})
  const result = vecty.svg

  expect(result).toBe('<v><text>La vida es hermosa</text></v>')
})

test('Todos los resultados de SVG deben ser un string', () => {
  const xml = `<v><vecty:variants content={['ar','pt']} />
    <text>{$assign({ar:'La vida es hermosa',pt:'El café es feo'}, 'Es una vida y ya.')}</text>
  </v>`
  const vecty = createVecty(xml, {})
  const xmls = vecty.svgs()
  const result = xmls.every((xml: string) => xml.startsWith('<v'))

  expect(result).toBe(true)
})

test('ESto no funciona en codilink', () => {
  const xml = `<v>
    <vecty:variants content={['uno', 'dos']} />
    <divx>{'mi ' + 'vida'}</divx>
  </v>`
  const vecty = createVecty(xml, {})
  const xmls = vecty.svgs()
  console.log(xmls)
  const result = xmls.every((xml: string) => xml.startsWith('<v'))

  expect(result).toBe(true)
})