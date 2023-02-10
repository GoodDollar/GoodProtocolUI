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
const native_base_1 = require("native-base");
const react_1 = __importStar(require("react"));
const ClaimCard_1 = __importDefault(require("./ClaimCard"));
const SlideMark = (0, react_1.memo)(({ isActive, isLast }) => (react_1.default.createElement(native_base_1.View, { h: "1", w: "5", bg: isActive ? "main" : "grey", mr: isLast ? "0" : "2", borderRadius: 2 })));
const ClaimCardItem = ({ item, index }) => {
    return react_1.default.createElement(ClaimCard_1.default, { key: index, ...item });
};
const SlidesComponent = (0, react_1.memo)(({ activeSlide, slidesNumber, data }) => (react_1.default.createElement(react_1.default.Fragment, null, Array(slidesNumber)
    .fill(0)
    .map((_, index, arr) => {
    var _a;
    return (react_1.default.createElement(SlideMark, { key: (_a = data[index]) === null || _a === void 0 ? void 0 : _a.id, isActive: index === activeSlide, isLast: index === arr.length - 1 }));
}))));
const getItemLayout = (_, index) => ({
    index,
    length: 275,
    offset: (275 + 20) * index
});
const Separator = () => react_1.default.createElement(native_base_1.View, { w: "5" });
const ClaimCarousel = ({ cards, claimed }) => {
    const [slidesNumber, setSlidesNumber] = (0, react_1.useState)(0);
    const [activeSlide, setActiveSlide] = (0, react_1.useState)(0);
    const activeCards = (0, react_1.useMemo)(() => cards.filter(card => !card.hide), [cards, claimed]);
    const containerWidth = (0, native_base_1.useBreakpointValue)({
        base: "350px",
        xl: "500px"
    });
    const listWidth = (0, native_base_1.useBreakpointValue)({
        base: "auto",
        xl: claimed ? "auto" : activeCards.length * 275
    });
    const onFlatListLayoutChange = (0, react_1.useCallback)((event) => {
        const contentWidth = activeCards.length * 275 + (activeCards.length - 1) * 20;
        if (event.nativeEvent.layout.width >= contentWidth) {
            setSlidesNumber(0);
            return;
        }
        setSlidesNumber(Math.ceil((contentWidth - event.nativeEvent.layout.width + 36) / (275 + 20)));
    }, [activeCards, setSlidesNumber]);
    const onScroll = (0, react_1.useCallback)((event) => {
        const offSetX = event.nativeEvent.contentOffset.x;
        const currentSlide = Math.floor(offSetX / (275 + (offSetX === 0 ? 20 : -20)));
        if (activeSlide === currentSlide)
            return;
        setActiveSlide(currentSlide);
    }, [activeSlide, setActiveSlide]);
    return (react_1.default.createElement(native_base_1.Box, { w: containerWidth },
        react_1.default.createElement(native_base_1.FlatList, { data: activeCards, horizontal: true, onScroll: onScroll, scrollEventThrottle: 16, ml: 5, h: "425", w: listWidth, showsHorizontalScrollIndicator: false, onLayout: onFlatListLayoutChange, getItemLayout: getItemLayout, renderItem: ClaimCardItem, ItemSeparatorComponent: Separator, pagingEnabled: true }),
        react_1.default.createElement(native_base_1.View, { flexDirection: "row", w: "full", pt: "5", justifyContent: "center" },
            react_1.default.createElement(SlidesComponent, { data: activeCards, activeSlide: activeSlide, slidesNumber: slidesNumber }))));
};
exports.default = ClaimCarousel;
//# sourceMappingURL=ClaimCarousel.js.map