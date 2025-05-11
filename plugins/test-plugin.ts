import type { PluginContext, PluginHooks } from '../src/vectyTypes'
import { Node } from '../src/utils/xmlParser/parserTypes'

export default function examplePlugin(config: Record<string, any> = {}): PluginHooks {
  return {
    // Se ejecuta cuando se inicializa Vecty
    onInit: (context: PluginContext) => {
      console.log('Plugin inicializado con variables:', context.variables)
    },

    // Se ejecuta para cada nodo durante el procesamiento
    onNode: (node: Node, context: PluginContext) => {
      // Ejemplo: si el nodo es de tipo texto, lo modificamos
      if (node.type === 'text') {
        // Aquí podrías modificar el contenido del nodo
        console.log('Procesando nodo de texto:', node.content)
      }
    },

    // Se ejecuta cuando Vecty termina de procesar todo
    onFinish: (context: PluginContext) => {
      console.log('Procesamiento completado')
    }
  }
}