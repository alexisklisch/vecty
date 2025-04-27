import { expect, test } from 'vitest'
import {createVecty} from '../../src/index'

test('Crea vecty sin pasar configuración', () => {
  const xml = `<v><vecty-variants content={['ar','pt']} />
    <text>{$assign({ar:'La vida es hermosa',pt:'El café es feo'}, 'Es una vida y ya.')}</text>
  </v>`
  const vecty = createVecty(xml)
  const result = vecty.source
  
  expect(result).toBe('<v><text>La vida es hermosa</text></v>')
})

test('Iniciar desde el bundle', async () => {
  const { createVecty } = await import('../../dist/mjs/main')
  
  const xml = `<v><vecty-variants content={['ar','pt']} />
  <text>{$assign({ar:'La vida es hermosa',pt:'El café es feo'}, 'Es una vida y ya.')}</text>
  </v>`
  const vecty = createVecty(xml)
  const result = vecty.source

  expect(result).toBe('<v><text>La vida es hermosa</text></v>')
})