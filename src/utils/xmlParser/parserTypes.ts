type TupleToUnion<T extends any[]> = T[number]

export type ExpressionNode = {
  type: 'expr'
  content: string
}
export type TextNode = {
  type: 'text',
  content: string
}
export type TagNode = {
  type: 'tag'
  tag: string
  attr: Record<string, string | ExpressionNode>
  child: Node[]
}

export type Node = TupleToUnion<[ExpressionNode, TextNode, TagNode]>