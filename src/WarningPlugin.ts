import path from "path";
import ts from "typescript";
import { Compiler, Plugin, Stats } from "webpack";
import { loadProgramConfig } from "./utils";

export interface IPluginConfigs {
  options: Partial<{
    tsconfig: string;
    rootDir: string;
  }>;
  rules: Partial<{
    vue: {
      ignoreModuleExportNotFound: boolean;
    };
  }>;
}

const defaults: IPluginConfigs = {
  options: {
    tsconfig: "tsconfig.json",
    rootDir: "."
  },
  rules: {
    vue: {
      ignoreModuleExportNotFound: false
    }
  }
};

interface IContext {
  rootDir: string;
  app: ts.Program;
  rules: {
    ignoreModuleExportNotFound: boolean;
  };
}

interface IWarningContext extends IContext {
  warning: any;
}

export class WarningPlugin implements Plugin {
  private readonly configs!: IPluginConfigs;
  private readonly tsconfig: ts.ParsedCommandLine;
  private readonly app: ts.Program;

  public constructor(config: Partial<IPluginConfigs> = {}) {
    this.configs = {
      options: {
        ...defaults.options,
        ...(config && config.options)
      },
      rules: {
        ...defaults.rules,
        ...(config && config.rules)
      }
    };
    this.tsconfig = loadProgramConfig(this.configs.options.tsconfig!, {});
    this.app = ts.createProgram({
      options: this.tsconfig.options,
      rootNames: this.tsconfig.fileNames
    });
  }

  public apply(compiler: Compiler): void {
    compiler.hooks.done.tap("filter-warnings-plugin", (result: Stats) =>
      filterWarnings(result, {
        rootDir: this.configs.options.rootDir!,
        app: this.app,
        rules: {
          ignoreModuleExportNotFound: !!this.configs.rules.vue!
            .ignoreModuleExportNotFound
        }
      })
    );
  }
}

function filterWarnings(result: Stats, context: IContext): any[] {
  result.compilation.warnings = result.compilation.warnings.filter(
    (warning: any) => filterValidWarning({ ...context, warning })
  );
  return result.compilation.warnings;
}

function filterValidWarning({
  warning,
  app,
  rootDir,
  rules
}: IWarningContext): boolean {
  const valid = true;
  if (rules.ignoreModuleExportNotFound) {
    return valid;
  }
  const resource = warning["module"]["resource"] || "";
  const message = warning["error"]["message"] || "";
  const result = /export '(.+)' was not found in '(.+)'/g.exec(message);
  if (!result) {
    return valid;
  }
  const [_, interf, module] = result;
  const filename: string = resource.split("?")[0];
  // 只在vue文件中检查warnings
  if (!filename.endsWith(".vue")) {
    return valid;
  }
  const filepath = path.relative(
    path.resolve(rootDir),
    path.resolve(path.dirname(filename), module)
  );
  const file = app.getSourceFile(filepath + ".ts");
  const targets = file!.statements.filter(
    (i: any) => i["name"] && i["name"]["text"] && i["name"]["text"] === interf
  );
  if (!targets || targets.length === 0) {
    return valid;
  }
  const isInterf = targets.some(
    i => ts.isTypeAliasDeclaration(i) || ts.isInterfaceDeclaration(i)
  );
  return !isInterf;
}
