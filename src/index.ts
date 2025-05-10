import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import { tagRegex } from "@/utils/tagRegex"
import type { ExpressionNode, Node, TagNode } from "./utils/xmlParser/parserTypes"
import type { VectyConfig } from '@/vectyTypes'

class Vecty {
  public variables: Record<string, any> = {}
  #tempSource: string
  #variantList: string[] | [undefined] = []
  #currentVariant: string | undefined = undefined

  constructor(private readonly userSource: string, private config: VectyConfig = {}) {
    let sourceWithoutComments = userSource.replace(/\/\*[\s\S]*?\*\//g, '') // Elimina los comentarios

    this.#variantList = getVariants(sourceWithoutComments) || [undefined]
    sourceWithoutComments = sourceWithoutComments.replace(tagRegex('vecty-variants'), '')

    const { cleanSource, cleanVariables } = assignInitialVars(sourceWithoutComments, config, this.#currentVariant)
    this.#tempSource = cleanSource
    this.variables = cleanVariables
  }

  get object() {
    this.#currentVariant = this.#variantList[0]
    const [sourceParsed] = parser.parse(this.#tempSource)
    this.#recursiveSource(sourceParsed, undefined, undefined)
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

  #recursiveSource(currentNode:Node, parent?: TagNode, currentPosition?: number) {
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
        if (typeof expressionResult === 'string') {
          parent!.child[currentPosition!] = { type: 'text', content: expressionResult }
        } else {
          parent!.child[currentPosition!] = expressionResult
        }

        this.#recursiveSource(parent!.child[currentPosition!], parent, currentPosition)
        return
      }
    }
  }
}

export default Vecty

export function createVecty(source: string, config?: VectyConfig): Vecty {
  return new Vecty(source, config)
}

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