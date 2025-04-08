import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import type { VectyConfig, VectyPlugin } from '@/vectyTypes'
import { ElementNode } from "./utils/xmlParser/commonTypes"

class Vecty {
  public variables: Record<string, any> = {}
  #SVGTemp: string
  #plugins: VectyPlugin[] = []

  constructor(private readonly userSVG: string, private config: VectyConfig = {}) {
    const svgWithoutComments = userSVG.replace(/\/\*[\s\S]*?\*\//g, '') // Elimina los comentarios
    const { cleanSVG, cleanVariables } = assignInitialVars(svgWithoutComments, config)
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
    const [svgParsed] = parser.parse(this.#SVGTemp)
    this.#recursiveSVG(svgParsed, undefined, undefined)

    return [svgParsed]
  }

  get svg() { return parser.build(this.object) }


  #recursiveSVG(currentNode: Record<string, any>, parent?: Record<string, any>, currentPosition?: number) {
    if (typeof currentNode === 'object') {

      // 1) hook onElement
      for (const plugin of this.#plugins) {
        if (plugin.onElement) {
          const r = plugin.onElement(currentNode as ElementNode, this.variables)
          if (r === null) {
            // eliminar nodo
            if (parent && typeof currentPosition === 'number') parent.children.splice(currentPosition, 1)
            return
          }
          if (r !== undefined) {
            console.log('Hemos llegado')
            currentNode = r
            parent!.children[currentPosition!] = r
          }
        }
      }


      if (currentNode.children) {
        const elementAttrs: Record<string, any> = currentNode?.attr || {}

        // Si hay atributos...
        if (elementAttrs) {
          for (const [attrName, attrValue] of Object.entries(elementAttrs)) {
            // ...evaluar en el caso de que sean expresiones
            if (attrValue.expression) {
              const result = evaluateExpression(attrValue.expression, this.variables)
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


      // Situación, es una expresión
      if (currentNode.expression) {
        /* parent!.children[currentPosition!] = evaluateExpression(currentNode.expression, this.variables)
        // Luego de resolver la expresión, vuelve a pasar por el mismo nodo
        this.#recursiveSVG(parent!.children[currentPosition!], parent, currentPosition)
        return */

        const expressionResult = evaluateExpression(currentNode.expression, this.variables)
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