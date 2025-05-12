import type { PluginContext, PluginHooks, Plugin } from '../src/vectyTypes'
import { Node, TagNode } from '../src/utils/xmlParser/parserTypes'

interface TagReplacement {
  tag: string;
  msg: string;
}

export default function replaceTag(replacements: TagReplacement[]): Plugin {
  return () => ({
    onNode: (node: Node, context: PluginContext) => {
      if (node.type === 'tag') {
        // Buscar si esta etiqueta debe ser reemplazada
        const replacement = replacements.find(r => r.tag === node.tag);
        
        if (replacement) {
          // Convertir el nodo actual en una etiqueta warn con el mensaje correspondiente
          node.tag = 'warn';
          node.child = [{
            type: 'text',
            content: replacement.msg
          }];
          
          // Eliminar todos los atributos originales
          node.attr = {};
        }
      }
    }
  });
}
