import { IPluginContext, IPluginRuleGlobal } from "../contract";
import { defaultPluginRuleGlobal } from "../consts";

export function getRuleGlobal(context: IPluginContext): IPluginRuleGlobal {
  return context.configs.rules.global || { ...defaultPluginRuleGlobal };
}

export function matchGlobalPattern(
  this: IPluginContext,
  warning: any
): boolean {
  const { match } = getRuleGlobal(this);
  const message: string = warning["error"]["message"] || "";
  for (const validator of match) {
    if (typeof validator === "string") {
      const matched = message.includes(validator);
      if (matched) return false;
    } else if (typeof validator === "function") {
      const matched = validator(warning);
      if (matched) return false;
    } else {
      const matched = validator.test(message);
      if (matched) return false;
    }
  }
  return true;
}
