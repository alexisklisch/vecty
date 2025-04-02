import { evaluateExpression } from '@/utils/evaluateExpression'
import { expect, test } from 'vitest'


test('Crear un array de un length de 3 con el constructor Array debe devolver [0, 12, 24]', () => {
  const expression = `Array.from({length:3}).map((el, i) => {
        if (system$$age <= 16) return system$$age * i
        else return "Mal ahí"
      })
  `
  expect(evaluateExpression(expression, { Array, system$$age: 12 })).toEqual([0, 12, 24])
})