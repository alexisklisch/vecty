console.time('cosa')
import { parser } from "./utils/xmlParser";
const xmlPrueba = '<xml><header>Ésta es la cuestion:</header><a href={Cuestiones de la vida}>Funcionará?</a></xml>'
const parseado = parser.parse(xmlPrueba)
const fixedInput = xmlPrueba.replace(/(\w+)=\{([^}]+)\}/g, '$1="{$2}"')
const parseadoDos = parser.parse(fixedInput)

console.log('PRIMERO MAL -> ', JSON.stringify(parseado))
console.log('SEGUNDO BIEN -> ', JSON.stringify(parseadoDos))
console.timeEnd('cosa')