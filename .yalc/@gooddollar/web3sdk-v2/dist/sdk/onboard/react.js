"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@web3-onboard/react");
const injected_wallets_1 = __importDefault(require("@web3-onboard/injected-wallets"));
const walletconnect_1 = __importDefault(require("@web3-onboard/walletconnect"));
const coinbase_1 = __importDefault(require("@web3-onboard/coinbase"));
const react_2 = require("react");
const torus_1 = require("./modules/torus");
const customwalletconnect_1 = require("./modules/customwalletconnect");
const lodash_1 = require("lodash");
const injected = (0, injected_wallets_1.default)({
    filter: {
        ["Binance Smart Wallet"]: false,
        ["MetaMask"]: true,
        ["Coinbase Wallet"]: true,
        ["detected"]: true,
        ["trust"]: false,
        ["opera"]: false,
        ["status"]: false,
        ["alphawallet"]: false,
        ["atoken"]: false,
        ["bitpie"]: false,
        ["blockwallet"]: false,
        ["Brave"]: false,
        ["dcent"]: false,
        ["frame"]: false,
        ["huobiwallet"]: false,
        ["hyperpay"]: false,
        ["imtoken"]: false,
        ["liquality"]: false,
        ["meetone"]: false,
        ["ownbit"]: false,
        ["mykey"]: false,
        ["tokenpocket"]: false,
        ["tp"]: false,
        ["xdefi"]: false,
        ["oneInch"]: false,
        ["tokenary"]: false,
        ["tally"]: false
    }
});
const defaultWc = (0, walletconnect_1.default)({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModalOptions: {
        mobileLinks: ["rainbow", "metamask", "argent", "trust", "imtoken", "pillar"]
    }
});
const coinbaseWalletSdk = (0, coinbase_1.default)();
const zenGoWc = (0, customwalletconnect_1.customWcModule)({
    customLabelFor: "zengo",
    bridge: "https://bridge.walletconnect.org",
    qrcodeModalOptions: {
        desktopLinks: ["zengo", "metamask"],
        mobileLinks: ["metamask", "zengo"] // TODO: has to be tested on IOS, android does not show list
    }
});
const gdWc = (0, customwalletconnect_1.customWcModule)({
    customLabelFor: "gooddollar",
    bridge: "https://bridge.walletconnect.org"
});
const torus = (0, torus_1.torus)({
    buildEnv: "testing",
    showTorusButton: false
});
const defaultOptions = {
    chains: [
        {
            id: "0xa4ec",
            token: "CELO",
            label: "CELO Testnet",
            rpcUrl: "https://alfajores-forno.celo-testnet.org",
            namespace: "evm"
        }
    ]
};
const defaultWalletsFlags = {
    torus: true,
    gooddollar: true,
    metamask: true,
    walletconnect: true,
    coinbase: true,
    zengo: true,
    custom: []
};
const walletsMap = {
    torus,
    gooddollar: gdWc,
    metamask: injected,
    walletconnect: defaultWc,
    coinbase: coinbaseWalletSdk,
    zengo: zenGoWc
};
const OnboardProvider = ({ options = defaultOptions, wallets = null, children }) => {
    const onboardRef = (0, react_2.useRef)();
    // initialise once at first render
    (() => {
        if (onboardRef.current) {
            return;
        }
        const { custom = [], ...flags } = { ...defaultWalletsFlags, ...(wallets || {}) };
        const selectedWallets = (0, lodash_1.keys)((0, lodash_1.pickBy)(flags));
        onboardRef.current = (0, react_1.init)({
            ...options,
            wallets: [...selectedWallets.map(key => walletsMap[key]), ...custom]
        });
    })();
    return (0, jsx_runtime_1.jsx)(react_1.Web3OnboardProvider, { web3Onboard: onboardRef.current, children: children });
};
exports.OnboardProvider = OnboardProvider;
//# sourceMappingURL=react.js.map