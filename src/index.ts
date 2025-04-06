import { parse } from 'opentype.js'
import { evaluateExpression } from "@/utils/evaluateExpression"
import { assignInitialVars } from "@/utils/assignVariables"
import { parser } from "@/utils/xmlParser"
import { syllabler } from '@/utils/syllaber'
import type { Font } from 'opentype.js'
import type { VectyConfig } from '@/vectyTypes'

class Vecty {
  public variables: Record<string, any> = {}
  #SVGTemp: string

  constructor(private readonly userSVG: string, private config: VectyConfig = {}) {
    const svgWithoutComments = userSVG.replace(/\/\*[\s\S]*?\*\//g, '') // Elimina los comentarios
    const { cleanSVG, cleanVariables } = assignInitialVars(svgWithoutComments, config)
    this.#SVGTemp = cleanSVG
    this.variables = cleanVariables
  }

  get object() {
    const [svgParsed] = parser.parse(this.#SVGTemp)
    this.#recursiveSVG(svgParsed, undefined, undefined)

    return [svgParsed]
  }

  get svg() { return parser.build(this.object) }


  #recursiveSVG(currentNode: Record<string, any>, parent?: Record<string, any>, currentPosition?: number) {
    if (typeof currentNode === 'object') {


      if (currentNode.children) {
        const elementAttrs: Record<string, any> = currentNode?.attr || {}

        // Si hay atributos...
        if (elementAttrs) {
          for (const [attrName, attrValue] of Object.entries(elementAttrs)) {
            // ...evaluar en el caso de que sean expresiones
            if (attrValue.expression) {
              const result = evaluateExpression(attrValue.expression, this.variables)
              typeof result === 'object'
                ? currentNode.attr[attrName] = JSON.stringify(JSON.stringify(result)).slice(1, -1)
                : currentNode.attr[attrName] = String(result)
            }
          }
        }

        if (currentNode.tag === 'text') {

          // Establecer texto
          let text = ''
          if (currentNode?.children[0]?.text) { // 
            text = String(currentNode.children[0]?.text)
          } else { // Si el hijo es una expresión, resolverlo y establecerlo como texto
            text = evaluateExpression(currentNode.children[0].expression, this.variables)
            currentNode.children[0].expression = undefined
            currentNode.children[0].text = text
          }

          if (Object.keys(elementAttrs).includes('vecty:expand')) {
            const [x, y, boxWidth, boxHeight] = (elementAttrs['vecty:box'] || '0 0 100 100').split(' ').map(Number)
            const boxStroke = elementAttrs['vecty:box-stroke']
            const textAlign = elementAttrs['vecty:text-align'] || 'left'
            const verticalAlign = elementAttrs['vecty:vertical-align'] || 'top'
            const textTransform = elementAttrs['vecty:text-transform'] || 'none'
            const lineHeight = Number(elementAttrs['vecty:line-height']) || 0
            const fontWeight = Number(elementAttrs['font-weight']) || 400
            const fontFamily = elementAttrs['font-family'] || 'Arial'
            const fontSize = Number(elementAttrs['font-size']) || 16
            const letterSpacing = Number(elementAttrs['letter-spacing']) || 0

            // Modificar el case del texto en caso de ser necesario
            if (textTransform === 'uppercase') text = text.toUpperCase()
            else if (textTransform === 'lowercase') text = text.toLowerCase()
            // Seleccionar fuente actual
            const selectedFont = this.config.fonts!.find(font => font.name === fontFamily && font.weight === fontWeight)
            if (!selectedFont) throw new Error('<text/> debe tener al menos una fuente válida.')
            const buffer = selectedFont.src
            const font = parse(buffer)
            // Utilidad para calcular siempre con la fuente seleccionada
            const withFontWidth = (text: string) => getTextWidth(text, fontSize, font, letterSpacing)

            // Crear un array de palabras
            const words = text.split(' ')
            // Array con las líneas
            const textLines = []
            // Linea temporar
            let tempLine = ''

            while (words.length >= 1) {
              // selecciona y elimina la primera word[]
              const currentWord = words.shift()
              // Analizar nuevos espacios
              const fullTempLineFontWidth = withFontWidth(`${tempLine} ${currentWord}`)
              const isBiggerThanBox = fullTempLineFontWidth > boxWidth


              // Si el texto es mas grande que la caja de texto...
              if (isBiggerThanBox) {
                // Separo en sílabas la palabra
                let syllabes = syllabler(currentWord!)
                syllabes = restoreCapitalization(currentWord!, syllabes)
                // Utilidad para saber siempre el temaño con las sílabas actuales
                const currentSyllabesFontWidth = () => withFontWidth(`${tempLine} ${syllabes.join('')}-`.trim())
                // Variable donde se guarda la/s sílaba a enviar debajo
                let nextLineSyllabes = ''

                // Mientras que la actual palabra con guión sea más grande...
                while (currentSyllabesFontWidth() > boxWidth) {
                  const currentSyllabe = syllabes.pop()
                  // Si la cantidad de sílabas es igual a 0
                  if (syllabes.length === 0) {
                    // La sílaba de la siguiente línea es la palabra entera
                    nextLineSyllabes = currentWord!
                    // Y detengo el ciclo while
                    break
                  }
                  // Si no ocurre nada de ésto, la sílaba de la próxima línea se le suma ésta sílaba
                  nextLineSyllabes = currentSyllabe + nextLineSyllabes
                }

                words.unshift(nextLineSyllabes)
                tempLine = `${tempLine} ${syllabes.join('') ? `${syllabes.join('')}-` : ''}`.trim()
                textLines.push(tempLine)
                tempLine = ''
                nextLineSyllabes = ''

              } else {
                tempLine += ` ${currentWord}`
                // Si es la última línea, y entra en la caja, hacer push
                if (words.length === 0) textLines.push(tempLine.trim())
              }
            }



            let currentX = x
            let currentY = y
            const pathData: string[] = []
            const scale = fontSize / font.unitsPerEm

            const AllLinesSize = textLines.length * fontSize + (textLines.length - 1) * lineHeight
            if (verticalAlign === 'middle') currentY = y + (boxHeight - AllLinesSize) / 2
            else if (verticalAlign === 'bottom') currentY = y + boxHeight - AllLinesSize

            textLines.forEach((line, i) => {
              if (textAlign === 'left') currentX = x
              else if (textAlign === 'center') currentX = x + (boxWidth - withFontWidth(line)) / 2
              else if (textAlign === 'right') currentX = x + boxWidth - withFontWidth(line)

              if (i > 0) currentY += fontSize + lineHeight

              const glyphs = font.stringToGlyphs(line)
              for (const glyph of glyphs) {
                const glyphWidth = glyph.advanceWidth! * scale

                // Obtener el path, ajustando la altura
                const path = glyph.getPath(currentX, currentY + fontSize, fontSize)
                pathData.push(path.toSVG(2))
                currentX += glyphWidth + letterSpacing
              }

            })

            const path = pathData.map(currentPath => parser.parse(currentPath)[0])

            const nuevo = {
              tag: 'g',
              attr: elementAttrs,
              children: path
            }

            // Si hay un box stroke, agregar el cuadrado
            if (boxStroke) {
              const rectWithStroke = {
                tag: 'rect',
                attr: {
                  aca: 'Espectacular',
                  x: String(x),
                  y: String(y),
                  height: String(boxHeight),
                  width: String(boxWidth),
                  stroke: String(boxStroke),
                  fill: 'transparent'
                },
                children: []
              }

              nuevo.children.unshift(rectWithStroke)
            }

            parent!.children[currentPosition!] = nuevo

          }

        }

        for (const [key, value] of Object.entries(currentNode.children)) {
          this.#recursiveSVG(value as Record<string, any>, currentNode, +key)
        }

        return
      }


      // Situación, es una expresión
      if (currentNode.expression) {
        parent!.children[currentPosition!] = evaluateExpression(currentNode.expression, this.variables)
        return
      }

    }
  }
}

// Función externa modificada para incluir kerning
function getTextWidth(text: string, fontSize: number, font: Font, kerning: number) {
  const scale = fontSize / font.unitsPerEm;
  let width = 0
  const glyphs = font.stringToGlyphs(text)
  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i]
    width += glyph.advanceWidth! * scale

    // Si hay kerning, calcular entre pares de glifos
    if (kerning && i < glyphs.length - 1) {
      width += kerning
    }
  }

  return width
}

function restoreCapitalization(originalWord: string, syllabes: string[]) {
  let restored = [];
  let charIndex = 0;

  for (const syllabe of syllabes) {
    let restoredSyllabe = '';

    for (let i = 0; i < syllabe.length; i++) {
      if (charIndex < originalWord.length && originalWord[charIndex] === originalWord[charIndex].toUpperCase()) {
        restoredSyllabe += syllabe[i].toUpperCase();
      } else {
        restoredSyllabe += syllabe[i];
      }
      charIndex++;
    }

    restored.push(restoredSyllabe);
  }

  return restored;
}

export default Vecty