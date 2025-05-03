import { expect, test } from 'vitest'
import { parser } from '../../src/utils/xmlParser';

test('Dasarma y vuelve a armar un SVG complejo', () => {
      const svg = `<div>Hola</div>`
      const parsed = parser.parse(svg)
      const builded = parser.build(parsed);

      expect(builded).toBe(svg)
})