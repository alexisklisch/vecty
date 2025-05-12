import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import { tagRegex } from "@/utils/tagRegex"
import type { ExpressionNode, Node, TagNode } from "./utils/xmlParser/parserTypes"
import type { VectyConfig, PluginContext, PluginHooks } from '@/vectyTypes'

class Vecty {
  public variables: Record<string, any> = {}
  #tempSource: string
  #variantList: string[] | [undefined] = []
  #currentVariant: string | undefined = undefined
  #plugins: PluginHooks[] = []

  constructor(private readonly userSource: string, private config: VectyConfig = {}) {
    let sourceWithoutComments = userSource.replace(/\/\*[\s\S]*?\*\//g, '') // Elimina los comentarios

    this.#variantList = getVariants(sourceWithoutComments) || [undefined]
    sourceWithoutComments = sourceWithoutComments.replace(tagRegex('vecty-variants'), '')

    const { cleanSource, cleanVariables } = assignInitialVars(sourceWithoutComments, config, this.#currentVariant)
    this.#tempSource = cleanSource
    this.variables = cleanVariables

    // Inicializar plugins
    if (config.plugins) {
      this.#plugins = config.plugins.map(plugin => plugin())
      
      // Ejecutar onInit en todos los plugins
      const context = this.#createPluginContext()
      this.#plugins.forEach(plugin => plugin.onInit?.(context))
    }
  }

  #createPluginContext(): PluginContext {
    return {
      variables: this.variables,
      parser: {
        parse: parser.parse,
        build: parser.build
      },
      evaluateExpression,
      currentVariant: this.#currentVariant
    }
  }

  get object() {
    this.#currentVariant = this.#variantList[0]
    const [sourceParsed] = parser.parse(this.#tempSource)
    this.#recursiveSource(sourceParsed, undefined, undefined)
    
    // Ejecutar onFinish en todos los plugins
    const context = this.#createPluginContext()
    this.#plugins.forEach(plugin => plugin.onFinish?.(context))
    
    return [sourceParsed]
  }

  objects() {
    const objects = []
    for (const variant of this.#variantList) {
      this.#currentVariant = variant

      const [sourceParsed] = parser.parse(this.#tempSource)
      this.#recursiveSource(sourceParsed, undefined, undefined)

      objects.push(sourceParsed)
    }
    return objects
  }

  get source() { return parser.build(this.object) }

  sources() {
    const objects = this.objects()
    const sources = []
    for (const object of objects) {
      const source = parser.build([object])
      sources.push(source)
    }
    return sources
  }

  #recursiveSource(currentNode: Node, parent?: TagNode, currentPosition?: number) {
    const context = this.#createPluginContext()
    
    // Ejecutar onNode en todos los plugins
    this.#plugins.forEach(plugin => plugin.onNode?.(currentNode, context))

    if (typeof currentNode === 'object') {
      if (currentNode.type === 'tag') {
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

        for (const [key, value] of Object.entries(currentNode.child)) {
          this.#recursiveSource(value, currentNode, +key)
        }

        return
      }

      if (currentNode.type === 'expr') {
        const expressionResult = evaluateExpression(currentNode.content, this.variables, this.#currentVariant)
        
        // Si es un primitivo o un array, convertirlo a nodo de texto
        if (typeof expressionResult !== 'object' || expressionResult === null || Array.isArray(expressionResult)) {
          parent!.child[currentPosition!] = { type: 'text', content: String(expressionResult) }
        } 
        // Si es un objeto que ya tiene la estructura de un nodo (con la propiedad 'type')
        else if (expressionResult && typeof expressionResult === 'object' && 'type' in expressionResult) {
          parent!.child[currentPosition!] = expressionResult
        }
        // Para cualquier otro objeto, convertirlo a texto
        else {
          parent!.child[currentPosition!] = { type: 'text', content: JSON.stringify(expressionResult) }
        }

        this.#recursiveSource(parent!.child[currentPosition!], parent, currentPosition)
        return
      }
    }
  }
}

export default Vecty

const getVariants = (source: string) => {
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
