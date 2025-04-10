console.time('testix')
import { createVecty } from '@/index'
import TextExpandedPlugin from '@vecty/expand-plugin'
import type { VectyConfig } from './vectyTypes'
import type { ElementNode } from '@/utils/xmlParser/commonTypes'
import { VectyPlugin } from './types-vecty/plugins'


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
  <plugin:expand vecty:box={\`\${16 + 16} \${16 + 16} 0 0\`}>{265 * 235}</plugin:expand>
  <plugin:green-text vecty:expand > {'Esto es realmente ' + (template.type || user.type)}</plugin:green-text>
</svg>`


const vecty = createVecty(svg, {
  variables: {
    type: 'Hermoso'
  }

})

console.log(vecty.svg)

console.timeEnd('testix')