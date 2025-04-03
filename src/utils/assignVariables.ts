import { VectyConfig } from "@/types"

export function assignInitialVars(initialSVG: string, config: VectyConfig) {
  let currentSVG = initialSVG
  let vars: Record<string, any> = { system: {}, user: {}, metadata: {} }

  const manifestContent = currentSVG.match(/<manifest vecty>([\s\S]*?)<\/manifest>/)
  if (!!manifestContent) { // Si existe el manifest...
    // Eliminar el manifest del SVG
    currentSVG = currentSVG.replace(/<manifest vecty>[\s\S]*?<\/manifest>/, '')

    // 1. Extraer y asignar variables del system
    const systemVariablesContent = manifestContent[1].match(/<variables>([\s\S]*?)<\/variables>/)
    if (!!systemVariablesContent) {
      const systemVariables = JSON.parse(systemVariablesContent[1])
      const systemVarsEntries = Object.entries(systemVariables)
      systemVarsEntries.forEach(([key, value]) => vars.system[key] = value)
    }

    // 2. Extraer y asignar variables del manifest
    const metadataVariablesContent = manifestContent[1].match(/<metadata>([\s\S]*?)<\/metadata>/)
    if (!!metadataVariablesContent) {
      const metadataVariables = JSON.parse(metadataVariablesContent[1])
      const metadataVarsEntries = Object.entries(metadataVariables)
      metadataVarsEntries.forEach(([key, value]) => vars.metadata[key] = value)
    }
  }

  // 3. Asignar variables del usuario
  const { variables } = config
  const userVarsEntries = Object.entries(variables || [])
  userVarsEntries.forEach(([key, value]) => vars.user[key] = value)

  return { cleanSVG: currentSVG, cleanVariables: vars }
}