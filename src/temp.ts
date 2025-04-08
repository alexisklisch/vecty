console.time('testix')
import Vecty from '@/index'


const svg = `
<svg heigth="1200" width="1800">
  <vecty:variables content={{
      type: 'maravilloso'
  }} />
  <rect x="36" y="486" cosa={template.type || user.type} />
  <text vecty:expand > {'Esto es realmente ' + template.type || user.type}</text>
</svg>`


const vecty = new Vecty(svg, {
  variables: {
    type: 'Hermoso'
  }
})

console.log(JSON.stringify(vecty.object, null, 2))
console.log(vecty.svg)

console.timeEnd('testix')