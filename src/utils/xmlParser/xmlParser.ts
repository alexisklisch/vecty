import { ExpressionNode, Node, TagNode } from "./parserTypes"

export class XMLParser {
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
        // Parse expression block
        const expr = this.parseCodeBlock().trim()
        nodes.push({ type: 'expr', content: expr })
      } else {
        const text = this.readText()
        if (text.trim().length > 0) nodes.push({ type: 'text', content: text })
      }
    }
    return nodes
  }
  
  private parseElement(): TagNode {
    this.pos++ // Skip '<'
    const tag = this.readUntil(/[\s>/]/)
    this.skipWhitespace()
    const attr = this.parseAttributes()
    this.skipWhitespace()
    
    let child: Node[] = []
    if (this.xml.startsWith("/>", this.pos)) {
      this.pos += 2
    } else if (this.xml[this.pos] === ">") {
      this.pos++ // Skip '>'
      child = this.parseNodes()
      if (this.xml.startsWith("</", this.pos)) {
        this.pos += 2 // Skip '</'
        this.readUntil(">")
        this.pos++ // Skip '>'
      }
    }
    
    return { type: 'tag', tag, attr, child }
  }
  
  private parseAttributes(): Record<string, string | ExpressionNode> {
    const attrs: Record<string, string | ExpressionNode> = {}
    while (this.pos < this.xml.length) {
      this.skipWhitespace()
      if (this.xml[this.pos] === ">" || this.xml.startsWith("/>", this.pos)) break
      
      const attrName = this.readUntil(/[\s=]/)
      this.skipWhitespace()
      
      if (this.xml[this.pos] === "=") {
        this.pos++ // Skip '='
        this.skipWhitespace()
        const attrValue = this.parseAttributeValue()
        attrs[attrName] = attrValue
      } else {
        attrs[attrName] = ""
      }
    }
    return attrs
  }
  
  private parseAttributeValue(): string | ExpressionNode {
    const current = this.xml[this.pos]
    if (current === '"' || current === "'") {
      this.pos++ // Skip opening quote
      const value = this.readUntil(current)
      this.pos++ // Skip closing quote
      return value
    } else if (current === "`") {
      // Template literal case
      this.pos++ // Skip opening backtick
      const value = this.readUntil("`")
      this.pos++ // Skip closing backtick
      return { type: 'expr', content: `\`${value}\`` }
    } else if (current === "{") {
      const code = this.parseCodeBlock().trim()
      return { type: 'expr', content: code }
    }
    return ""
  }
  
  /**
   * Parse a code block delimited by '{' and '}'.
   * Manages depth to support proper nesting.
   */
  private parseCodeBlock(): string {
    this.pos++ // Skip '{'
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
          this.pos++ // Skip '}'
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