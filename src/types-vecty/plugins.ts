import { evaluateExpression } from "@/utils/evaluateExpression";
import { VectyConfig } from "@/vectyTypes";
import { ElementNode, TextNode } from "@/utils/xmlParser/commonTypes";
import type Vecty from "@/index";


export interface PluginContext {
  variables: VectyConfig['variables']
  evaluateExpression: typeof evaluateExpression
  vectyConfig: VectyConfig
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
  onElement?(node: ElementNode | TextNode, context: PluginContext): ElementNode | null | undefined;

  /** Se llama al final, sobre el SVG string */
  afterRender?(svg: string, variables: VectyConfig['variables']): string;
}