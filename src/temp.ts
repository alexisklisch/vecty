console.time('testix')
import Vecty from '@/index'
import type { VectyPlugin, VectyConfig } from './vectyTypes'
import type { ElementNode } from '@/utils/xmlParser/commonTypes'


export const GreenTextPlugin: VectyPlugin = {
  name: 'GreenText',

  onElement(node: ElementNode, ctx: VectyConfig['variables']) {
    // intercepta <plugin:green-text>
    if (node.tag === 'plugin:green-text') {
      return {
        ...node,
        tag: 'text',
        attr: {
          ...node.attr,
          fill: 'green'
        },
        // si no tiene hijos, le pongo un texto por defecto
        children: node.children.length
          ? node.children
          : [{ text: 'texto verde' }]
      } as unknown as ElementNode
    }
    return undefined
  }
}


const svg = `
<svg heigth="1200" width="1800">
  <vecty:variables content={{
  }} />
  <rect x="36" y="486" cosa={template.type || user.type} />
  <plugin:green-text vecty:expand > {'Esto es realmente ' + (template.type || user.type)}</plugin:green-text>
</svg>`


const vecty = new Vecty(svg, {
  variables: {
    type: 'Hermoso'
  },
  plugins: [GreenTextPlugin]
})

console.log(vecty.svg)

console.timeEnd('testix')