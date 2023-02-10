export declare const StepIndicator: {
    baseStyle: {
        color: string;
        fontSize: string;
    };
};
export declare const Web3ActionButton: {
    baseStyle: {
        innerText: {
            fontSize: string;
            fontWeight: string;
            color: string;
        };
        innerIndicatorText: {
            color: string;
            fontSize: string;
            fontWeight: string;
        };
    };
    variants: {
        round: () => {
            shadow: number;
            w: string;
            h: string;
            px: number;
            borderRadius: string;
            bg: string;
            innerText: {
                variant: string;
                fontFamily: string;
                fontSize: string;
                width: number;
                lineHeight: number;
            };
        };
        mobile: () => {
            backgroundColor: string;
            width: string;
            maxWidth: string;
            height: number;
            textAlign: string;
            justifyContent: string;
            alignItems: string;
            borderTopLeftRadius: number;
            borderTopRightRadius: number;
            py: number;
            pt: string;
            transition: string;
            _focus: {
                backgroundColor: string;
                transition: string;
            };
            _hover: {
                backgroundColor: string;
                transition: string;
            };
            innerText: {
                fontSize: string;
                fontFamily: string;
                lineHeight: number;
            };
        };
        outlined: () => {
            backgroundColor: string;
            borderRadius: number;
            borderWidth: number;
            borderColor: string;
            width: number;
            height: number;
            padding: string;
            _focus: {
                backgroundColor: string;
                transition: string;
            };
            _hover: {
                backgroundColor: string;
                transition: string;
            };
            innerText: {
                color: string;
                fontSize: string;
                fontFamily: string;
                lineHeight: number;
            };
        };
    };
};
//# sourceMappingURL=Web3Action.theme.d.ts.map