import { expect, test } from 'vitest'
import { parser } from '../../src/utils/xmlParser';

test('Dasarma y vuelve a armar un SVG complejo lvl 0', () => {
  const svg = `<div>Hola</div>`
  console.time('parse')
  const parsed = parser.parse(svg)
  const builded = parser.build(parsed);
  console.timeEnd('parse')

  expect(builded).toBe(svg)
})
