export interface TextNode {
  text?: string
  expression?: string
}

interface Expression {
  expression: string;
}

export interface ElementNode {
  tag: string
  attr: { [key: string]: string | Expression }
  children: Node[]
}

export type Node = TextNode | ElementNode