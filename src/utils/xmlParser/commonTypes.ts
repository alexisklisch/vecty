export interface TextNode {
  text?: string
  expression?: string
}

export interface Expression {
  expression: string;
}

export type Node = TextNode | ElementNode

export interface ElementNode {
  tag: string
  attr: { [key: string]: string | Expression }
  children: Node[]
}
