import { evaluateExpression } from '@/utils/evaluateExpression'
import { parser } from './xmlParser'
import type { VectyConfig } from "@/vectyTypes"
import type { ElementNode, Expression } from "@/utils/xmlParser/commonTypes"

export function assignInitialVars(initialSVG: string, config: VectyConfig) {
  let currentSVG = initialSVG
  let vars: { system: Record<string, any>, user: Record<string, any>, metadata: Record<string, any> } = { system: {}, user: {}, metadata: {} }

  // 1. Extraer y asignar variables del system
  const systemElementRegex = /<vecty:variables\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variables>).*?)<\/vecty:variables>)/gs
  const systemElementRaw = currentSVG.match(systemElementRegex)
  const [variablesParsed] = parser.parse(systemElementRaw![0] || '')
  if (((variablesParsed as ElementNode).attr.content as Expression).expression) {
    const expressionString = ((variablesParsed as ElementNode).attr.content as Expression).expression
    const expressionResolved = evaluateExpression(expressionString, {})
    vars.system = expressionResolved
  }
  // Eliminar el elemento <vecty:variables> del SVG
  currentSVG = currentSVG.replace(/<vecty:variables\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variables>).*?)<\/vecty:variables>)/gs, '')


  //  2. Extraer y asignar variables de metadata
  const metadataElementRegex = /<vecty:metadata\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:metadata>).*?)<\/vecty:metadata>)/gs
  const metadataElementRaw = currentSVG.match(metadataElementRegex)
  if (metadataElementRaw) {
    const [metadataParsed] = parser.parse(metadataElementRaw![0] || '')
    if (((metadataParsed as ElementNode).attr.content as Expression).expression) {
      const expressionString = ((metadataParsed as ElementNode).attr.content as Expression).expression
      const expressionResolved = evaluateExpression(expressionString, {})
      vars.metadata = expressionResolved
    }
    // Eliminar el elemento <vecty:metadata> del SVG
    currentSVG = currentSVG.replace(/<vecty:metadata\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:metadata>).*?)<\/vecty:metadata>)/gs, '')
  }

  // 3. Asignar variables del usuario
  const { variables } = config
  vars.user = variables || {}

  return { cleanSVG: currentSVG, cleanVariables: vars }
}