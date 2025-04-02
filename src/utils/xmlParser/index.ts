import { XMLBuilder } from "@/utils/xmlParser/xmlBuilder";
import { SimpleXMLParser } from "@/utils/xmlParser/xmlParser";
import type { Node } from '@/utils/xmlParser/commonTypes'

export const parser = {
  parse: (svg: string) => {
    const parser = new SimpleXMLParser(svg)
    return parser.parse()
  },
  build: (node: Node[]) => {
    const builder = new XMLBuilder()
    return builder.build(node)
  }
}