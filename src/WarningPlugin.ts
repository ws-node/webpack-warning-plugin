import ts from "typescript";
import { Compiler, Plugin, Stats } from "webpack";
import { loadProgramConfig } from "./utils";
import {
  IPluginOptions,
  IPluginRules,
  IPluginConfigs,
  IInnerPluginConfigs,
  IPluginValidator
} from "./contract";
import { defaultPluginConfigs } from "./consts";
import {
  getRuleVue,
  vueExportNotFoundInTs
} from "./filters/vue-module-export-notfound";
import { matchGlobalPattern } from "./filters/global-match-ignore";

export class WarningPlugin implements Plugin {
  private readonly configs!: IInnerPluginConfigs;
  private readonly tsconfig!: ts.ParsedCommandLine;
  private readonly app!: ts.Program;

  public constructor(config: Partial<IPluginConfigs> = {}) {
    this.configs = {
      options: <IPluginOptions>{
        ...defaultPluginConfigs.options,
        ...(config && config.options)
      },
      rules: <IPluginRules>{
        ...defaultPluginConfigs.rules,
        ...(config && config.rules)
      }
    };
    try {
      this.tsconfig = loadProgramConfig(this.configs.options.tsconfig, {});
      this.app = ts.createProgram({
        options: this.tsconfig.options,
        rootNames: this.tsconfig.fileNames
      });
    } catch (error) {
      if (!getRuleVue(<any>this).ignoreModuleExportNotFoundForTs) {
        console.log(error);
        throw new Error("typescript is need but not prepared.");
      } else {
        console.log(error.message);
      }
    }
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tap("filter-warnings-plugin", (result: Stats) =>
      filterWarnings.call(this, result)
    );
  }
}

function filterWarnings(this: WarningPlugin, result: Stats): any[] {
  const validators: IPluginValidator[] = [
    matchGlobalPattern,
    vueExportNotFoundInTs
  ];
  result.compilation.warnings = result.compilation.warnings.filter(
    (warning: any) => {
      for (const validator of validators) {
        const valid = validator.call(<any>this, warning);
        if (!valid) return false;
      }
      return true;
    }
  );
  return result.compilation.warnings;
}
