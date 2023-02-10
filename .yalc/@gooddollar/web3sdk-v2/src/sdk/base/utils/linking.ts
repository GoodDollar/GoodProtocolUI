import { Linking, Platform } from "react-native";
import { isEmpty, isString, toPairs } from "lodash";
import { tryJson } from "./json";

const schemeRe = /(.+?:)\/\//;

interface IWindowOptions {
  noopener?: boolean;
  width?: string;
  height?: string;
}

export async function openLink(uri: string, target: "_blank" | "_self" = "_blank", options: IWindowOptions = {}) {
  if (Platform.OS === "web") {
    const args = [new URL(uri, window.location.href).toString(), target];
    const { noopener = false, ...opts } = options || {};

    if (!isEmpty(options)) {
      const optsList: string[] = toPairs(opts).map(([key, value]) => `${key}: '${value}'`);

      if (noopener) {
        optsList.push("noopener");
      }

      args.push(optsList.join(", "));
    }

    window.open(...args);
    return;
  }

  // need to return original promise for compatibility
  let result;

  try {
    result = await Linking.openURL(uri);
  } catch (exception) {
    let error = exception;

    // check does sheme supported to make sure the exception is about this case
    const isSchemeSupported = await Linking.canOpenURL(uri).catch(() => false);

    if (!isSchemeSupported) {
      const [, scheme] = schemeRe.exec(uri) as string[];

      error = new Error(`There aren't apps installed can handle '${scheme}' scheme`);
    }

    throw error;
  }

  return result;
}

export const encodeBase64Params = (value: any) => encodeURIComponent(btoa(isString(value) ? value : JSON.stringify(value)))

export const decodeBase64Params = (value: string) => tryJson(atob(decodeURIComponent(value)));
