import path from "path";
import ts from "typescript";
import { resolveProjectRoot } from "../resolvers";
import { IPluginContext, IPluginRuleVue } from "../contract";
import { defaultPluginRuleVue } from "../consts";

export function getRuleVue(context: IPluginContext): IPluginRuleVue {
  return context.configs.rules.vue || { ...defaultPluginRuleVue };
}

export function vueExportNotFoundInTs(
  this: IPluginContext,
  warning: any
): boolean {
  const valid = true;
  if (getRuleVue(this).ignoreModuleExportNotFoundForTs) {
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
  const rootDir = resolveProjectRoot(this["tsconfig"], this["configs"].options);
  const filepath = path.relative(
    path.resolve(rootDir),
    path.resolve(path.dirname(filename), module)
  );
  const file = this["app"].getSourceFile(filepath + ".ts");
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
