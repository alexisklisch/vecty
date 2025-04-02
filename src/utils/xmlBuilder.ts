type Node = TextNode | ElementNode;

interface TextNode {
  text?: string;
  expression?: string;
}

interface ElementNode {
  tag: string;
  attributes: { [key: string]: string | Expression };
  children: Node[];
}

interface Expression {
  expression: string;
}

export class XMLBuilder {
  /**
   * Reconstruye el XML a partir del arreglo de nodos.
   */
  public build(nodes: Node[]): string {
    return nodes.map((node) => this.buildNode(node)).join('');
  }

  /**
   * Procesa el nodo según su tipo (elemento, texto o expresión).
   */
  private buildNode(node: Node): string {
    if ('tag' in node) {
      return this.buildElement(node as ElementNode);
    } else if ('text' in node) {
      return node.text!;
    } else if ('expression' in node) {
      return node.expression!;
    }
    return '';
  }

  /**
   * Reconstruye un elemento XML.
   * Si el elemento no tiene hijos, se genera una etiqueta autoconclusiva.
   */
  private buildElement(node: ElementNode): string {
    const tag = node.tag;
    const attrs = this.buildAttributes(node.attributes);
    const children = node.children.map((child) => this.buildNode(child)).join('');
    if (children.length === 0) {
      return `<${tag}${attrs}/>`;
    } else {
      return `<${tag}${attrs}>${children}</${tag}>`;
    }
  }

  /**
   * Reconstruye los atributos sin aplicar escapes, para conservar
   * el mismo formato original.
   */
  private buildAttributes(attrs: { [key: string]: string | Expression }): string {
    const keys = Object.keys(attrs);
    if (keys.length === 0) return '';
    return keys
      .map((key) => {
        const value = typeof attrs[key] === 'string' ? attrs[key] : (attrs[key] as Expression).expression;
        return ` ${key}="${value}"`;
      })
      .join('');
  }
}
