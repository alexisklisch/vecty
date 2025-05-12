import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import { tagRegex } from "@/utils/tagRegex"
import { getVariants } from "@/utils/getVariants"
import type { ExpressionNode, Node, TagNode } from "./utils/xmlParser/parserTypes"
import type { VectyConfig, PluginContext, PluginHooks, ExportOptions } from '@/vectyTypes'

class Vecty {
  public variables: Record<string, any> = {}
  #tempSource: string
  #variantList: (string | undefined)[] = []
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

  export(options: ExportOptions = {}) {
    const mode = options.mode || 'xml';
    let variants: (string | undefined)[] = [];
    
    // Determinar las variantes a procesar
    if (options.variant === undefined) {
      // Por defecto, usa la primera variante
      variants = [this.#variantList[0]];
    } else if (typeof options.variant === 'string') {
      // Una sola variante
      variants = [options.variant];
    } else {
      // Array de variantes
      variants = options.variant as string[];
    }
    
    // Procesar cada variante
    const results = variants.map(variant => {
      this.#currentVariant = variant;
      const [sourceParsed] = parser.parse(this.#tempSource);
      this.#recursiveSource(sourceParsed, undefined, undefined);
      
      // Ejecutar onFinish en todos los plugins
      const context = this.#createPluginContext();
      this.#plugins.forEach(plugin => plugin.onFinish?.(context));
      
      return mode === 'object' ? sourceParsed : parser.build([sourceParsed]);
    });
    
    // Si solo hay una variante, devuelve el resultado directamente
    return variants.length === 1 ? results[0] : results;
  }

  #recursiveSource(currentNode: Node, parent?: TagNode, currentPosition?: number) {
    const context = this.#createPluginContext()
    
    // Ejecutar onNode en todos los plugins
    this.#plugins.forEach(plugin => plugin.onNode?.(currentNode, context))

    if (typeof currentNode === 'object') {
      if (currentNode.type === 'tag') {
        const elementAttrs: Record<string, string | ExpressionNode> = currentNode?.attr || {}

        if (elementAttrs) {
          for (const [attrName, attrValue] of Object.entries(elementAttrs)) {
            if (typeof attrValue === 'object' && attrValue.type === 'expr') {
              const result = evaluateExpression(attrValue.content, this.variables, this.#currentVariant)
              currentNode.attr[attrName] = typeof result === 'object' && result !== null
                ? JSON.stringify(result)
                : String(result)
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