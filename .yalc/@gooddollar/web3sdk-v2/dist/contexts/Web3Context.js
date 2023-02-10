"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwitchNetwork = exports.Web3Provider = exports.Celo = exports.Fuse = exports.TokenContext = exports.Web3Context = exports.txEmitter = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@usedapp/core");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const react_1 = require("react");
const lodash_1 = require("lodash"); // eslint-disable-line @typescript-eslint/no-unused-vars
const constants_1 = require("../sdk/constants");
const sdk_1 = require("../sdk");
const constants_2 = require("../sdk/constants");
const lodash_2 = require("lodash");
const ee = new eventemitter3_1.default();
exports.txEmitter = {
    on: ee.on.bind(ee, "txs"),
    emit: ee.emit.bind(ee, "txs")
};
exports.Web3Context = (0, react_1.createContext)({
    switchNetwork: undefined,
    setSwitchNetwork: (cb) => undefined,
    connectWallet: () => undefined,
    txEmitter: exports.txEmitter,
    env: "production"
});
exports.TokenContext = (0, react_1.createContext)((0, lodash_2.cloneDeep)(constants_1.G$Decimals));
exports.Fuse = {
    chainId: 122,
    chainName: "Fuse",
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: "0x3CE6158b7278Bf6792e014FA7B4f3c6c46fe9410",
    multicall2Address: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
    getExplorerAddressLink: (address) => `https://explorer.fuse.io/address/${address}`,
    getExplorerTransactionLink: (transactionHash) => `https://explorer.fuse.io/tx/${transactionHash}`
};
exports.Celo = {
    chainId: 42220,
    chainName: "Celo",
    isTestChain: false,
    isLocalChain: false,
    multicallAddress: "0x75F59534dd892c1f8a7B172D639FA854D529ada3",
    multicall2Address: "0xE72f42c64EA3dc05D2D94F541C3a806fa161c49B",
    getExplorerAddressLink: (address) => `https://explorer.celo.org/address/${address}`,
    getExplorerTransactionLink: (transactionHash) => `https://explorer.celo.org/tx/${transactionHash}`
};
const getMulticallAddresses = (networks) => {
    const result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach(network => {
        result[network.chainId] = network.multicallAddress;
    });
    return result;
};
const getMulticall2Addresses = (networks) => {
    const result = {};
    networks === null || networks === void 0 ? void 0 : networks.forEach(network => {
        if (network.multicall2Address) {
            result[network.chainId] = network.multicall2Address;
        }
    });
    return result;
};
const Web3Connector = ({ web3Provider }) => {
    const { activate, deactivate } = (0, core_1.useEthers)();
    (0, react_1.useEffect)(() => {
        if (web3Provider) {
            activate(web3Provider).catch(lodash_1.noop);
        }
        return deactivate;
    }, [web3Provider]);
    return null;
};
const TokenProvider = ({ children }) => {
    const { chainId } = (0, core_1.useEthers)();
    const g$Contract = (0, sdk_1.useGetContract)("GoodDollar", true, "base");
    const goodContract = (0, sdk_1.useGetContract)("GReputation", true, "base");
    const gdxContract = (0, sdk_1.useGetContract)("GoodReserveCDai", true, "base", 1);
    const { MAINNET } = constants_2.SupportedChains;
    const results = (0, core_1.useCalls)([
        {
            contract: g$Contract,
            method: "decimals",
            args: []
        },
        {
            contract: goodContract,
            method: "decimals",
            args: []
        }
    ], { refresh: "never", chainId });
    const [mainnetGdx] = (0, core_1.useCalls)([
        {
            contract: gdxContract,
            method: "decimals",
            args: []
        }
    ].filter(_ => _.contract && chainId == MAINNET), { refresh: "never", chainId: MAINNET });
    const value = (0, react_1.useMemo)(() => {
        const newValue = (0, lodash_2.cloneDeep)(constants_1.G$Decimals);
        const [g$, good] = results;
        if (chainId && !results.some(result => !result || result.error)) {
            newValue.G$[chainId] = g$ === null || g$ === void 0 ? void 0 : g$.value[0];
            newValue.GOOD[chainId] = good === null || good === void 0 ? void 0 : good.value[0];
        }
        if (mainnetGdx && !mainnetGdx.error) {
            newValue.GDX[MAINNET] = mainnetGdx.value[0];
        }
        return newValue;
    }, [results, chainId, mainnetGdx]);
    return (0, jsx_runtime_1.jsx)(exports.TokenContext.Provider, { value: value, children: children });
};
const Web3Provider = ({ children, config, web3Provider, env = "production" }) => {
    const [switchNetwork, setSwitchNetwork] = (0, react_1.useState)();
    const [onSwitchNetwork, setOnSwitchNetwork] = (0, react_1.useState)();
    const setSwitcNetworkCallback = (0, react_1.useCallback)((cb) => setSwitchNetwork(() => cb), [setSwitchNetwork]);
    //make sure we have Fuse and mainnet by default and the relevant multicall available from useConfig for useMulticallAtChain hook
    config.networks = config.networks || [exports.Fuse, core_1.Mainnet, core_1.Goerli, exports.Celo];
    config.multicallVersion = config.multicallVersion ? config.multicallVersion : 1;
    config.gasLimitBufferPercentage = 10;
    config.readOnlyUrls = {
        122: "https://rpc.fuse.io",
        42220: "https://forno.celo.org",
        1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ...config.readOnlyUrls
    };
    const defaultAddresses = config.multicallVersion === 1 ? getMulticallAddresses(config.networks) : getMulticall2Addresses(config.networks);
    config.multicallAddresses = { ...defaultAddresses, ...config.multicallAddresses };
    return ((0, jsx_runtime_1.jsxs)(core_1.DAppProvider, { config: config, children: [(0, jsx_runtime_1.jsx)(Web3Connector, { web3Provider: web3Provider }), (0, jsx_runtime_1.jsx)(exports.Web3Context.Provider, { value: {
                    setSwitchNetwork: setSwitcNetworkCallback,
                    switchNetwork,
                    onSwitchNetwork,
                    setOnSwitchNetwork,
                    txEmitter: exports.txEmitter,
                    env
                }, children: (0, jsx_runtime_1.jsx)(TokenProvider, { children: children }) })] }));
};
exports.Web3Provider = Web3Provider;
const useSwitchNetwork = () => {
    const { switchNetwork: ethersSwitchNetwork } = (0, core_1.useEthers)();
    const { switchNetwork, setSwitchNetwork, onSwitchNetwork, setOnSwitchNetwork } = (0, react_1.useContext)(exports.Web3Context);
    const switchCallback = (0, react_1.useCallback)(async (chainId) => {
        onSwitchNetwork && onSwitchNetwork(chainId, undefined);
        try {
            await (switchNetwork || ethersSwitchNetwork)(chainId);
            onSwitchNetwork && onSwitchNetwork(chainId, true);
        }
        catch (e) {
            onSwitchNetwork && onSwitchNetwork(chainId, false);
            throw e;
        }
    }, [onSwitchNetwork, switchNetwork, ethersSwitchNetwork]);
    return { switchNetwork: switchCallback, setSwitchNetwork, setOnSwitchNetwork };
};
exports.useSwitchNetwork = useSwitchNetwork;
//# sourceMappingURL=Web3Context.js.map