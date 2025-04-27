import { evaluateExpression } from '@/utils/evaluateExpression'
import { parser } from './xmlParser'
import type { VectyConfig } from "@/vectyTypes"
import type { ElementNode, Expression } from "@/utils/xmlParser/commonTypes"

export function assignInitialVars(initialSource: string, config: VectyConfig, currentVariant: string | undefined) {
  let currentSource = initialSource
  let vars: { template: Record<string, any>, user: Record<string, any>, metadata: Record<string, any> } = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario
  const { variables } = config
  vars.user = variables || {}


  //  2. Extraer y asignar variables de metadata
  const metadataElementRegex = /<vecty:metadata\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:metadata>).*?)<\/vecty:metadata>)/gs
  const metadataElementRaw = currentSource.match(metadataElementRegex)
  if (metadataElementRaw) {
    const [metadataParsed] = parser.parse(metadataElementRaw![0] || '')
    if (((metadataParsed as ElementNode).attr.content as Expression).expression) {
      const expressionString = ((metadataParsed as ElementNode).attr.content as Expression).expression
      const expressionResolved = evaluateExpression(expressionString, vars, currentSource)
      vars.metadata = expressionResolved
    }
    // Eliminar el elemento <vecty:metadata> del source
    currentSource = currentSource.replace(metadataElementRegex, '')
  }

  // 3. Extraer y asignar variables del system
  const templateElementRegex = /<vecty:variables\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variables>).*?)<\/vecty:variables>)/gs
  const templateElementRaw = currentSource.match(templateElementRegex)
  if (templateElementRaw) {
    const [variablesParsed] = parser.parse(templateElementRaw![0] || '')
    if (((variablesParsed as ElementNode).attr.content as Expression).expression) {
      const expressionString = ((variablesParsed as ElementNode).attr.content as Expression).expression
      const expressionResolved = evaluateExpression(expressionString, vars, currentVariant)
      vars.template = expressionResolved
    }
    // Eliminar el elemento <vecty:variables> del source
    currentSource = currentSource.replace(templateElementRegex, '')
  }

  return { cleanSource: currentSource, cleanVariables: vars }
}