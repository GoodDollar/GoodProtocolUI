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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const BasicModal = ({ modalVisible, header, body, footer, actionText, closeText = "Cancel", hasCloseButton = !!closeText, hasTopBorder = true, hasBottomBorder = true, onClose = lodash_1.noop, onAction = lodash_1.noop, _modal = {}, _header = {}, _body = {}, _footer = {} }) => {
    const onActionButtonPress = (0, react_1.useCallback)(() => {
        onAction();
        onClose();
    }, [onAction, onClose]);
    const bgContent = (0, native_base_1.useColorModeValue)("white", "mainDarkContrast");
    const bgOverlay = (0, native_base_1.useColorModeValue)("mainDarkContracts:alpha.40", "white:alpha.40");
    const width = (0, native_base_1.useBreakpointValue)({
        base: 288,
        md: "initial"
    });
    const height = (0, native_base_1.useBreakpointValue)({
        base: 424,
        md: "initial"
    });
    const actionButton = actionText ? react_1.default.createElement(native_base_1.Button, { onPress: onActionButtonPress }, actionText) : react_1.default.createElement(react_1.default.Fragment, null);
    return (
    /* height 100vh is required so modal always shows in the middle */
    react_1.default.createElement(native_base_1.Modal, { isOpen: modalVisible, onClose: onClose, ..._modal, minH: "100vh", bgColor: bgOverlay },
        react_1.default.createElement(native_base_1.Box, { bgColor: bgContent, borderRadius: "lg", h: height, width: width },
            react_1.default.createElement(native_base_1.Modal.Content, { w: "100%" },
                hasCloseButton && react_1.default.createElement(native_base_1.Modal.CloseButton, null),
                !!header && (react_1.default.createElement(native_base_1.Modal.Header, { style: {
                        paddingLeft: 18,
                        paddingRight: 18,
                        paddingTop: 24
                    }, borderBottomWidth: hasTopBorder ? "px" : "0", ..._header }, header)),
                react_1.default.createElement(native_base_1.Box, { borderWidth: "1", borderColor: "borderGrey", width: "90%", alignSelf: "center" }),
                react_1.default.createElement(native_base_1.Modal.Body, { ..._body }, body),
                (!!footer || !!closeText || !!actionText) && (react_1.default.createElement(native_base_1.Modal.Footer, { borderTopWidth: hasBottomBorder ? "px" : "0", ..._footer },
                    footer,
                    react_1.default.createElement(native_base_1.Button.Group, { space: 2 },
                        closeText ? (react_1.default.createElement(native_base_1.Button, { variant: "ghost", colorScheme: "blueGray", onPress: onClose }, closeText)) : (react_1.default.createElement(react_1.default.Fragment, null)),
                        actionButton)))))));
};
exports.default = BasicModal;
//# sourceMappingURL=BasicModal.js.map