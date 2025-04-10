import { VectyPlugin } from "./types-vecty/plugins";
import { MergePluginConfigs } from "./types-vecty/utils";

export interface BaseConfig {
  variables?: Record<string, any>
  plugins?: readonly VectyPlugin[]
}

export type VectyConfig<P extends readonly VectyPlugin[] = readonly []> = BaseConfig & { plugins?: P } & MergePluginConfigs<P>
