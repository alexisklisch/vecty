import Vecty from 'vecty'
import textReplace from '../plugins/text-replace'
import testPlugin from '../plugins/test-plugin'
import replaceTag from '../plugins/tag-replacer'
const xml = `
<root>
  <vecty-variables content={{
    age: "12"
}}/>
  <text>Me gusta la comida</text>
  <sound volume="high">Este es un sonido que será reemplazado</sound>
  <text edad={template.age}>La comida es deliciosa a los {template.age} años</text>
  <p>Atención esto {{type: 'tag', tag: 'error', attr: {}, child: [{type: 'text', content: 'es un error '}, {type: 'expr', content: 'template.age'}]}} es un error</p>
</root>
`

const vecty = new Vecty(xml, {
  variables: {
    name: 'John'
  },
  plugins: [
    textReplace('la', 'le'),
    textReplace('da', 'de'),
    replaceTag([{tag: 'sound', msg: 'No se permite sonido en XML'}])
  ]
})
console.log(JSON.stringify(vecty.export({mode: 'object'}), null, 2))
console.log(vecty.export({mode: 'xml'}))