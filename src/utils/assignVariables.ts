import { evaluateExpression } from '@/utils/evaluateExpression'
import { parser } from './xmlParser'
import { tagRegex } from './tagRegex'
import type { VectyConfig } from "@/vectyTypes"
import type { ExpressionNode, Node } from "@/utils/xmlParser/parserTypes"

export function assignInitialVars(initialSource: string, config: VectyConfig, currentVariant: string | undefined) {
  let currentSource = initialSource
  let vars: { template: Record<string, any>, user: Record<string, any>, metadata: Record<string, any> } = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario
  const { variables } = config
  vars.user = variables || {}

  // Simplificar en una sola función que itera metadata y variables
  const tags = ['vecty-variables', 'vecty-metadata']
  const tagsRegex = tags.map(tag => tagRegex(tag))
  const tagsRaw = tagsRegex.map(tag => currentSource.match(tag))
  tagsRaw.map((tag, index) => {
    if (tag) {
      const [parsed] = parser.parse(tag[0] || '')
      if (parsed.type !== 'tag') return null // Si el parsed no es un nodo, retornar
      const expression = parsed.attr.content as ExpressionNode
      if (expression.content) {
        const expressionResolved = evaluateExpression(expression.content, vars, currentVariant)
        if (tags[index] === 'vecty-variables') {
          vars.template = expressionResolved
        } else {
          vars.metadata = expressionResolved
        }
      }
      // Eliminar el elemento <vecty-variables> del source
      currentSource = currentSource.replace(tagsRegex[index], '')
    }
    return null
  })

  return { cleanSource: currentSource, cleanVariables: vars }
}