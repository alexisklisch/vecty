import { evaluateExpression } from "@/utils/evaluateExpression";
import { VectyConfig } from "@/vectyTypes";
import { Node, TextNode } from "@/utils/xmlParser/parserTypes";
import type Vecty from "@/index";
import { parser } from "@/utils/xmlParser";


export interface PluginContext {
  variables: VectyConfig['variables']
  evaluateExpression: typeof evaluateExpression
  vectyConfig: VectyConfig
  parser: typeof parser
}

export interface VectyPlugin<C = {}> {
  /** Nombre único */
  readonly name: string
  readonly __config?: C

  /** Se llama justo después de new Vecty() */
  init?(vecty: Vecty, variables: VectyConfig['variables']): void;

  /** Se llama antes de procesar cada nodo del AST.
   *  Devuelve:
   *   - `null` para eliminar el nodo
   *   - un nuevo nodo para reemplazarlo
   *   - `undefined` para no tocarlo
   */
  onElement?(node: Node | TextNode, context: PluginContext): Node | null | undefined;

  /** Se llama al final, sobre el SVG string */
  afterRender?(svg: string, variables: VectyConfig['variables']): string;
}