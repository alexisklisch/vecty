import { VectyPlugin } from "@/types-vecty/plugins";

type PluginConfig<P> = P extends VectyPlugin<infer C> ? C : never

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never
  ) extends ((k: infer I) => void) ? I : never

export type MergePluginConfigs<P extends readonly VectyPlugin[]> = UnionToIntersection<PluginConfig<P[number]>>