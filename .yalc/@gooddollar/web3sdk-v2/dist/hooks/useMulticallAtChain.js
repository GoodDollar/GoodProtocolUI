"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMulticallAtChain = exports.validateCall = exports.useReadOnlyProvider = exports.multicall = exports.multicall2 = void 0;
const core_1 = require("@usedapp/core");
const react_1 = require("react");
const providers_1 = require("@ethersproject/providers");
const ethers_1 = require("ethers");
const lodash_1 = require("lodash");
const ABI = [
    "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)"
];
const ABI2 = [
    "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) public view returns (tuple(bool success, bytes returnData)[])"
];
async function multicall2(provider, address, blockNumber, requests) {
    if (requests.length === 0) {
        return [];
    }
    const contract = new ethers_1.Contract(address, ABI2, provider);
    const results = await contract.tryAggregate(false, requests.map(({ address, data }) => [address, data]), { blockTag: blockNumber });
    const state = requests.map((r, i) => {
        const { address, data } = r;
        const [success, value] = results[i];
        const result = { ...r, address, data, value, success };
        return result;
    });
    return state;
}
exports.multicall2 = multicall2;
async function multicall(provider, address, blockNumber, requests) {
    if (requests.length === 0) {
        return [];
    }
    const contract = new ethers_1.Contract(address, ABI, provider);
    const [, results] = await contract.aggregate(requests.map(({ address, data }) => [address, data]), { blockTag: blockNumber });
    const state = requests.map((r, i) => {
        const { address, data } = r;
        const result = { ...r, address, data, value: results[i], success: true };
        return result;
    });
    return state;
}
exports.multicall = multicall;
const useReadOnlyProvider = (chainId) => {
    const { readOnlyUrls, pollingInterval } = (0, core_1.useConfig)();
    const provider = (0, react_1.useMemo)(() => {
        if (!readOnlyUrls || !readOnlyUrls[chainId]) {
            return;
        }
        const factory = readOnlyUrls[chainId];
        if (factory instanceof providers_1.BaseProvider) {
            return factory;
        }
        if (typeof factory === "function") {
            return factory();
        }
        const provider = new providers_1.JsonRpcProvider(factory);
        provider.pollingInterval = pollingInterval;
        return provider;
    }, [readOnlyUrls, pollingInterval, chainId]);
    return provider;
};
exports.useReadOnlyProvider = useReadOnlyProvider;
/**
 * @internal Intended for internal use - use it on your own risk
 */
function validateCall(call) {
    const { contract, method, args } = call;
    if (!contract.address || !method) {
        throw new Error("Missing contract address or method name");
    }
    try {
        contract.interface.encodeFunctionData(method, args);
        return call;
    }
    catch (err) {
        throw new Error(`Invalid contract call for method="${method}" on contract="${contract.address}": ${err.message}`);
    }
}
exports.validateCall = validateCall;
/* @internal Intended for internal use - use it on your own risk
 * @returns
 * One of these:
 * - a RawCall, if encoding is successful.
 * - Falsy, if there is no call to encode.
 * - an Error, if encoding fails (e.g. because of mismatched arguments).
 */
function encodeCallData(call, chainId, queryParams = {}) {
    var _a;
    if (!call) {
        return undefined;
    }
    try {
        validateCall(call);
    }
    catch (e) {
        return e;
    }
    const { contract, method, args } = call;
    const isStatic = (_a = queryParams.isStatic) !== null && _a !== void 0 ? _a : queryParams.refresh === "never";
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
const useMulticallAtChain = (chainId) => {
    const provider = (0, exports.useReadOnlyProvider)(chainId);
    const { multicallVersion, multicallAddresses } = (0, core_1.useConfig)();
    const pendingCalls = (0, react_1.useRef)({ calls: [] });
    const _resolve = (0, react_1.useCallback)(async (calls, blockNumber) => {
        const multiAddr = multicallAddresses && Object.entries(multicallAddresses).find(([k]) => k === String(chainId));
        if (provider && multiAddr) {
            const method = multicallVersion === 1 ? multicall : multicall2;
            const address = multiAddr[1];
            const rawcalls = calls.map(call => encodeCallData(call, chainId)).filter(Boolean);
            const currentBlock = await provider.getBlockNumber();
            const results = await method(provider, address, blockNumber || currentBlock, rawcalls);
            results.forEach((r, i) => {
                const call = calls[i];
                r.decoded = call.contract.interface.decodeFunctionResult(call.method, r.value);
            });
            return results;
        }
    }, [multicallAddresses, provider, multicallVersion, chainId]);
    const callMulti = (0, react_1.useCallback)(async (calls, blockNumber) => {
        if (!provider) {
            const p = new Promise(res => {
                pendingCalls.current.calls = pendingCalls.current.calls.concat(calls);
                pendingCalls.current.resolve = res;
                pendingCalls.current.blockNumber = blockNumber;
            });
            return p;
        }
        return _resolve(calls, blockNumber);
    }, [provider]);
    /*
          this will handle the case if we got calls before we had a provider
      */
    (0, react_1.useEffect)(() => {
        if (provider && pendingCalls.current.calls.length > 0) {
            const calls = pendingCalls.current.calls;
            const resolve = pendingCalls.current.resolve;
            const bn = pendingCalls.current.blockNumber;
            pendingCalls.current = { calls: [] };
            _resolve(calls, bn).then(resolve).catch(lodash_1.noop);
        }
    }, [provider]);
    return callMulti;
};
exports.useMulticallAtChain = useMulticallAtChain;
//# sourceMappingURL=useMulticallAtChain.js.map