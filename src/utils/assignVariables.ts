import { evaluateExpression } from '@/utils/evaluateExpression'
import { parser } from './xmlParser'
import type { VectyConfig } from "@/vectyTypes"
import type { ElementNode, Expression } from "@/utils/xmlParser/commonTypes"

export function assignInitialVars(initialSVG: string, config: VectyConfig) {
  let currentSVG = initialSVG
  let vars: { template: Record<string, any>, user: Record<string, any>, metadata: Record<string, any> } = { template: {}, user: {}, metadata: {} }

  // 1. Asignar variables del usuario
  const { variables } = config
  vars.user = variables || {}


  //  2. Extraer y asignar variables de metadata
  const metadataElementRegex = /<vecty:metadata\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:metadata>).*?)<\/vecty:metadata>)/gs
  const metadataElementRaw = currentSVG.match(metadataElementRegex)
  if (metadataElementRaw) {
    const [metadataParsed] = parser.parse(metadataElementRaw![0] || '')
    if (((metadataParsed as ElementNode).attr.content as Expression).expression) {
      const expressionString = ((metadataParsed as ElementNode).attr.content as Expression).expression
      const expressionResolved = evaluateExpression(expressionString, vars)
      vars.metadata = expressionResolved
    }
    // Eliminar el elemento <vecty:metadata> del SVG
    currentSVG = currentSVG.replace(metadataElementRegex, '')
  }

  // 3. Extraer y asignar variables del system
  const templateElementRegex = /<vecty:variables\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variables>).*?)<\/vecty:variables>)/gs
  const templateElementRaw = currentSVG.match(templateElementRegex)
  if (templateElementRaw) {
    const [variablesParsed] = parser.parse(templateElementRaw![0] || '')
    if (((variablesParsed as ElementNode).attr.content as Expression).expression) {
      const expressionString = ((variablesParsed as ElementNode).attr.content as Expression).expression
      const expressionResolved = evaluateExpression(expressionString, vars)
      vars.template = expressionResolved
    }
    // Eliminar el elemento <vecty:variables> del SVG
    currentSVG = currentSVG.replace(templateElementRegex, '')
  }

  return { cleanSVG: currentSVG, cleanVariables: vars }
}