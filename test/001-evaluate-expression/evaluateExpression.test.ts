import { evaluateExpression } from '../../src/utils/evaluateExpression'
import { expect, test } from 'vitest'


test('Se resuelve un array con el constructor Array pasado por variable', () => {
  const expression = `Array.from({length:3}).map((el, i) => {
        if (system$$age <= 16) return system$$age * i
        else return "Mal ahí"
      })
  `
  const result = evaluateExpression(expression, { Array, system$$age: 12 })

  expect(result).toEqual([0, 12, 24])
})

test('Detecta la variante actual y responde según corresponde', () => {
  const expression = `$assign({ notCurrentVariant1: 222, selected: 'aaa', notCurrentVariant2: false }, 4)`
  const result = evaluateExpression(expression, {}, 'selected')

  expect(result).toEqual('aaa')
})

test('Al no existir una variante válida, devuelve el fallback', () => {
  const expression = `$assign({ variantNonExist1: 222, variantNonExist2: 'aaa', variantNonExist3: false }, 4)`
  const result = evaluateExpression(expression, {})

  expect(result).toEqual(4)
})
