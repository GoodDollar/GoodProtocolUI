"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const native_base_1 = require("native-base");
const useQueryParam_1 = require("../../hooks/useQueryParam");
const advanced_1 = require("../../advanced");
const useFVModalAction_1 = require("../../hooks/useFVModalAction");
const ActionButton_1 = __importDefault(require("./ActionButton"));
const useModal_1 = require("../../hooks/useModal");
const layout_1 = require("../layout");
const images_1 = require("../images");
const claim_png_1 = __importDefault(require("../../assets/images/claim.png"));
const lodash_1 = require("lodash");
const core_1 = require("@usedapp/core");
const ClaimButton = ({ firstName, method, refresh, claimed, claim, handleConnect, redirectUrl, ...props }) => {
    const { account } = (0, core_1.useEthers)();
    const { Modal: FirstClaimModal, showModal: showFirstClaimModal } = (0, useModal_1.useModal)();
    const { Modal: ActionModal, showModal: showActionModal, hideModal: hideActionModal } = (0, useModal_1.useModal)();
    const [claimLoading, setClaimLoading] = (0, react_1.useState)(false);
    const { loading, verify } = (0, useFVModalAction_1.useFVModalAction)({
        firstName,
        method,
        onClose: hideActionModal,
        redirectUrl
    });
    const { isWhitelisted, claimAmount } = (0, web3sdk_v2_1.useClaim)(refresh);
    const [firstClaim, setFirstClaim] = (0, react_1.useState)(false);
    const isVerified = (0, useQueryParam_1.useQueryParam)("verified", true);
    const textColor = (0, native_base_1.useColorModeValue)("goodGrey.500", "white");
    const { chainId } = (0, web3sdk_v2_1.useGetEnvChainId)();
    const [requiredChain, setRequiredChain] = (0, react_1.useState)(web3sdk_v2_1.SupportedChains.CELO);
    const { fuseWhitelisted, syncStatus } = (0, web3sdk_v2_1.useWhitelistSync)();
    (0, react_1.useEffect)(() => {
        switch (chainId) {
            case 122:
                setRequiredChain(account ? web3sdk_v2_1.SupportedChains.FUSE : web3sdk_v2_1.SupportedChains.CELO);
                break;
            default:
                setRequiredChain(web3sdk_v2_1.SupportedChains.CELO);
                break;
        }
    }, [chainId, account]);
    // TODO:  replace placeholder loader with styled loader
    const actionModalBody = (0, react_1.useMemo)(() => ({
        verify: {
            body: (react_1.default.createElement(react_1.default.Fragment, null,
                " ",
                react_1.default.createElement(native_base_1.Text, { color: textColor, mb: "2" }, "To verify your identity you need to sign TWICE with your wallet."),
                react_1.default.createElement(native_base_1.Text, { color: textColor, mb: "2" }, "First sign your address to be whitelisted"),
                react_1.default.createElement(native_base_1.Text, { color: textColor, mb: "2" }, "Second sign your self sovereign anonymized identifier, so no link is kept between your identity record and your address."))),
            footer: (react_1.default.createElement(native_base_1.View, { justifyContent: "space-between", width: "full", flexDirection: "row" },
                react_1.default.createElement(ActionButton_1.default, { color: "white", text: "Verify Uniqueness", onPress: verify, bg: "main" })))
        }
    }), [textColor]);
    const claimModalProps = (0, react_1.useMemo)(() => firstClaim
        ? {
            header: (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(layout_1.Title, { fontSize: "xl", mb: "2" }, "Your first claim is ready!"),
                react_1.default.createElement(native_base_1.Text, { color: textColor, fontSize: "md" }, "To complete it, sign in your wallet"))),
            body: react_1.default.createElement(react_1.default.Fragment, null),
            closeText: "",
            hasTopBorder: false,
            hasBottomBorder: false
        }
        : {
            header: (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(layout_1.Title, { fontSize: "xl", mb: "2", fontWeight: "bold", lineHeight: "36px" }, "Action Required"),
                react_1.default.createElement(native_base_1.Text, { color: textColor, fontFamily: "subheading", fontWeight: "normal", fontSize: "md" }, "To complete this action, continue in your wallet."))),
            body: loading || claimLoading ? react_1.default.createElement(native_base_1.Spinner, { color: "emerald.500" }) : actionModalBody.verify.body,
            footer: isWhitelisted || loading || claimLoading ? undefined : actionModalBody.verify.footer,
            closeText: "",
            hasBottomBorder: false
        }, [firstClaim, textColor, loading, isWhitelisted, claimLoading]);
    const handleClaim = async (first) => {
        try {
            const success = await claim();
            if (success !== true || first === false) {
                return;
            }
            showFirstClaimModal();
        }
        finally {
            setClaimLoading(false);
            hideActionModal();
        }
    };
    const handleModalOpen = (0, react_1.useCallback)(async (first = false) => {
        setFirstClaim(first);
        showActionModal();
        if (isWhitelisted) {
            setClaimLoading(true);
            await handleClaim(first);
        }
        else if (fuseWhitelisted && syncStatus) {
            const success = await syncStatus;
            if (success) {
                setClaimLoading(true);
                await handleClaim(true);
            }
            else {
                //// what to do here? tjis should not continue with FV Flow
            }
        }
        else {
            // here nothing happens, FV flow starts
            // what to do with an edge case where fuseWhitelisted or syncStatus might not be set or
            // give a value in time before user interaction is done
        }
    }, [claim, hideActionModal, showFirstClaimModal, isWhitelisted, fuseWhitelisted, syncStatus]);
    (0, react_1.useEffect)(() => {
        const doClaim = async () => {
            if (isVerified) {
                showActionModal();
                setClaimLoading(true);
                await handleClaim(true);
            }
        };
        doClaim().catch(lodash_1.noop);
    }, [isVerified]);
    const buttonTitle = (0, react_1.useMemo)(() => {
        if (!isWhitelisted) {
            return "CLAIM NOW";
        }
        // todo: use formatted token amount with G$Amount
        return "CLAIM NOW " + (claimAmount !== null && claimAmount !== void 0 ? claimAmount : "");
    }, [isWhitelisted]);
    if (isWhitelisted && claimed) {
        return (react_1.default.createElement(FirstClaimModal, { header: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(layout_1.Title, { mb: "2" }, "Yay! You've made your first claim."),
                react_1.default.createElement(native_base_1.Text, { color: textColor }, "Check out how you can use your GoodDollars:")), body: react_1.default.createElement(images_1.Image, { source: claim_png_1.default, w: "full", h: "auto" }), closeText: "", hasTopBorder: false, hasBottomBorder: false }));
    }
    return (react_1.default.createElement(native_base_1.View, { flex: 1, w: "full", ...props },
        react_1.default.createElement(native_base_1.View, { w: "full", alignItems: "center", pt: "8", pb: "8" },
            react_1.default.createElement(advanced_1.Web3ActionButton, { text: buttonTitle, web3Action: handleModalOpen, disabled: claimed, variant: "round", requiredChain: requiredChain, handleConnect: handleConnect }),
            react_1.default.createElement(native_base_1.Text, { variant: "shadowed" })),
        react_1.default.createElement(ActionModal, { ...claimModalProps })));
};
exports.default = ClaimButton;
//# sourceMappingURL=ClaimButton.js.map