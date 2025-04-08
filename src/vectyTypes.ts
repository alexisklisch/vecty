import type Vecty from "@/index";
import { ElementNode } from "./utils/xmlParser/commonTypes";

export interface VectyConfig {
  variables?: Record<string, any>
  plugins?: VectyPlugin[]
}

export interface VectyPlugin {
  /** Nombre único */
  name: string;

  /** Se llama justo después de new Vecty() */
  init?(vecty: Vecty, variables: VectyConfig['variables']): void;

  /** Se llama antes de procesar cada nodo del AST.
   *  Devuelve:
   *   - `null` para eliminar el nodo
   *   - un nuevo nodo para reemplazarlo
   *   - `undefined` para no tocarlo
   */
  onElement?(node: ElementNode, variables: VectyConfig['variables']): ElementNode | null | undefined;

  /** Se llama al final, sobre el SVG string */
  afterRender?(svg: string, variables: VectyConfig['variables']): string;
}