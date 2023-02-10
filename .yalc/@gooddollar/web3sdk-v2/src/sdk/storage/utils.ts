import { isArray, isEmpty } from "lodash";

export function stringifyPairs<T = any>(keyValuePairs: [string, T][]): [string, string][] | undefined {
  if (!isArray(keyValuePairs) || isEmpty(keyValuePairs)) {
    return;
  }

  return keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
}
