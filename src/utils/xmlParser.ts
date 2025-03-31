import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const commonConfig = { preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' }
export const parser = new XMLParser(commonConfig)
export const builder = new XMLBuilder(commonConfig)

export const xmlParser = {
  parser: parser.parse,
  builder: builder.build
}