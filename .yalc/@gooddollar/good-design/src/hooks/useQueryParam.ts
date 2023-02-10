import { useMemo } from "react";
// @ts-ignore
import { decodeBase64Params } from "@gooddollar/web3sdk-v2";

export const useQueryParam = (param: string, decode = false) => {
  const { search, hash } = window.location;

  return useMemo(() => {
    // in case of hash we have empty search field
    const queryString = search || hash?.split("?")[1];
    const params = new URLSearchParams(queryString);
    const result = params.get(param);

    if (result === null || !decode) {
      return result;
    }

    return decodeBase64Params(result);
  }, [param, decode]);
};
