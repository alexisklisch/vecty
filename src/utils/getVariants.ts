import { evaluateExpression } from "@/utils/evaluateExpression"
import { tagRegex } from "@/utils/tagRegex"
import { parser } from "@/utils/xmlParser"
import type { ExpressionNode } from "@/utils/xmlParser/parserTypes"

export const getVariants = (source: string) => {
  const variantsElementRegex = tagRegex('vecty-variants')
  const variantsElementRaw = source.match(variantsElementRegex)

  if (variantsElementRaw) {
    const [variants] = parser.parse(variantsElementRaw![0] || '')
    
    if (variants.type !== 'tag') return
    const nodeExpression = variants.attr.content as ExpressionNode
    const expressionResolved = evaluateExpression(nodeExpression.content, {})

    if (!Array.isArray(expressionResolved)) return undefined
    const isStringArray = expressionResolved.some(variation => typeof variation === 'string')

    if (isStringArray) return expressionResolved
  }

  return undefined
}
