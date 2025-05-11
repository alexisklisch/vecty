import Vecty from 'vecty'
import textReplace from '../plugins/text-replace'
import testPlugin from '../plugins/test-plugin'
const xml = `
<root>
  <text>Me gusta la comida</text>
  <text>La comida es deliciosa</text>
</root>
`

const vecty = new Vecty(xml, {
  variables: {
    name: 'John'
  },
  plugins: [
    textReplace('la', 'le'),
    textReplace('da', 'de'),
    testPlugin,
  ]
})

console.log(vecty.source)