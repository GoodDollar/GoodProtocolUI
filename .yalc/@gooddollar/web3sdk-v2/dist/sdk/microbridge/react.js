"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBridgeHistory = exports.useRelayTx = exports.useBridge = exports.useGetBridgeData = exports.useWithinBridgeLimits = exports.useGetBridgeContracts = void 0;
const lodash_1 = require("lodash");
const sdk_js_1 = require("@gooddollar/bridge-app/dist/sdk.js");
const TokenBridge_json_1 = __importDefault(require("@gooddollar/bridge-contracts/artifacts/contracts/bridge/TokenBridge.sol/TokenBridge.json"));
const deployment_json_1 = __importDefault(require("@gooddollar/bridge-contracts/release/deployment.json"));
const core_1 = require("@usedapp/core");
const ethers_1 = require("ethers");
const lodash_2 = require("lodash");
const react_1 = require("react");
const contexts_1 = require("../../contexts");
const useRefreshOrNever_1 = __importDefault(require("../../hooks/useRefreshOrNever"));
const react_2 = require("../base/react");
const constants_1 = require("../constants");
const useGetBridgeContracts = () => {
    const { baseEnv } = (0, react_2.useGetEnvChainId)();
    const { fuseBridge, celoBridge } = deployment_json_1.default[baseEnv] || {};
    if (fuseBridge && celoBridge) {
        return {
            [constants_1.SupportedChains.FUSE]: new ethers_1.Contract(fuseBridge, TokenBridge_json_1.default.abi),
            [constants_1.SupportedChains.CELO]: new ethers_1.Contract(celoBridge, TokenBridge_json_1.default.abi)
        };
    }
    else
        return {};
};
exports.useGetBridgeContracts = useGetBridgeContracts;
const useWithinBridgeLimits = (requestChainId, account, amount) => {
    var _a;
    const bridgeContract = (0, exports.useGetBridgeContracts)()[requestChainId];
    const canBridge = (0, core_1.useCalls)([
        {
            contract: bridgeContract,
            method: "canBridge",
            args: [account, amount]
        }
    ].filter(() => bridgeContract && account && amount), {
        refresh: "never",
        chainId: requestChainId
    });
    const [isValid = false, reason = ""] = ((_a = canBridge === null || canBridge === void 0 ? void 0 : canBridge[0]) === null || _a === void 0 ? void 0 : _a.value) || [];
    return { isValid, reason };
};
exports.useWithinBridgeLimits = useWithinBridgeLimits;
const useGetBridgeData = (requestChainId, account) => {
    var _a, _b, _c, _d;
    const bridgeContract = (0, exports.useGetBridgeContracts)()[requestChainId];
    const results = (0, core_1.useCalls)([
        {
            contract: bridgeContract,
            method: "bridgeFees",
            args: []
        },
        {
            contract: bridgeContract,
            method: "bridgeLimits",
            args: []
        },
        {
            contract: bridgeContract,
            method: "bridgeDailyLimit",
            args: []
        },
        account && {
            contract: bridgeContract,
            method: "accountsDailyLimit",
            args: [account]
        }
    ].filter(_ => _ && bridgeContract), {
        refresh: "never",
        chainId: requestChainId
    });
    return {
        bridgeFees: (_a = results === null || results === void 0 ? void 0 : results[0]) === null || _a === void 0 ? void 0 : _a.value,
        bridgeLimits: (_b = results === null || results === void 0 ? void 0 : results[1]) === null || _b === void 0 ? void 0 : _b.value,
        bridgeDailyLimit: (_c = results === null || results === void 0 ? void 0 : results[2]) === null || _c === void 0 ? void 0 : _c.value,
        accountDailyLimit: (_d = results === null || results === void 0 ? void 0 : results[3]) === null || _d === void 0 ? void 0 : _d.value
    };
};
exports.useGetBridgeData = useGetBridgeData;
const useBridge = (withRelay = false) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const lock = (0, react_1.useRef)(false);
    const { switchNetwork } = (0, contexts_1.useSwitchNetwork)();
    const { account, chainId } = (0, core_1.useEthers)();
    const g$Contract = (0, react_2.useGetContract)("GoodDollar");
    const bridgeContracts = (0, exports.useGetBridgeContracts)();
    const bridgeContract = bridgeContracts[chainId || 122];
    const relayTx = (0, exports.useRelayTx)();
    const [bridgeRequest, setBridgeRequest] = (0, react_1.useState)();
    const [selfRelayStatus, setSelfRelay] = (0, react_1.useState)();
    // const bridgeTo = useContractFunction(bridgeContract, "bridgeTo", {});
    const transferAndCall = (0, core_1.useContractFunction)(g$Contract, "transferAndCall", {});
    const bridgeRequestId = (_e = (_d = (_c = (((_b = (_a = transferAndCall.state) === null || _a === void 0 ? void 0 : _a.receipt) === null || _b === void 0 ? void 0 : _b.logs) || [])
        .filter(log => log.address === bridgeContract.address)
        .map(log => bridgeContract.interface.parseLog(log))) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.args) === null || _e === void 0 ? void 0 : _e.id;
    // poll target chain for transfer if bridgeRequestEvent was found
    const relayEvent = (0, core_1.useLogs)(bridgeRequest &&
        bridgeRequestId && {
        contract: (_f = bridgeContracts[bridgeRequest.targetChainId]) !== null && _f !== void 0 ? _f : { address: ethers_1.ethers.constants.AddressZero },
        event: "ExecutedTransfer",
        args: [null, null, null, null, null, null, null, bridgeRequestId]
    }, {
        refresh: (0, useRefreshOrNever_1.default)(bridgeRequestId ? 5 : "never"),
        chainId: bridgeRequest === null || bridgeRequest === void 0 ? void 0 : bridgeRequest.targetChainId,
        fromBlock: -1000
    });
    const relayStatus = relayEvent &&
        {
            chainId: bridgeRequest === null || bridgeRequest === void 0 ? void 0 : bridgeRequest.targetChainId,
            status: ((_g = relayEvent === null || relayEvent === void 0 ? void 0 : relayEvent.value) === null || _g === void 0 ? void 0 : _g.length) ? "Success" : "Mining",
            transaction: { hash: (_j = (_h = relayEvent === null || relayEvent === void 0 ? void 0 : relayEvent.value) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.transactionHash }
        };
    const sendBridgeRequest = (0, react_1.useCallback)(async (amount, sourceChain, target = account) => {
        setBridgeRequest(undefined);
        lock.current = false;
        transferAndCall.resetState();
        const targetChainId = sourceChain === "fuse" ? constants_1.SupportedChains.CELO : constants_1.SupportedChains.FUSE;
        const sourceChainId = sourceChain === "fuse" ? constants_1.SupportedChains.FUSE : constants_1.SupportedChains.CELO;
        await (async () => {
            if (sourceChainId !== chainId) {
                await switchNetwork(sourceChainId);
            }
            setBridgeRequest({ amount, sourceChainId, targetChainId, target });
        })().catch(lodash_1.noop);
    }, [transferAndCall, switchNetwork, setBridgeRequest, chainId]);
    // trigger the actual bridge request
    (0, react_1.useEffect)(() => {
        if (transferAndCall.state.status === "None" && bridgeRequest && account && !lock.current) {
            lock.current = true;
            // we use transfer and call to save the approve step
            const encoded = ethers_1.ethers.utils.defaultAbiCoder.encode(["uint256", "address"], [bridgeRequest.targetChainId, bridgeRequest.target || account]);
            transferAndCall
                .send(bridgeContract.address, bridgeRequest.amount, encoded)
                .then(async (sendTx) => {
                if (sendTx && withRelay) {
                    let relayTxHash = "";
                    try {
                        setSelfRelay({
                            status: "None",
                            transaction: {}
                        });
                        const { relayTxHash: txHash = "", relayPromise } = await relayTx(chainId || 0, bridgeRequest.targetChainId, sendTx.transactionHash);
                        relayTxHash = txHash;
                        setSelfRelay({
                            chainId: chainId,
                            status: relayTxHash ? "Mining" : "Fail",
                            transaction: { hash: relayTxHash }
                        });
                        await relayPromise;
                        setSelfRelay({
                            status: "Success",
                            chainId: chainId,
                            transaction: { hash: relayTxHash }
                        });
                    }
                    catch (e) {
                        console.log("transferAndCall catch:", { e });
                        setSelfRelay({
                            ...selfRelayStatus,
                            status: "Exception",
                            chainId: chainId,
                            errorMessage: e.message,
                            transaction: { hash: relayTxHash }
                        });
                    }
                }
            })
                .catch(lodash_1.noop);
        }
    }, [bridgeContract, bridgeRequest, transferAndCall, lock]);
    return { sendBridgeRequest, bridgeRequestStatus: transferAndCall === null || transferAndCall === void 0 ? void 0 : transferAndCall.state, relayStatus, selfRelayStatus };
};
exports.useBridge = useBridge;
const delay = (millis) => {
    return new Promise(res => setTimeout(res, millis));
};
const useRelayTx = () => {
    const contracts = (0, exports.useGetBridgeContracts)();
    const { library, chainId } = (0, core_1.useEthers)();
    const { switchNetwork } = (0, contexts_1.useSwitchNetwork)();
    const { baseEnv } = (0, react_2.useGetEnvChainId)();
    const { registry = "0x44a1E0A83821E239F9Cef248CECc3AC5b910aeD2" } = deployment_json_1.default[baseEnv] || {};
    const signer = library === null || library === void 0 ? void 0 : library.getSigner();
    const sdk = new sdk_js_1.BridgeSDK(registry, (0, lodash_2.mapValues)(contracts, _ => _ === null || _ === void 0 ? void 0 : _.address), 50);
    const relayTx = (0, react_1.useCallback)(async (sourceChain, targetChain, txHash) => {
        let relayResult;
        while (!relayResult) {
            try {
                if (chainId !== targetChain) {
                    await switchNetwork(targetChain);
                }
                const targetBalance = await signer.getBalance();
                if (targetBalance.lt(ethers_1.ethers.utils.parseEther("0.01"))) {
                    throw new Error(`not enough balance for self relay: ${targetBalance.toNumber() / 1e18}`);
                }
                // todo-fix: library connected to different signer, signer is connected wallet here
                relayResult = await sdk.relayTx(sourceChain, targetChain, txHash, signer);
                return relayResult;
            }
            catch (e) {
                // console.log("useRelayTX:", { error: e });
                //retry if checkpoint still missing or txhash not found yet
                if (!e.message.includes("does not exists yet") && !e.message.includes("txhash/targetReceipt not found")) {
                    throw e;
                }
                else {
                    await delay(30000);
                }
            }
        }
        return {};
    }, [sdk, signer, switchNetwork, chainId]);
    return relayTx;
};
exports.useRelayTx = useRelayTx;
const useBridgeHistory = () => {
    var _a, _b;
    const bridgeContracts = (0, exports.useGetBridgeContracts)();
    const refresh = (0, useRefreshOrNever_1.default)(12);
    const fuseOut = (0, core_1.useLogs)({
        contract: bridgeContracts[122],
        event: "BridgeRequest",
        args: []
    }, {
        chainId: 122,
        fromBlock: -2e5,
        refresh
    });
    const fuseIn = (0, core_1.useLogs)({
        contract: bridgeContracts[122],
        event: "ExecutedTransfer",
        args: []
    }, {
        chainId: 122,
        fromBlock: -2e5,
        refresh
    });
    const celoOut = (0, core_1.useLogs)({
        contract: bridgeContracts[42220],
        event: "BridgeRequest",
        args: []
    }, {
        chainId: 42220,
        fromBlock: -2e5,
        refresh
    });
    const celoIn = (0, core_1.useLogs)({
        contract: bridgeContracts[42220],
        event: "ExecutedTransfer",
        args: []
    }, {
        chainId: 42220,
        fromBlock: -2e5,
        refresh
    });
    const celoExecuted = (0, lodash_2.groupBy)((celoIn === null || celoIn === void 0 ? void 0 : celoIn.value) || [], _ => _.data.id);
    const fuseExecuted = (0, lodash_2.groupBy)((fuseIn === null || fuseIn === void 0 ? void 0 : fuseIn.value) || [], _ => _.data.id);
    (_a = fuseOut === null || fuseOut === void 0 ? void 0 : fuseOut.value) === null || _a === void 0 ? void 0 : _a.forEach(e => (e["relayEvent"] = (0, lodash_2.first)(celoExecuted[e.data.id])));
    (_b = celoOut === null || celoOut === void 0 ? void 0 : celoOut.value) === null || _b === void 0 ? void 0 : _b.forEach(e => (e["relayEvent"] = (0, lodash_2.first)(fuseExecuted[e.data.id])));
    return { fuseHistory: fuseOut, celoHistory: celoOut };
};
exports.useBridgeHistory = useBridgeHistory;
//# sourceMappingURL=react.js.map