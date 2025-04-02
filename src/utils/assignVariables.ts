import { VectyConfig } from "@/types"

export function assignInitialVars(initialSVG: string, vars: Record<string, any>, config: VectyConfig) {
  let currentSVG = initialSVG

  const manifestContent = currentSVG.match(/<manifest vecty>([\s\S]*?)<\/manifest>/)
  if (!!manifestContent) { // Si existe el manifest...
    // 1. Eliminar el manifest del SVG
    currentSVG = currentSVG.replace(/<manifest vecty>[\s\S]*?<\/manifest>/, '')

    // 2. Extraer y asignar variables del system
    const systemVariablesContent = manifestContent[1].match(/<variables>([\s\S]*?)<\/variables>/)
    if (!!systemVariablesContent) {
      const systemVariables = JSON.parse(systemVariablesContent[1])

      const systemVarsEntries = Object.entries(systemVariables)
      vars = systemVarsEntries.reduce<Record<string, any>>((prev, [key, value]) => {
        prev['system$$' + key] = value
        return prev
      }, {})
    }

    // 3. Extraer y asignar variables del manifest
    const metadataVariablesContent = manifestContent[1].match(/<metadata>([\s\S]*?)<\/metadata>/)
    if (!!metadataVariablesContent) {
      const metadataVariables = JSON.parse(metadataVariablesContent[1])

      const metadataVarsEntries = Object.entries(metadataVariables)
      vars = {
        ...vars,
        ...metadataVarsEntries.reduce<Record<string, any>>((prev, [key, value]) => {
          prev['metadata$$' + key] = value
          return prev
        }, {})
      }
    }
  }

  // Asignar variables del usuario
  const { variables } = config
  const userVarsEntries = Object.entries(variables!)
  vars = {
    ...vars,
    ...userVarsEntries.reduce<Record<string, any>>((prev, [key, value]) => {
      prev['user$$' + key] = value
      return prev
    }, {})
  }

  return currentSVG
}