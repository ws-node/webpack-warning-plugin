import path from "path";
import ts from "typescript";
import { IPluginOptions } from "./contract";
import { defaultPluginConfigs } from "./consts";

export function resolveProjectRoot(
  tsconfig: ts.ParsedCommandLine,
  options: Partial<IPluginOptions>
): string {
  const baseUrl = tsconfig.options.baseUrl;
  const rootDir = !baseUrl
    ? options.rootDir || defaultPluginConfigs.options.rootDir!
    : path.resolve(resolveTsconfigFolder(options), baseUrl);
  return rootDir;
}

export function resolveTsconfigFolder(options: Partial<IPluginOptions>) {
  return path.resolve(
    process.cwd(),
    path.dirname(options.tsconfig || defaultPluginConfigs.options.tsconfig!)
  );
}
