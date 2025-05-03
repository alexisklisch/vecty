import { XMLBuilder } from "@/utils/xmlParser/xmlBuilder";
import { XMLParser } from "@/utils/xmlParser/xmlParser";
import type { Node } from '@/utils/xmlParser/commonTypes'

export const parser = {
  parse: (xml: string) => {
    const parser = new XMLParser(xml)
    return parser.parse()
  },
  build: (node: Node[]) => {
    const builder = new XMLBuilder()
    return builder.build(node)
  }
}