import ts from "typescript";

export interface IPluginOptions {
  tsconfig: string;
  rootDir: string;
}

export interface IPluginRules {
  vue: IPluginRuleVue;
  global: IPluginRuleGlobal;
}

export interface IPluginRuleVue {
  ignoreModuleExportNotFoundForTs: boolean;
}

export interface IPluginRuleGlobal {
  match: Array<RegExp | string | ((error: any) => boolean)>;
}

export interface IPluginConfigs {
  options: Partial<IPluginOptions>;
  rules: Partial<IPluginRules>;
}

export interface IInnerPluginConfigs {
  options: IPluginOptions;
  rules: IPluginRules;
}

export interface IPluginContext {
  tsconfig: ts.ParsedCommandLine;
  app: ts.Program;
  configs: IInnerPluginConfigs;
}

export interface IPluginValidator {
  (this: IPluginContext, warning: any): boolean;
}
