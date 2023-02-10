import { Call, Falsy, QueryParams, RawCall, useConfig } from "@usedapp/core";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { Result } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseProvider, JsonRpcProvider, Provider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { noop } from "lodash";

const ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)"
];
const ABI2 = [
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public view returns (tuple(bool success, bytes returnData)[])"
];

export type CallsResult = Array<
  RawCall & {
    success: boolean;
    value: string;
    decoded?: Result;
  }
>;

export async function multicall2(
  provider: Provider,
  address: string,
  blockNumber: number,
  requests: RawCall[]
): Promise<CallsResult> {
  if (requests.length === 0) {
    return [];
  }
  const contract = new Contract(address, ABI2, provider);
  const results: [boolean, string][] = await contract.tryAggregate(
    false,
    requests.map(({ address, data }) => [address, data]),
    { blockTag: blockNumber }
  );
  const state = requests.map((r, i) => {
    const { address, data } = r;
    const [success, value] = results[i];
    const result = { ...r, address, data, value, success };
    return result;
  });
  return state;
}

export async function multicall(
  provider: Provider,
  address: string,
  blockNumber: number,
  requests: RawCall[]
): Promise<CallsResult> {
  if (requests.length === 0) {
    return [];
  }
  const contract = new Contract(address, ABI, provider);
  const [, results]: [BigNumber, string[]] = await contract.aggregate(
    requests.map(({ address, data }) => [address, data]),
    { blockTag: blockNumber }
  );
  const state = requests.map((r, i) => {
    const { address, data } = r;
    const result = { ...r, address, data, value: results[i], success: true };
    return result;
  });
  return state;
}

export const useReadOnlyProvider = (chainId: number) => {
  const { readOnlyUrls, pollingInterval } = useConfig();

  const provider = useMemo<JsonRpcProvider | undefined>(() => {
    if (!readOnlyUrls || !readOnlyUrls[chainId]) {
      return;
    }

    const factory = readOnlyUrls[chainId];

    if (factory instanceof BaseProvider) {
      return factory as JsonRpcProvider;
    }

    if (typeof factory === "function") {
      return (factory as any)() as JsonRpcProvider;
    }

    const provider = new JsonRpcProvider(factory as any);

    provider.pollingInterval = pollingInterval;
    return provider;
  }, [readOnlyUrls, pollingInterval, chainId]);

  return provider;
};

/**
 * @internal Intended for internal use - use it on your own risk
 */
export function validateCall(call: Call): Call {
  const { contract, method, args } = call;
  if (!contract.address || !method) {
    throw new Error("Missing contract address or method name");
  }

  try {
    contract.interface.encodeFunctionData(method, args);
    return call;
  } catch (err: any) {
    throw new Error(`Invalid contract call for method="${method}" on contract="${contract.address}": ${err.message}`);
  }
}

/* @internal Intended for internal use - use it on your own risk
 * @returns
 * One of these:
 * - a RawCall, if encoding is successful.
 * - Falsy, if there is no call to encode.
 * - an Error, if encoding fails (e.g. because of mismatched arguments).
 */
function encodeCallData(call: Call | Falsy, chainId: number, queryParams: QueryParams = {}): RawCall | Falsy | Error {
  if (!call) {
    return undefined;
  }
  try {
    validateCall(call);
  } catch (e: any) {
    return e;
  }
  const { contract, method, args } = call;
  const isStatic = queryParams.isStatic ?? queryParams.refresh === "never";
  const refreshPerBlocks = typeof queryParams.refresh === "number" ? queryParams.refresh : undefined;

  return {
    address: contract.address,
    data: contract.interface.encodeFunctionData(method, args),
    chainId,
    isStatic,
    refreshPerBlocks
  };
}

/**
 * perform multicall requests to a specific chain using readonly rpcs from usedapp
 */
export const useMulticallAtChain = (chainId: number) => {
  const provider = useReadOnlyProvider(chainId);
  const { multicallVersion, multicallAddresses } = useConfig();
  const pendingCalls = useRef<{ resolve?: any; calls: Call[]; blockNumber?: number }>({ calls: [] });

  const _resolve = useCallback(
    async (calls: Call[], blockNumber?: number) => {
      const multiAddr =
        multicallAddresses && Object.entries(multicallAddresses).find(([k]) => k === String(chainId));

      if (provider && multiAddr) {
        
        const method = multicallVersion === 1 ? multicall : multicall2;
        const address = multiAddr[1];
        const rawcalls = calls.map(call => encodeCallData(call, chainId)).filter(Boolean) as RawCall[];
        const currentBlock = await provider.getBlockNumber();
        const results = await method(provider, address, blockNumber || currentBlock, rawcalls);
        results.forEach((r, i) => {
          const call = calls[i];
          r.decoded = call.contract.interface.decodeFunctionResult(call.method, r.value);
        });
        return results;
      }
    },
    [multicallAddresses, provider, multicallVersion, chainId]
  );

  const callMulti = useCallback(
    async (calls: Call[], blockNumber?: number) => {
      if (!provider) {
        const p = new Promise<CallsResult | undefined>(res => {
          pendingCalls.current.calls = pendingCalls.current.calls.concat(calls);
          pendingCalls.current.resolve = res;
          pendingCalls.current.blockNumber = blockNumber;
        });

        return p;
      }
      
      return _resolve(calls, blockNumber);
    },
    [provider]
  );

  /*
        this will handle the case if we got calls before we had a provider
    */
  useEffect(() => {
    if (provider && pendingCalls.current.calls.length > 0) {
      const calls = pendingCalls.current.calls;
      const resolve = pendingCalls.current.resolve;
      const bn = pendingCalls.current.blockNumber;

      pendingCalls.current = { calls: [] };
      _resolve(calls, bn).then(resolve).catch(noop);
    }
  }, [provider]);

  return callMulti;
};
