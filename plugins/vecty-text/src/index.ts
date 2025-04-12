import { Font, parse } from 'opentype.js'
import type { VectyPlugin } from 'vecty/../../src/types-vecty/plugins'
import type { ElementNode, TextNode, Node } from 'vecty/../../src/utils/xmlParser/commonTypes'
import { syllaber } from './utils/syllaber'

type TextWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold' | 'black'
  | 'extrabold' | 'extralight' | 'semibold' | 'ultralight' | 'ultrabold'
  | 'heavy' | 'extraheavy' | 'demibold' | 'demilight' | 'book' | 'normal' | number

type TextStyle = 'normal' | 'italic' | 'oblique'
type TextFormat = 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg'

interface FontsConfig {
  name: string
  weight: TextWeight
  style?: TextStyle
  src: ArrayBuffer
  format?: TextFormat
}

interface Options {
  fonts: FontsConfig[]
}

const TextExpandedPlugin: VectyPlugin<Options> = {
  name: 'TextExpanded',

  onElement(node: ElementNode, { evaluateExpression, variables, vectyConfig, parser }) {
    // intercepta <plugin:expand>
    if (node.tag === 'plugin:text') {
      // Verificar si el children incluye <plugin:text:paragraph>
      const paragraphElements = node.children.filter((el) => (el as ElementNode).tag === 'plugin:text:paragraph' || (el as ElementNode).tag === 'plugin:text:p')

      const boxAttributes: Record<string, any> = node.attr || {}
      // Si hay atributos...
      if (boxAttributes) {
        for (const [attrName, attrValue] of Object.entries(boxAttributes)) {
          // ...evaluar en el caso de que sean expresiones
          if (attrValue.expression) {
            const result = evaluateExpression(attrValue.expression, variables!)
            typeof result === 'object'
              ? node.attr[attrName] = JSON.stringify(JSON.stringify(result)).slice(1, -1)
              : node.attr[attrName] = String(result)
          }
        }
      }

      const [x, y, boxWidth, boxHeight] = (boxAttributes['box'] || '0 0 100 100').split(' ').map(Number)
      const boxStroke = boxAttributes['box-stroke']
      const textAlign = boxAttributes['text-align'] || 'left'
      const verticalAlign = boxAttributes['vertical-align'] || 'top'
      const textTransform = boxAttributes['text-transform'] || 'none'
      const lineHeight = Number(boxAttributes['line-height']) || 0
      const fontWeight = Number(boxAttributes['font-weight']) || 400
      const fontFamily = boxAttributes['font-family']
      const fontSize = Number(boxAttributes['font-size']) || 16
      const letterSpacing = Number(boxAttributes['letter-spacing']) || 0
      const paragraphGap = Number(boxAttributes['paragraph-gap']) || 0
      const overflow = boxAttributes['overflow'] || 'visible'


      if (boxHeight === 0 || boxWidth === 0) throw new Error('Box debe tener al menos 1px de width o 1px de height')

      // If exist paragraph expand every paragraph, else the inner text
      if (paragraphElements.length === 0) paragraphElements.push(node)

      let currentParagraphYExe = y - fontSize * .3

      const finalElements = paragraphElements.map((currentParagraph) => {
        let text = ''
        if (((currentParagraph as ElementNode)?.children[0] as TextNode)?.text) { //
          text = String(((currentParagraph as ElementNode).children[0] as TextNode)?.text)
        } else if (((currentParagraph as ElementNode).children[0] as TextNode)?.expression) { // Si el hijo es una expresión, resolverlo y establecerlo como texto
          text = String(evaluateExpression(((currentParagraph as ElementNode).children[0] as TextNode).expression!, variables!))
            ; ((currentParagraph as ElementNode).children[0] as TextNode).expression = undefined as unknown as undefined
          ((currentParagraph as ElementNode).children[0] as TextNode).text = text
        }

        // Modificar el case del texto en caso de ser necesario
        if (textTransform === 'uppercase') text = text.toUpperCase()
        else if (textTransform === 'lowercase') text = text.toLowerCase()
        // Seleccionar fuente actual
        // @ts-ignore <-- SOLUCIONAR TIPOS PARA QUE INCLUYA .fonts
        const selectedFont = (vectyConfig.fonts as FontsConfig[] | undefined)?.find(font => font.name === fontFamily && font.weight === fontWeight)
        if (!selectedFont) throw new Error('Debe existir al menos una fuente válida.')
        const buffer = selectedFont.src
        const font = parse(buffer)
        // Utilidad para calcular siempre con la fuente seleccionada
        const withFontWidth = (text: string) => getTextWidth(text, fontSize, font, letterSpacing)


        // Crear un array de palabras
        const words = text.split(' ')
        // Array con las líneas
        const textLines: string[] = []
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
            let syllabes = syllaber(currentWord!)
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
        let currentY = currentParagraphYExe
        const pathData: string[] = []
        const scale = fontSize / font.unitsPerEm

        const AllLinesSize = textLines.length * fontSize + (textLines.length - 1) * lineHeight
        if (verticalAlign === 'middle') currentY = y + (boxHeight - AllLinesSize) / 2
        else if (verticalAlign === 'bottom') currentY = y + boxHeight - AllLinesSize

        textLines.forEach((line, i) => {
          if (textAlign === 'left') currentX = x
          else if (textAlign === 'center') currentX = x + (boxWidth - withFontWidth(line)) / 2
          else if (textAlign === 'right') currentX = x + boxWidth - withFontWidth(line)

          if (i > 0) currentY += (fontSize) + lineHeight

          if (textLines.length - 1 < i) currentParagraphYExe += fontSize + lineHeight
          if (textLines.length - 1 === i) currentParagraphYExe += paragraphGap


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
          attr: boxAttributes,
          children: path
        }

        // Si hay un box stroke, agregar el cuadrado
        if (boxStroke) {
          const rectWithStroke: ElementNode = {
            tag: 'rect',
            attr: {
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

        return nuevo
      })

      const expandedText: ElementNode = {
        tag: 'g',
        attr: {},
        children: finalElements
      }

      // Si el overflow es hidden, agregar un clipPath
      if (overflow === 'hidden') {
        const clipPath: ElementNode = {
          tag: 'clipPath',
          attr: {
            id: `clip-${Math.random().toString(36).substring(2, 15)}`,
          },
          children: [
            {
              tag: 'rect',
              attr: {
                x: String(x),
                y: String(y),
                height: String(boxHeight),
                width: String(boxWidth)
              },
              children: []
            }
          ]
        }
        const clipPathId = `url(#${clipPath.attr.id})`
        const def = {
          tag: 'defs',
          attr: {},
          children: [clipPath]
        }

        expandedText.children.unshift(def)
        expandedText.attr['clip-path'] = clipPathId

      }

      return expandedText
    }

  }
}

export default TextExpandedPlugin

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