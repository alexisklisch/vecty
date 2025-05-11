import { expect, test } from 'vitest'
import Vecty from '../../src/index'

test('Usa una variable', () => {
  const xml = `<v><vecty-variables content={{name: 'Sixto'}} /> 
  <text>Mi nombre es {template.name}</text>
  </v>`

  const vecty = new Vecty(xml, {
    
  })
  const result = vecty.source

  expect(result).toBe('<v><text>Mi nombre es Sixto</text></v>')
})
