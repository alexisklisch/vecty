import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import type { VectyConfig } from '@/vectyTypes'

import { ElementNode, Expression } from "./utils/xmlParser/commonTypes"
import type { VectyPlugin } from "./types-vecty/plugins"

class Vecty<P extends readonly VectyPlugin[] = readonly []> {
  public variables: Record<string, any> = {}
  #SVGTemp: string
  #plugins: VectyPlugin[] = []
  #variantList: string[] | [undefined] = []
  #currentVariant: string | undefined = undefined

  constructor(private readonly userSVG: string, private config: VectyConfig = {}) {
    let svgWithoutComments = userSVG.replace(/\/\*[\s\S]*?\*\//g, '') // Elimina los comentarios

    this.#variantList = getVariants(svgWithoutComments) || [undefined]
    svgWithoutComments = svgWithoutComments.replace(/<vecty:variants\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variants>).*?)<\/vecty:variants>)/gs, '')

    const { cleanSVG, cleanVariables } = assignInitialVars(svgWithoutComments, config, this.#currentVariant)
    this.#SVGTemp = cleanSVG
    this.variables = cleanVariables

      // 2) registra plugins
      ; (config.plugins || []).forEach(p => this.#use(p))


    // 3) hook init de cada plugin
    for (const plugin of this.#plugins) {
      plugin.init?.(this, this.variables)
    }
  }

  /** Registra un plugin (antes de render) */
  #use(plugin: VectyPlugin) {
    if (this.#plugins.find(p => p.name === plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' ya registrado`)
    }
    this.#plugins.push(plugin)
  }

  get object() {
    this.#currentVariant = this.#variantList[0]
    const [svgParsed] = parser.parse(this.#SVGTemp)
    this.#recursiveSVG(svgParsed, undefined, undefined)
    return [svgParsed]
  }

  objects() {
    const objects = []
    for (const variant of this.#variantList) {
      this.#currentVariant = variant

      const [svgParsed] = parser.parse(this.#SVGTemp)
      this.#recursiveSVG(svgParsed, undefined, undefined)

      objects.push(svgParsed)
    }
    return objects
  }

  get svg() { return parser.build(this.object) }

  svgs() {
    const objects = this.objects()
    const svgs = []
    for (const object of objects) {
      const svg = parser.build([object])
      svgs.push(svg)
    }
    return svgs
  }

  #recursiveSVG(currentNode: Record<string, any>, parent?: Record<string, any>, currentPosition?: number) {
    if (typeof currentNode === 'object') {

      for (const plugin of this.#plugins) {
        if (plugin.onElement) {
          const r = plugin.onElement(currentNode as ElementNode, { variables: this.variables, evaluateExpression, vectyConfig: this.config, parser })
          if (r === null) {
            // eliminar nodo
            if (parent && typeof currentPosition === 'number') parent.children.splice(currentPosition, 1)
            return
          }
          if (r !== undefined) {
            parent!.children[currentPosition!] = r
          }
        }
      }

      if (currentNode.children) {
        const elementAttrs: Record<string, any> = currentNode?.attr || {}

        if (elementAttrs) {
          for (const [attrName, attrValue] of Object.entries(elementAttrs)) {
            // ...evaluar en el caso de que sean expresiones
            if (attrValue.expression) {
              const result = evaluateExpression(attrValue.expression, this.variables, this.#currentVariant)
              typeof result === 'object'
                ? currentNode.attr[attrName] = JSON.stringify(JSON.stringify(result)).slice(1, -1)
                : currentNode.attr[attrName] = String(result)
            }
          }
        }

        for (const [key, value] of Object.entries(currentNode.children)) {
          this.#recursiveSVG(value as Record<string, any>, currentNode, +key)
        }

        return
      }

      if (currentNode.expression) {
        const expressionResult = evaluateExpression(currentNode.expression, this.variables, this.#currentVariant)
        if (typeof expressionResult === 'string') {
          parent!.children[currentPosition!] = { text: expressionResult }
        } else {
          parent!.children[currentPosition!] = expressionResult
        }

        this.#recursiveSVG(parent!.children[currentPosition!], parent, currentPosition)
        return
      }

    }
  }

}

export default Vecty

export function createVecty<P extends readonly VectyPlugin[]>(svg: string, config?: VectyConfig<P>): Vecty<P> {
  return new Vecty(svg, config as VectyConfig)
}



const getVariants = (svg: string) => {
  const variantsElementRegex = /<vecty:variants\b(?:(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*)(\/>|>(?:(?!<\/vecty:variants>).*?)<\/vecty:variants>)/gs
  const variantsElementRaw = svg.match(variantsElementRegex)

  if (variantsElementRaw) {
    const [variants] = parser.parse(variantsElementRaw![0] || '')
    const expressionResolved = evaluateExpression(((variants as ElementNode)?.attr?.content as Expression)?.expression, {})

    if (!Array.isArray(expressionResolved)) return undefined
    const isStringArray = expressionResolved.some(variation => typeof variation === 'string')

    if (isStringArray) return expressionResolved
  }

  return undefined
}