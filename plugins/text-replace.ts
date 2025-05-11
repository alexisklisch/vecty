import type { PluginContext, PluginHooks, Plugin } from '../src/vectyTypes'
import { Node } from '../src/utils/xmlParser/parserTypes'

export default function textReplace(searchText: string, replaceText: string): Plugin {
  return () => ({
    onNode: (node: Node, context: PluginContext) => {
      if (node.type === 'text') {
        node.content = node.content.replace(new RegExp(searchText, 'g'), replaceText)
      }
    }
  })
} 