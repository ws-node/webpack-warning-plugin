import {
  IPluginOptions,
  IPluginRuleVue,
  IPluginRuleGlobal,
  IPluginConfigs
} from "./contract";

export const defaultPluginOptions: IPluginOptions = {
  tsconfig: "tsconfig.json",
  rootDir: "."
};

export const defaultPluginRuleVue: IPluginRuleVue = {
  ignoreModuleExportNotFoundForTs: false
};

export const defaultPluginRuleGlobal: IPluginRuleGlobal = {
  match: []
};

export const defaultPluginRules = {
  vue: {
    ...defaultPluginRuleVue
  },
  global: {
    ...defaultPluginRuleGlobal
  }
};

export const defaultPluginConfigs: IPluginConfigs = {
  options: {
    ...defaultPluginOptions
  },
  rules: {
    ...defaultPluginRules
  }
};
