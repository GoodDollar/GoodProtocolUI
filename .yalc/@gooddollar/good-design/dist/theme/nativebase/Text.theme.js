"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
exports.Text = {
    baseStyle: {
        fontFamily: "body",
        fontWeight: "normal"
    },
    variants: {
        shadowed: () => {
            return {
                style: {
                    textShadowRadius: 2.22,
                    textShadowOffset: {
                        width: 0,
                        height: 1
                    },
                    textShadowColor: "rgba(0,0,0, .22)"
                }
            };
        }
    }
};
//# sourceMappingURL=Text.theme.js.map