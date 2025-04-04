import { evaluateExpression } from '@/utils/evaluateExpression'
import type { VectyConfig } from "@/types"

export function assignInitialVars(initialSVG: string, config: VectyConfig) {
  let currentSVG = initialSVG
  let vars: { system: Record<string, any>, user: Record<string, any>, metadata: Record<string, any> } = { system: {}, user: {}, metadata: {} }

  const manifestContent = currentSVG.match(/<manifest vecty>([\s\S]*?)<\/manifest>/)
  if (!!manifestContent) { // Si existe el manifest...
    // Eliminar el manifest del SVG
    currentSVG = currentSVG.replace(/<manifest vecty>[\s\S]*?<\/manifest>/, '')

    // 1. Extraer y asignar variables del system
    const systemVariablesContent = manifestContent[1].match(/<variables>([\s\S]*?)<\/variables>/)
    if (!!systemVariablesContent) {
      const sysVarsRaw = systemVariablesContent[1]
      const first = sysVarsRaw.indexOf('{')
      const last = sysVarsRaw.lastIndexOf('}')
      const parsedSysVars = JSON.parse(sysVarsRaw.slice(first + 1, last))
      vars.system = parsedSysVars

    }

    // 2. Extraer y asignar variables del manifest
    const metadataVariablesContent = manifestContent[1].match(/<metadata>([\s\S]*?)<\/metadata>/)
    if (!!metadataVariablesContent) {

      const metadataVariablesRaw = metadataVariablesContent[1]
      const first = metadataVariablesRaw.indexOf('{')
      const last = metadataVariablesRaw.lastIndexOf('}')
      const parsedMetadataVars = JSON.parse(metadataVariablesRaw.slice(first + 1, last))
      vars.metadata = parsedMetadataVars
    }
  }

  // 3. Asignar variables del usuario
  const { variables } = config
  vars.user = variables!

  console.log('Las variables son -> ', JSON.stringify(vars, null, 2))
  return { cleanSVG: currentSVG, cleanVariables: vars }
}