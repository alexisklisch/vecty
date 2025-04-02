import { SimpleXMLParser } from '@/utils/xmlParser'
import { evaluateExpression } from './utils/evaluateExpression';
// Ejemplo de uso
const xmlInput = `
<svg>
  <circle x="16" y="32" r="6" fill="blue"/>
  {
    Array.from({length:5}).map((el, i) => {
      if (system$$age <= 16) return \`Espectacular \${el * i}\`
      else return "Mal ahí"
    })
  }
  <metadata>
    {{
      user: 'Alexander Macalla'
    }}
  </metadata>
  <image vecty:new src={{src: $USER.profileUrl, mode: 'base64'}} />
</svg>
`


const parser = new SimpleXMLParser(xmlInput)
const parsedOutput = parser.parse()

console.log(JSON.stringify(parsedOutput[0].children![1].expression))
console.log(evaluateExpression(parsedOutput[0].children![1].expression, { Array }))