import path from "path";
import ts from "typescript";

export function resolveTsConfig(tsconfig?: string): string {
  return !!tsconfig ? path.resolve(process.cwd(), tsconfig) : path.resolve(__dirname, "../tsconfig.json");
}

export function loadProgramConfig(configFile: string, compilerOptions: ts.CompilerOptions) {
  const tsconfig = ts.readConfigFile(configFile, ts.sys.readFile).config;

  tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  tsconfig.compilerOptions = {
    ...tsconfig.compilerOptions,
    ...compilerOptions
  };

  const parsed = ts.parseJsonConfigFileContent(tsconfig, ts.sys, path.dirname(configFile));

  return parsed;
}

export function transpile(content: string, configFile: string) {
  return ts.transpileModule(content, {
    compilerOptions: loadProgramConfig(configFile, { noEmit: true }).options
  });
}
