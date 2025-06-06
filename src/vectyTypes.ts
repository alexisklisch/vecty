import type { Node, TagNode } from './utils/xmlParser/parserTypes'

export interface VectyConfig {
  variables?: Record<string, any>
  plugins?: Plugin[]
}

export interface ExportOptions {
  mode?: 'object' | 'xml'
  variant?: string[] | string | (string | undefined)[]
}

export interface PluginContext {
  variables: Record<string, any>
  parser: {
    parse: (source: string) => Node[]
    build: (nodes: Node[]) => string
  }
  evaluateExpression: (expression: string, variables: Record<string, any>, variant?: string) => any
  currentVariant?: string
}

export interface PluginHooks {
  onInit?: (context: PluginContext) => void
  onNode?: (node: Node, context: PluginContext) => void
  onFinish?: (context: PluginContext) => void
}

export type PluginConfig = Record<string, any>

export type Plugin = (config?: PluginConfig) => PluginHooks
