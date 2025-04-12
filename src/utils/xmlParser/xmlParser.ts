import type { ElementNode, Expression, Node } from '@/utils/xmlParser/commonTypes'

export class SimpleXMLParser {
  private pos = 0

  constructor(private xml: string) { }

  public parse(): Node[] {
    return this.parseNodes()
  }

  private parseNodes(): Node[] {
    const nodes: Node[] = []
    while (this.pos < this.xml.length) {
      const char = this.xml[this.pos]
      if (char === "<") {
        if (this.xml.startsWith("</", this.pos)) break
        nodes.push(this.parseElement())
      } else if (char === "{") {
        // Se parsea un bloque de código interno y se guarda como expresión
        const code = this.parseCodeBlock().trim()
        nodes.push({ expression: code })
      } else {
        const text = this.readText()
        if (text.trim().length > 0) nodes.push({ text })
      }
    }
    return nodes
  }

  private parseElement(): ElementNode {
    this.pos++ // Salta '<'
    const tag = this.readUntil(/[\s>/]/)
    this.skipWhitespace()
    const attr = this.parseAttributes()
    this.skipWhitespace()

    let children: Node[] = []
    if (this.xml.startsWith("/>", this.pos)) {
      this.pos += 2
    } else if (this.xml[this.pos] === ">") {
      this.pos++ // Salta '>'
      children = this.parseNodes()
      if (this.xml.startsWith("</", this.pos)) {
        this.pos += 2 // Salta '</'
        this.readUntil(">")
        this.pos++ // Salta '>'
      }
    }
    return { tag, attr, children }
  }

  private parseAttributes(): { [key: string]: string | Expression } {
    const attrs: { [key: string]: string | Expression } = {}
    while (this.pos < this.xml.length) {
      this.skipWhitespace()
      if (this.xml[this.pos] === ">" || this.xml.startsWith("/>", this.pos)) break
      const attrName = this.readUntil(/[\s=]/)
      this.skipWhitespace()
      if (this.xml[this.pos] === "=") {
        this.pos++ // Salta '='
        this.skipWhitespace()
        const attrValue = this.parseAttributeValue()
        attrs[attrName] = attrValue
      } else {
        attrs[attrName] = ""
      }
    }
    return attrs
  }

  private parseAttributeValue(): string | Expression {
    const current = this.xml[this.pos]
    if (current === '"' || current === "'") {
      this.pos++ // Salta la comilla de apertura
      const value = this.readUntil(current)
      this.pos++ // Salta la comilla de cierre
      return value
    } else if (current === "`") {
      // Nuevo caso: backticks → template literal
      this.pos++; // salta el `
      const value = this.readUntil("`");
      this.pos++; // salta el `
      // Devolvemos una Expression que ya incluye los backticks
      return { expression: `\`${value}\`` };
    } else if (current === "{") {
      const code = this.parseCodeBlock().trim()
      return { expression: code }
    }
    return ""
  }

  /**
   * Parsea un bloque de código delimitado por '{' y '}'.
   * Se gestiona la profundidad para soportar anidamientos correctamente.
   */
  private parseCodeBlock(): string {
    this.pos++ // Salta '{'
    const start = this.pos
    let depth = 1
    while (this.pos < this.xml.length) {
      const char = this.xml[this.pos]
      if (char === "{") {
        depth++
      } else if (char === "}") {
        depth--
        if (depth === 0) {
          const code = this.xml.substring(start, this.pos)
          this.pos++ // Salta '}'
          return code
        }
      }
      this.pos++
    }
    return this.xml.substring(start, this.pos)
  }

  private readText(): string {
    const start = this.pos
    while (this.pos < this.xml.length && !["<", "{"].includes(this.xml[this.pos])) {
      this.pos++
    }
    return this.xml.substring(start, this.pos)
  }

  private readUntil(delimiter: string | RegExp): string {
    const start = this.pos
    while (this.pos < this.xml.length && !this.matches(delimiter)) {
      this.pos++
    }
    return this.xml.substring(start, this.pos)
  }

  private matches(delimiter: string | RegExp): boolean {
    if (typeof delimiter === "string") {
      return this.xml.startsWith(delimiter, this.pos)
    }
    return delimiter.test(this.xml[this.pos])
  }

  private skipWhitespace(): void {
    while (this.pos < this.xml.length && /\s/.test(this.xml[this.pos])) {
      this.pos++
    }
  }
}