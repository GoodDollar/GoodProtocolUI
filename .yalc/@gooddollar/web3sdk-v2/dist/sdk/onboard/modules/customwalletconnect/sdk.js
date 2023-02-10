"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const qrcode_modal_1 = __importDefault(require("@walletconnect/qrcode-modal"));
const walletconnect_1 = __importDefault(require("@web3-onboard/walletconnect"));
const common_1 = require("@web3-onboard/common");
const platform_1 = require("../../../base/utils/platform");
const icons_1 = require("./icons");
const types_1 = require("./types");
function customWcModule(options) {
    const { customLabelFor: label, connectFirstChainId, qrcodeModalOptions = {}, bridge = 'https://bridge.walletconnect.org' } = options;
    const defaultWc = (0, walletconnect_1.default)({ bridge });
    if (!(0, platform_1.isMobile)()) {
        qrcodeModalOptions.desktopLinks = ['ZenGo'];
    }
    return () => {
        const wc = defaultWc({ device: (0, platform_1.getDevice)() });
        const { getInterface } = wc;
        wc.label = types_1.CustomLabels[label];
        wc.getIcon = async () => icons_1.icons[label];
        wc.getInterface = async (helpers) => {
            const ui = await getInterface(helpers);
            const { provider } = ui;
            const { connector, request } = provider;
            // hack QR code opts
            connector._qrcodeModalOptions = qrcodeModalOptions;
            // hack requests, SHOULD be function to keep provider instance's 'this' context
            provider.request = async function ({ method, params }) {
                if (method !== 'eth_requestAccounts') {
                    return request({ method, params });
                }
                // for 'eth_requestAccounts' method only
                return new Promise((resolve, reject) => {
                    // Check if connection is already established
                    if (!this.connector.connected) {
                        // create new session
                        void this.connector
                            .createSession(connectFirstChainId ? { chainId: parseInt(this.chains[0].id, 16) } : undefined)
                            .then(() => {
                            if (label === 'zengo' && (0, platform_1.isMobile)()) {
                                window.open(`https://get.zengo.com/wc?uri=${encodeURIComponent(this.connector.uri)}`, '_blank');
                            }
                            else {
                                qrcode_modal_1.default.open(this.connector.uri, () => reject(new common_1.ProviderRpcError({
                                    code: 4001,
                                    message: 'User rejected the request.',
                                })), qrcodeModalOptions);
                            }
                        });
                    }
                    else {
                        const { accounts, chainId } = this.connector.session;
                        this.emit('chainChanged', `0x${chainId.toString(16)}`);
                        return resolve(accounts);
                    }
                    // Subscribe to connection events
                    (0, rxjs_1.fromEvent)(this.connector, 'connect', (error, payload) => {
                        if (error) {
                            throw error;
                        }
                        return payload;
                    })
                        .pipe((0, operators_1.take)(1))
                        .subscribe({
                        next: ({ params }) => {
                            const [{ accounts, chainId }] = params;
                            this.emit('accountsChanged', accounts);
                            this.emit('chainChanged', `0x${chainId.toString(16)}`);
                            qrcode_modal_1.default.close();
                            resolve(accounts);
                        },
                        error: reject,
                    });
                });
            };
            return ui;
        };
        return wc;
    };
}
exports.default = customWcModule;
//# sourceMappingURL=sdk.js.map