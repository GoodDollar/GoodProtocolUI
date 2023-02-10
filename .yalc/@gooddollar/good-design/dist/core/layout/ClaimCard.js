"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const native_base_1 = require("native-base");
const react_1 = __importDefault(require("react"));
const buttons_1 = require("../buttons");
const images_1 = require("../images");
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const Title_1 = __importDefault(require("./Title"));
const ClaimCard = ({ content, title, bgColor }) => {
    return (react_1.default.createElement(native_base_1.View, { shadow: "1", w: "240", h: "423", bg: bgColor, borderRadius: 30, flex: 1, justifyContent: (content === null || content === void 0 ? void 0 : content.length) !== 1 ? "space-between" : undefined, flexDirection: "column", alignItems: "center", px: "17", py: "6" },
        react_1.default.createElement(Title_1.default, { fontSize: "xl", lineHeight: "36", fontWeight: "bold", fontFamily: "heading", color: title.color }, title.text), content === null || content === void 0 ? void 0 :
        content.map((contentItem, index) => {
            var _a;
            return (react_1.default.createElement(native_base_1.Box, { key: index },
                !!contentItem.description && (react_1.default.createElement(native_base_1.Text, { color: contentItem.description.color, fontSize: "15", fontFamily: "subheading", fontWeight: "normal", pt: "4", pb: "30" }, contentItem.description.text)),
                !!contentItem.imageUrl && (react_1.default.createElement(images_1.Image, { source: { uri: contentItem.imageUrl }, w: "208", h: "178", borderRadius: 10, alt: "GoodDollar" })),
                !!contentItem.link && (react_1.default.createElement(buttons_1.ArrowButton, { text: contentItem.link.linkText, onPress: () => contentItem.link && (0, web3sdk_v2_1.openLink)(contentItem.link.linkUrl) })),
                !!contentItem.list && (react_1.default.createElement(native_base_1.View, { pt: "30", textAlign: "center" }, (_a = contentItem.list) === null || _a === void 0 ? void 0 : _a.map(({ id, key, value }, index, list) => (react_1.default.createElement(native_base_1.Text, { key: id, color: "goodGrey.500", bold: true, fontSize: "16", fontFamily: "subheading", fontWeight: "normal", display: "flex", justifyContent: "center", flexDirection: "column", pb: index === list.length - 1 ? "0" : "5" },
                    key,
                    " ",
                    react_1.default.createElement(native_base_1.Text, { color: "primary" }, value))))))));
        })));
};
exports.default = ClaimCard;
//# sourceMappingURL=ClaimCard.js.map