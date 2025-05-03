import { ExpressionNode, Node, TagNode } from "./parserTypes";


export class XMLBuilder {
  constructor(private nodes: Node[]) {}

  /**
   * Builds the XML string from the parsed nodes.
   */
  public build(): string {
    return this.nodes.map((node) => this.buildNode(node)).join('');
  }

  /**
   * Process a node based on its type (tag, text, or expression).
   */
  private buildNode(node: Node): string {
    switch (node.type) {
      case 'tag':
        return this.buildTag(node);
      case 'text':
        return node.content;
      case 'expr':
        return `{${node.content}}`;
      default:
        return '';
    }
  }

  /**
   * Rebuilds an XML tag element.
   * If the element has no children, generates a self-closing tag.
   */
  private buildTag(node: TagNode): string {
    const tag = node.tag;
    const attrs = this.buildAttributes(node.attr);
    const children = node.child.map((child) => this.buildNode(child)).join('');
    
    if (children.length === 0) {
      return `<${tag}${attrs}/>`;
    } else {
      return `<${tag}${attrs}>${children}</${tag}>`;
    }
  }

  /**
   * Rebuilds attributes without applying escapes, to preserve
   * the original format.
   */
  private buildAttributes(attrs: Record<string, string | ExpressionNode>): string {
    const keys = Object.keys(attrs);
    if (keys.length === 0) {
      return '';
    }

    return keys
      .map((key) => {
        const val = attrs[key];
        
        if (typeof val === "string") {
          return ` ${key}="${val}"`;
        } else if (val.type === 'expr') {
          return ` ${key}={${val.content}}`;
        }
        return '';
      })
      .join("");
  }
}