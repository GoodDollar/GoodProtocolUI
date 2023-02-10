export declare const theme: {
    fontConfig: Partial<{
        Montserrat: {
            100: {
                normal: string;
                italic: string;
            };
            200: {
                normal: string;
                italic: string;
            };
            300: {
                normal: string;
                italic: string;
            };
            400: {
                normal: string;
                italic: string;
            };
            500: {
                normal: string;
                italic: string;
            };
            600: {
                normal: string;
                italic: string;
            };
            700: {
                normal: string;
                italic: string;
            };
            800: {
                normal: string;
                italic: string;
            };
            900: {
                normal: string;
                italic: string;
            };
        };
        Roboto: {
            100: {
                normal: string;
                italic: string;
            };
            200: {
                normal: string;
                italic: string;
            };
            300: {
                normal: string;
                italic: string;
            };
            400: {
                normal: string;
                italic: string;
            };
            500: {
                normal: string;
                italic: string;
            };
            600: {
                normal: string;
                italic: string;
            };
            700: {
                normal: string;
                italic: string;
            };
            800: {
                normal: string;
                italic: string;
            };
            900: {
                normal: string;
                italic: string;
            };
        };
    }>;
    colors: {
        grey: string;
        greyCard: string;
        lightGrey: string;
        smokeWhite: string;
        dimgray: string;
        main: string;
        mainDark: string;
        mainDarkContrast: string;
        text: string;
        paragraph: string;
        heading: string;
        headingBlack: string;
        headingGrey: string;
        buttonBackground: string;
        primary: string;
        primaryHoverDark: string;
        goodGrey: {
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
        };
        goodWhite: {
            100: string;
        };
        goodBlack: {
            100: string;
            200: string;
            300: string;
            500: string;
        };
        borderBlue: string;
        borderGrey: string;
    };
    sizes: {
        md: string;
    };
    breakpoints: {
        base: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        "2xl": number;
    };
    fonts: {
        heading: string;
        body: string;
        mono: string;
        subheading: string;
    };
    fontSizes: {
        "2xs": number;
        xs: number;
        sm: number;
        md: number;
        l: number;
        xl: number;
        "2xl": number;
    };
    components: {
        Text: {
            baseStyle: {
                fontFamily: string;
                fontWeight: string;
            };
            variants: {
                shadowed: () => {
                    style: {
                        textShadowRadius: number;
                        textShadowOffset: {
                            width: number;
                            height: number;
                        };
                        textShadowColor: string;
                    };
                };
            };
        };
        StepIndicator: {
            baseStyle: {
                color: string;
                fontSize: string;
            };
        };
        Web3ActionButton: {
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
        SelectBox: {
            defaultProps: {};
            baseStyle: {
                borderColor: string;
                borderWidth: number;
                borderRadius: string;
                flexDirection: string;
                w: number;
                h: number;
                p: number;
                _hover: {
                    bgColor: string;
                };
                display: string;
            };
            variants: {
                button: (props: any) => {
                    borderBottomLeftRadius: string | number;
                    borderBottomRightRadius: string | number;
                };
                list: (props: any) => {
                    display: string;
                    backgroundColor: string;
                    borderTopRightRadius: string | number;
                    borderTopLeftRadius: string | number;
                };
            };
        };
        ActionButton: {
            defaultProps: {};
            baseStyle: {
                fontSize: string;
                lineHeight: string;
                fontWeight: string;
                textTransform: string;
                boxShadow: string;
                backgroundColor: string;
                transition: string;
                userSelect: string;
            };
        };
        BaseButton: {
            defaultProps: {};
            baseStyle: (baseTools: {
                colorMode: string;
            }) => any;
            variants: {
                arrowIcon: () => {
                    bg: string;
                    w: number;
                    h: number;
                    innerText: {
                        fontSize: string;
                        fontWeight: string;
                        fontFamily: string;
                        color: string;
                    };
                    innerView: {
                        width: number;
                        flexDirection: string;
                        justifyContent: string;
                        alignItems: string;
                        px: number;
                        pl: number;
                        pr: number;
                        flexGrow: number;
                    };
                    borderRadius: number;
                };
            };
        };
        Layout: {
            baseStyle: {
                backgroundColor: string;
                borderColor: string;
                boxShadow: string;
            };
        };
        Title: {
            defaultProps: {
                color: string;
                size: string;
            };
            baseStyle: {
                fontFamily: string;
                fontWeight: string;
                lineHeight: string;
            };
            sizes: {
                lg: {
                    fontSize: string;
                };
            };
        };
    };
} & {
    components: {
        Progress: {
            baseStyle: (props: Record<string, any>) => {
                overflow: string;
                _filledTrack: {
                    shadow: number;
                    height: string;
                    display: string;
                    alignItems: string;
                    justifyContent: string;
                    rounded: string;
                    _text: {
                        color: string;
                        fontWeight: string;
                    };
                };
                _light: {
                    bg: string;
                    _filledTrack: {
                        bg: string;
                    };
                };
                _dark: {
                    bg: string;
                    _filledTrack: {
                        bg: string;
                    };
                };
            };
            defaultProps: {
                colorScheme: string;
                size: string;
                rounded: string;
                min: number;
                max: number;
                value: number;
                isIndeterminate: boolean;
            };
            sizes: {
                xs: {
                    height: number;
                };
                sm: {
                    height: number;
                };
                md: {
                    height: number;
                };
                lg: {
                    height: number;
                };
                xl: {
                    height: number;
                };
                '2xl': {
                    height: number;
                };
            };
        };
        Radio: {
            baseStyle: (props: Record<string, any>) => {
                borderWidth: number;
                borderRadius: string;
                p: number;
                _light: {
                    bg: string;
                    borderColor: string;
                    _checked: {
                        borderColor: string;
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            borderColor: string;
                            _icon: {
                                color: string;
                            };
                            _disabled: {
                                borderColor: string;
                                _icon: {
                                    color: string;
                                };
                            };
                        };
                        _pressed: {
                            borderColor: string;
                            _icon: {
                                color: string;
                            };
                        };
                    };
                    _hover: {
                        borderColor: string;
                        _disabled: {
                            borderColor: string;
                        };
                    };
                    _pressed: {
                        borderColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _checked: {
                        borderColor: string;
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            borderColor: string;
                            _icon: {
                                color: string;
                            };
                            _disabled: {
                                borderColor: string;
                                _icon: {
                                    color: string;
                                };
                            };
                        };
                        _pressed: {
                            borderColor: string;
                            _icon: {
                                color: string;
                            };
                        };
                    };
                    _hover: {
                        borderColor: string;
                        _disabled: {
                            borderColor: string;
                        };
                    };
                    _pressed: {
                        borderColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _stack: {
                    direction: string;
                    alignItems: string;
                    space: number;
                    _web: {
                        cursor: string;
                    };
                };
                _disabled: {
                    opacity: string;
                    _icon: {
                        bg: string;
                    };
                    _stack: {
                        opacity: string;
                    };
                };
                _focusVisible: {
                    _web: {
                        style: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                };
            };
            sizes: {
                lg: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
                md: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
                sm: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
            };
            defaultProps: {
                defaultIsChecked: boolean;
                size: string;
                colorScheme: string;
            };
        };
        RadioGroup: {
            baseStyle: () => {
                alignItems: string;
            };
        };
        ScaleFade: {
            baseStyle: {
                initial: {
                    opacity: number;
                    scale: number;
                };
                animate: {
                    opacity: number;
                    scale: number;
                    transition: number;
                };
                exit: {
                    opacity: number;
                    scale: number;
                    transition: number;
                };
            };
        };
        Select: {
            baseStyle: () => {
                selection: {
                    start: number;
                };
                _light: {
                    customDropdownIconProps: {
                        color: string;
                        mr: string;
                    };
                    _hover: {
                        borderColor: string;
                    };
                    _focus: {
                        borderColor: string;
                    };
                    _disabled: {
                        bg: string;
                        placeholderTextColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _dark: {
                    customDropdownIconProps: {
                        color: string;
                        mr: string;
                    };
                    _hover: {
                        borderColor: string;
                    };
                    _focus: {
                        borderColor: string;
                    };
                    _disabled: {
                        bg: string;
                        placeholderTextColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                customDropdownIconProps: {
                    size: string;
                    p: string;
                };
                _webSelect: {
                    style: {
                        appearance: string;
                        WebkitAppearance: string;
                        MozAppearance: string;
                        position: string;
                        width: string;
                        height: string;
                        opacity: number;
                        zIndex: number;
                    };
                };
                _web: {
                    pointerEvents: string;
                };
                _disabled: {
                    opacity: string;
                };
                _actionSheetBody: {
                    w: string;
                };
                _actionSheetContent: {};
            };
            defaultProps: {
                optimized: boolean;
            };
        };
        SelectItem: {
            baseStyle: {
                p: string;
                px: string;
                borderRadius: string;
                minH: string;
            };
        };
        SimpleGrid: {
            baseStyle: {};
            defaultProps: {};
        };
        Skeleton: {
            baseStyle: (props: Record<string, any>) => {
                startColor: any;
                endColor: string;
                overflow: string;
                fadeDuration: number;
                speed: number;
                h: string;
                w: string;
            };
        };
        SkeletonText: {
            baseStyle: (props: Record<string, any>) => {
                startColor: any;
                endColor: string;
                fadeDuration: number;
                w: string;
                speed: number;
                flexDirection: string;
                _line: {
                    h: number;
                    rounded: string;
                };
            };
            defaultProps: {
                lines: number;
                space: number;
            };
        };
        SliderFilledTrack: {
            baseStyle: ({ orientation, isReversed, sliderTrackPosition, size, colorScheme, }: any) => {
                left: number | undefined;
                bottom: number | undefined;
                right: number | undefined;
                top: number | undefined;
                style: {
                    height: any;
                    width: any;
                };
                _light: {
                    bg: string;
                };
                _dark: {
                    bg: string;
                };
            };
            defaultProps: {
                colorScheme: string;
            };
        };
        SliderThumb: {
            baseStyle: (props: any) => {
                borderRadius: string;
                zIndex: number;
                alignItems: string;
                justifyContent: string;
                scaleOnPressed: number;
                _interactionBox: {
                    position: string;
                    borderRadius: string;
                    zIndex: number;
                };
                _stack: {
                    direction: string;
                    alignItems: string;
                    justifyContent: string;
                    space: number;
                };
                _light: {
                    bg: string;
                    _hover: {
                        _web: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                    _focus: {
                        _web: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                    _pressed: {
                        _interactionBox: {
                            borderWidth: string;
                            borderColor: string;
                        };
                    };
                };
                _dark: {
                    bg: string;
                    _hover: {
                        _web: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                    _focus: {
                        _web: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                    _pressed: {
                        _interactionBox: {
                            borderWidth: string;
                            borderColor: string;
                        };
                    };
                };
                _web: {
                    cursor: string;
                };
            };
            defaultProps: {
                colorScheme: string;
            };
            sizes: {
                lg: {
                    _interactionBox: string;
                };
                md: {
                    _interactionBox: string;
                };
                sm: {
                    _interactionBox: string;
                };
            };
        };
        SliderTrack: {
            baseStyle: ({ isVertical, size }: any) => {
                borderRadius: string;
                overflow: string;
                style: {
                    height: any;
                    width: any;
                };
                _pressable: {
                    alignItems: string;
                    justifyContent: string;
                    height: any;
                    width: any;
                    py: string | undefined;
                    px: string | undefined;
                };
                _light: {
                    bg: string;
                };
                _dark: {
                    bg: string;
                };
            };
        };
        Slider: {
            baseStyle: (props: any) => {
                alignItems: string;
                justifyContent: string;
                height: string | undefined;
                width: string | undefined;
                _disabled: {
                    opacity: number;
                    _web: {
                        cursor: string;
                    };
                };
            };
            defaultProps: {
                size: string;
            };
            sizes: {
                lg: {
                    thumbSize: number;
                    sliderTrackHeight: number;
                    _interactionBox: {
                        p: string;
                    };
                };
                md: {
                    thumbSize: number;
                    sliderTrackHeight: number;
                    _interactionBox: {
                        p: string;
                    };
                };
                sm: {
                    thumbSize: number;
                    sliderTrackHeight: number;
                    _interactionBox: {
                        p: string;
                    };
                };
            };
        };
        Slide: {
            baseStyle: {
                h: string;
                pointerEvents: string;
                _overlay: {
                    style: {
                        overflow: string;
                    };
                };
            };
            defaultProps: {
                duration: number;
                placement: string;
                overlay: boolean;
                _overlay: {
                    isOpen: boolean;
                };
            };
        };
        SlideFade: {
            defaultProps: {
                duration: number;
                offsetX: number;
                offsetY: number;
            };
        };
        Spinner: {
            baseStyle: {
                color: string;
            };
            sizes: {
                sm: string;
                lg: string;
            };
            defaultProps: {
                size: string;
            };
        };
        Square: {
            baseStyle: {
                alignItems: string;
                justifyContent: string;
            };
            sizes: {
                xs: {
                    height: number;
                    width: number;
                };
                sm: {
                    height: number;
                    width: number;
                };
                md: {
                    height: number;
                    width: number;
                };
                lg: {
                    height: number;
                    width: number;
                };
                xl: {
                    height: number;
                    width: number;
                };
                '2xl': {
                    height: number;
                    width: number;
                };
            };
        };
        Stack: {
            baseStyle: {};
            defaultProps: {};
            sizes: {
                gutter: number;
                '2xs': number;
                xs: number;
                sm: number;
                md: number;
                lg: number;
                xl: number;
                '2xl': number;
            };
        };
        Stat: {
            defaultProps: {
                _statLabel: {
                    fontSize: string;
                };
                _statNumber: {
                    fontSize: string;
                    fontWeight: string;
                    my: number;
                };
                _statHelpText: {
                    _text: {
                        color: string;
                        fontSize: string;
                    };
                    flexDirection: string;
                    alignItems: string;
                };
                _statGroup: {
                    flexWrap: string;
                    space: number;
                    justifyContent: string;
                };
            };
        };
        Switch: {
            baseStyle: (props: Record<string, any>) => {
                _disabled: {
                    opacity: number;
                };
                _invalid: {
                    borderWidth: number;
                    borderRadius: number;
                };
                onThumbColor: string;
                offThumbColor: string;
                _light: {
                    offTrackColor: string;
                    onTrackColor: string;
                    _hover: {
                        offTrackColor: string;
                        onTrackColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _dark: {
                    offTrackColor: string;
                    onTrackColor: string;
                    _hover: {
                        offTrackColor: string;
                        onTrackColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
            };
            sizes: {
                sm: {
                    style: {
                        transform: {
                            scale: number;
                        }[];
                    };
                };
                md: {};
                lg: {
                    style: {
                        transform: {
                            scale: number;
                        }[];
                    };
                    margin: number;
                };
            };
            defaultProps: {
                size: string;
                colorScheme: string;
            };
        };
        Tabs: {
            baseStyle: (props: Record<string, any>) => {
                activeTabStyle: {
                    justifyContent: string;
                    alignItems: string;
                    mb: string;
                    flexDirection: string;
                    _text: {
                        fontSize: string;
                        fontWeight: string;
                    };
                };
                inactiveTabStyle: {
                    justifyContent: string;
                    alignItems: string;
                    mb: string;
                    flexDirection: string;
                    _text: {
                        color: any;
                        fontSize: string;
                        fontWeight: string;
                    };
                };
                activeIconProps: {
                    color: any;
                    name: string;
                    mx: number;
                };
                inactiveIconProps: {
                    name: string;
                    mx: number;
                };
            };
            variants: {
                outline: (props: Record<string, any>) => {
                    activeTabStyle: {
                        borderColor: any;
                        _text: {
                            color: any;
                        };
                        _hover: {
                            bg: any;
                        };
                        borderBottomWidth: number;
                    };
                    inactiveTabStyle: {
                        borderColor: string;
                        borderBottomWidth: number;
                        _hover: {
                            bg: any;
                        };
                    };
                    tabBarStyle: {
                        borderBottomWidth: number;
                        borderColor: any;
                    };
                };
                filled: (props: Record<string, any>) => {
                    activeTabStyle: {
                        borderColor: any;
                        _text: {
                            color: any;
                        };
                        _hover: {
                            bg: any;
                        };
                        borderBottomWidth: number;
                        bg: any;
                    };
                    inactiveTabStyle: {
                        borderColor: string;
                        borderBottomWidth: number;
                        _hover: {
                            bg: any;
                        };
                    };
                    tabBarStyle: {
                        borderBottomWidth: number;
                        borderColor: any;
                    };
                };
                'filled-outline': (props: Record<string, any>) => {
                    activeTabStyle: {
                        borderColor: any;
                        _text: {
                            color: any;
                        };
                        _hover: {
                            bg: any;
                        };
                        borderBottomWidth: number;
                    };
                    inactiveTabStyle: {
                        borderColor: string;
                        borderBottomWidth: number;
                        _hover: {
                            bg: any;
                        };
                    };
                    tabBarStyle: {
                        borderBottomWidth: number;
                        borderColor: any;
                        bg: any;
                    };
                };
            };
            sizes: {
                sm: {
                    activeTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                    inactiveTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                };
                md: {
                    activeTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                    inactiveTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                };
                lg: {
                    activeTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                    inactiveTabStyle: {
                        _text: {
                            fontSize: string;
                        };
                        py: number;
                        px: number;
                    };
                };
            };
            defaultProps: {
                size: string;
                variant: string;
                colorScheme: string;
            };
        };
        Tag: {
            variants: {
                solid: any;
                subtle: any;
                outline: any;
            };
            baseStyle: {
                _text: {
                    fontWeight: string;
                };
                alignItems: string;
                justifyContent: string;
                flexDirection: string;
                display: string;
            };
            sizes: {
                sm: {
                    minH: number;
                    minW: number;
                    _text: {
                        fontSize: string;
                    };
                    p: number;
                    borderRadius: string;
                };
                md: {
                    minH: number;
                    minW: number;
                    _text: {
                        fontSize: string;
                    };
                    borderRadius: string;
                    p: number;
                };
                lg: {
                    minH: number;
                    minW: number;
                    _text: {
                        fontSize: string;
                    };
                    borderRadius: string;
                    p: number;
                };
            };
            defaultProps: {
                size: string;
                variant: string;
                colorScheme: string;
            };
        };
        Text: {
            baseStyle: () => {
                _light: {
                    color: string;
                };
                _dark: {
                    color: string;
                };
                fontWeight: string;
                fontFamily: string;
                fontStyle: string;
                fontSize: string;
                letterSpacing: string;
                lineHeight: string;
            };
            defaultProps: {};
        };
        AppBar: {
            baseStyle: (props: Record<string, any>) => {
                bg: any;
                px: number;
            };
            defaultProps: {
                colorScheme: string;
            };
        };
        TextArea: {
            baseStyle: {
                multiline: boolean;
                p: string;
                textAlignVertical: string;
                h: string;
            };
            defaultProps: {
                size: string;
                variant: string;
            };
        };
        TextField: {
            baseStyle: (props: Record<string, any>) => {
                _errorMessageProps: {
                    mt: number;
                    ml: number;
                    fontSize: string;
                    color: string;
                };
                _helperTextProps: {
                    mt: number;
                    ml: number;
                    fontSize: string;
                    color: any;
                };
            };
            defaultProps: {
                component: string;
            };
        };
        Toast: {
            baseStyle: (props: Record<string, any>) => {
                bg: any;
                p: string;
                rounded: string;
                shadow: number;
                _stack: {
                    margin: string;
                    position: string;
                    space: number;
                    alignItems: string;
                    justifyContent: string;
                    pointerEvents: string;
                    _web: {
                        position: string;
                    };
                };
                _overlay: {};
                _presenceTransition: {
                    animate: {
                        opacity: number;
                        transition: {
                            easing: import("react-native").EasingFunction;
                            duration: number;
                        };
                    };
                    exit: {
                        opacity: number;
                        scale: number;
                        transition: {
                            easing: import("react-native").EasingFunction;
                            duration: number;
                        };
                    };
                };
                _title: {
                    color: string;
                    fontWeight: number;
                };
                _description: {
                    color: string;
                    fontWeight: number;
                };
            };
            defaultProps: {};
        };
        TypeAheadSearchItem: {
            baseStyle: (props: Record<string, any>) => {
                backgroundColor: any;
                _focus: {
                    backgroundColor: any;
                };
                _disabled: {
                    backgroundColor: string;
                };
            };
        };
        View: {
            baseStyle: {};
            defaultProps: {};
        };
        Wrap: {};
        ZStack: {
            baseStyle: {};
            defaultProps: {};
        };
        Tooltip: {
            baseStyle: () => {
                py: number;
                px: number;
                shadow: number;
                rounded: string;
                _text: {
                    fontSize: string;
                };
                _light: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        PopoverCloseButton: {
            baseStyle: () => {
                position: string;
                right: number;
                top: number;
                zIndex: number;
                p: string;
                bg: string;
                borderRadius: string;
                _web: {
                    outlineWidth: number;
                    cursor: string;
                };
                _icon: {
                    size: string;
                };
                _light: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
                _dark: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
            };
        };
        PopoverBody: {
            baseStyle: () => {
                p: string;
                shadow: string;
                _light: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        PopoverContent: {
            baseStyle: () => {
                _light: {
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                borderWidth: number;
                rounded: string;
                overflow: string;
            };
        };
        PopoverHeader: {
            baseStyle: () => {
                _web: {
                    accessibilityRole: string;
                };
                p: string;
                borderBottomWidth: string;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                    lineHeight: string;
                };
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        PopoverArrow: {
            baseStyle: () => {
                _light: {
                    bg: string;
                    borderColor: string;
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                };
            };
        };
        PopoverFooter: {
            baseStyle: () => {
                p: string;
                shadow: string;
                flexDirection: string;
                justifyContent: string;
                flexWrap: string;
                borderTopWidth: number;
                _light: {
                    bg: string;
                    borderColor: string;
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                };
            };
        };
        FlatList: {
            baseStyle: {};
            defaultProps: {};
        };
        KeyboardAvoidingView: {
            baseStyle: {};
            defaultProps: {};
        };
        ScrollView: {
            baseStyle: {};
            defaultProps: {};
        };
        SectionList: {
            baseStyle: {};
            defaultProps: {};
        };
        StatusBar: {
            baseStyle: {};
            defaultProps: {};
        };
        Accordion: {
            baseStyle: (props: Record<string, any>) => {
                borderWidth: number;
                borderColor: any;
                borderRadius: string;
            };
        };
        AccordionItem: {};
        AccordionIcon: {};
        AccordionSummary: {
            baseStyle: (props: Record<string, any>) => {
                borderTopWidth: number;
                borderTopColor: any;
                p: number;
                _hover: {
                    bg: any;
                };
                _expanded: {
                    bg: string;
                    borderBottomColor: any;
                    _text: {
                        color: string;
                    };
                };
                _disabled: {
                    bg: any;
                };
            };
        };
        AccordionDetails: {
            baseStyle: {
                p: number;
            };
        };
        Actionsheet: {
            defaultProps: {
                size: string;
                justifyContent: string;
                animationPreset: string;
            };
        };
        ActionsheetContent: {
            baseStyle: () => {
                alignItems: string;
                px: number;
                py: number;
                borderRadius: string;
                roundedTop: number;
                _light: {
                    _dragIndicator: {
                        bg: string;
                    };
                };
                _dark: {
                    _dragIndicator: {
                        bg: string;
                    };
                };
                _dragIndicator: {
                    height: number;
                    width: number;
                    borderRadius: number;
                };
                _dragIndicatorWrapper: {
                    pt: number;
                    pb: number;
                    mt: number;
                    width: string;
                    alignItems: string;
                    collapsable: boolean;
                };
                _dragIndicatorWrapperOffSet: {
                    py: number;
                    collapsable: boolean;
                };
            };
        };
        ActionsheetItem: {
            baseStyle: () => {
                width: string;
                justifyContent: string;
                _stack: {
                    space: number;
                };
                p: number;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                };
                _disabled: {
                    opacity: number;
                };
                _light: {
                    bg: string;
                    _icon: {
                        color: string;
                    };
                    _text: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                    _focusVisible: {
                        _web: {
                            outlineWidth: string;
                            style: {
                                boxShadow: string;
                            };
                            bg: string;
                        };
                        bg: string;
                    };
                };
                _dark: {
                    bg: string;
                    _icon: {
                        color: string;
                    };
                    _text: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                    _focusVisible: {
                        _web: {
                            outlineWidth: string;
                            style: {
                                boxShadow: string;
                            };
                            bg: string;
                        };
                    };
                };
            };
        };
        Alert: {
            baseStyle: {
                alignItems: string;
                justifyContent: string;
                p: number;
                space: number;
                borderRadius: string;
            };
            variants: {
                subtle: any;
                solid: any;
                'left-accent': any;
                'top-accent': any;
                outline: any;
                'outline-light': any;
            };
            defaultProps: {
                colorScheme: string;
                variant: string;
            };
        };
        AlertIcon: {
            baseStyle: {
                size: number;
            };
        };
        AspectRatio: {
            baseStyle: {};
            defaultProps: {
                ratio: number;
            };
        };
        Avatar: {
            baseStyle: (props: import("native-base/lib/typescript/components/composites/Avatar/types").InterfaceAvatarProps & {
                name: string;
            }) => {
                bg: string;
                position: string;
                justifyContent: string;
                alignItems: string;
                borderRadius: string;
                _text: {
                    fontWeight: number;
                    color: string;
                };
                _image: {
                    borderRadius: string;
                    alt: string;
                    _alt: {
                        fontWeight: number;
                    };
                    style: {
                        height: string;
                        width: string;
                    };
                };
                _light: {
                    borderColor: string;
                };
                _dark: {
                    borderColor: string;
                };
            };
            sizes: {
                xs: {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
                sm: {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
                md: {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
                lg: {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
                xl: {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
                '2xl': {
                    width: any;
                    height: any;
                    _text: {
                        fontSize: string;
                    };
                    _badgeSize: any;
                };
            };
            defaultProps: {
                size: string;
            };
        };
        AvatarBadge: {
            baseStyle: () => {
                borderRadius: string;
                borderWidth: number;
                bg: string;
                size: number;
                position: string;
                right: number;
                bottom: number;
                _light: {
                    borderColor: string;
                };
                _dark: {
                    borderColor: string;
                };
            };
        };
        AvatarGroup: {
            baseStyle: ({ isVertical }: import("native-base/lib/typescript/components/composites/Avatar/types").IAvatarGroupProps) => {
                flexDirection: string;
                space: number;
                _avatar: {
                    borderWidth: number;
                };
                _hiddenAvatarPlaceholder: {
                    _text: {
                        color: string;
                    };
                };
                _light: {
                    _avatar: {
                        borderColor: string;
                    };
                    _hiddenAvatarPlaceholder: {
                        bg: string;
                    };
                };
                _dark: {
                    _avatar: {
                        borderColor: string;
                    };
                    _hiddenAvatarPlaceholder: {
                        bg: string;
                    };
                };
            };
            defaultProps: {
                isVertical: boolean;
            };
        };
        Badge: {
            baseStyle: {
                flexDirection: string;
                justifyContent: string;
                space: number;
                px: string;
                py: string;
                alignItems: string;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                };
            };
            variants: {
                solid: any;
                subtle: any;
                outline: any;
            };
            defaultProps: {
                variant: string;
                colorScheme: string;
                size: string;
            };
        };
        Box: {
            baseStyle: {};
            defaultProps: {};
        };
        Breadcrumb: {
            baseStyle: {
                width: string;
                height: string;
                display: string;
                flexDirection: string;
                spacing: string;
            };
            defaultProps: {
                direction: string;
                wrap: string;
            };
        };
        BreadcrumbText: {
            baseStyle: {
                _current: {
                    fontWeight: string;
                };
                width: string;
                height: string;
                display: string;
                flexDirection: string;
                spacing: string;
            };
            defaultProps: {
                direction: string;
                wrap: string;
            };
        };
        BreadcrumbIcon: {
            baseStyle: {
                width: string;
                height: string;
                display: string;
                flexDirection: string;
                spacing: string;
            };
            defaultProps: {
                direction: string;
                wrap: string;
            };
        };
        Button: {
            baseStyle: (props: import("native-base/lib/typescript/components/primitives/Button/types").InterfaceButtonProps & {
                theme: any;
            }) => {
                borderRadius: string;
                flexDirection: string;
                justifyContent: string;
                alignItems: string;
                _web: {
                    _disabled: {
                        cursor: string;
                    };
                    _loading: {
                        cursor: string;
                    };
                    cursor: string;
                    userSelect: string;
                };
                _focusVisible: {
                    _web: {
                        outlineWidth: string;
                        style: any;
                    };
                };
                _stack: {
                    space: string;
                    alignItems: string;
                };
                _loading: {
                    opacity: string;
                };
                _disabled: {
                    opacity: string;
                };
                _spinner: {
                    size: string;
                    focusable: boolean;
                };
            };
            variants: {
                ghost: any;
                outline: any;
                solid: any;
                subtle: any;
                link: any;
                unstyled: any;
            };
            sizes: {
                lg: {
                    px: string;
                    py: string;
                    _text: {
                        fontSize: string;
                    };
                    _icon: {
                        size: string;
                    };
                };
                md: {
                    px: string;
                    py: string;
                    _text: {
                        fontSize: string;
                    };
                    _icon: {
                        size: string;
                    };
                };
                sm: {
                    px: string;
                    py: string;
                    _text: {
                        fontSize: string;
                    };
                    _icon: {
                        size: string;
                    };
                };
                xs: {
                    px: string;
                    py: string;
                    _text: {
                        fontSize: string;
                    };
                    _icon: {
                        size: string;
                    };
                };
            };
            defaultProps: {
                variant: string;
                size: string;
                colorScheme: string;
            };
        };
        ButtonGroup: {
            baseStyle: {
                direction: string;
            };
            defaultProps: {
                space: number;
            };
        };
        Card: {
            baseStyle: {
                shadow: number;
                borderRadius: string;
                padding: number;
                overflow: string;
            };
            defaultProps: {};
        };
        Center: {
            baseStyle: {
                display: string;
                alignItems: string;
                justifyContent: string;
            };
            sizes: {
                xs: {
                    height: number;
                    width: number;
                };
                sm: {
                    height: number;
                    width: number;
                };
                md: {
                    height: number;
                    width: number;
                };
                lg: {
                    height: number;
                    width: number;
                };
                xl: {
                    height: number;
                    width: number;
                };
                '2xl': {
                    height: number;
                    width: number;
                };
            };
        };
        Circle: {
            baseStyle: {
                rounded: string;
                alignItems: string;
                justifyContent: string;
            };
            sizes: {
                xs: {
                    height: number;
                    width: number;
                };
                sm: {
                    height: number;
                    width: number;
                };
                md: {
                    height: number;
                    width: number;
                };
                lg: {
                    height: number;
                    width: number;
                };
                xl: {
                    height: number;
                    width: number;
                };
                '2xl': {
                    height: number;
                    width: number;
                };
            };
        };
        Checkbox: {
            baseStyle: (props: Record<string, any>) => {
                justifyContent: string;
                flexDirection: string;
                borderWidth: number;
                borderRadius: string;
                opacity: number;
                p: number;
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                    _icon: {
                        color: string;
                    };
                    _checked: {
                        borderColor: string;
                        bg: string;
                        _hover: {
                            borderColor: string;
                            bg: string;
                            _disabled: {
                                borderColor: string;
                                bg: string;
                            };
                        };
                        _pressed: {
                            borderColor: string;
                            bg: string;
                        };
                    };
                    _hover: {
                        borderColor: string;
                        _disabled: {
                            borderColor: string;
                        };
                    };
                    _pressed: {
                        borderColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                    _icon: {
                        color: string;
                    };
                    _checked: {
                        borderColor: string;
                        bg: string;
                        _hover: {
                            borderColor: string;
                            bg: string;
                            _disabled: {
                                borderColor: string;
                                bg: string;
                            };
                        };
                        _pressed: {
                            borderColor: string;
                            bg: string;
                        };
                    };
                    _hover: {
                        borderColor: string;
                        _disabled: {
                            borderColor: string;
                        };
                    };
                    _pressed: {
                        borderColor: string;
                    };
                    _invalid: {
                        borderColor: string;
                    };
                };
                _stack: {
                    direction: string;
                    alignItems: string;
                    space: number;
                    _web: {
                        cursor: string;
                    };
                };
                _text: {
                    ml: number;
                };
                _focusVisible: {
                    _web: {
                        style: {
                            outlineWidth: string;
                            outlineColor: any;
                            outlineStyle: string;
                        };
                    };
                };
                _disabled: {
                    _web: {
                        cursor: string;
                    };
                    opacity: number;
                };
            };
            sizes: {
                lg: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
                md: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
                sm: {
                    _icon: {
                        size: number;
                    };
                    _text: {
                        fontSize: string;
                    };
                };
            };
            defaultProps: {
                defaultIsChecked: boolean;
                size: string;
                colorScheme: string;
            };
        };
        CheckboxGroup: {
            baseStyle: () => {
                alignItems: string;
            };
        };
        CircularProgress: {
            baseStyle: (props: Record<string, any>) => {
                color: any;
                trackColor: any;
            };
            sizes: {
                xs: {
                    height: number;
                    width: number;
                };
                sm: {
                    height: number;
                    width: number;
                };
                md: {
                    height: number;
                    width: number;
                };
                lg: {
                    height: number;
                    width: number;
                };
                xl: {
                    height: number;
                    width: number;
                };
                '2xl': {
                    height: number;
                    width: number;
                };
            };
            defaultProps: {
                thickness: number;
                colorScheme: string;
                size: string;
            };
        };
        Code: {
            baseStyle: {
                _text: {
                    fontFamily: string;
                    fontSize: string;
                };
                borderRadius: string;
                px: number;
                py: number;
            };
            variants: {
                solid: any;
                subtle: any;
                outline: any;
            };
            defaultProps: {
                variant: string;
                colorScheme: string;
                size: string;
            };
        };
        Container: {
            baseStyle: (props: import("native-base/lib/typescript/theme/tools").Dict) => {
                maxWidth: string;
                alignItems: string;
                _text: {
                    textAlign: string;
                };
            };
        };
        Divider: {
            baseStyle: (props: Record<string, any>) => {
                width: string;
                height: string;
                _light: {
                    bg: string;
                };
                _dark: {
                    bg: string;
                };
            };
            defaultProps: {
                orientation: string;
                thickness: string;
            };
        };
        Fade: {
            baseStyle: {
                initial: {
                    opacity: number;
                };
                animate: {
                    opacity: number;
                    transition: {
                        duration: number;
                    };
                };
                exit: {
                    opacity: number;
                    transition: {
                        duration: number;
                    };
                };
            };
        };
        FAB: {
            baseStyle: {
                shadow: number;
                rounded: string;
                zIndex: number;
                placementProps: any;
                px: number;
                py: number;
            };
            defaultProps: {
                renderInPortal: boolean;
                variant: string;
                colorScheme: string;
                placement: string;
            };
        };
        Flex: {
            baseStyle: {
                display: string;
                flexDirection: string;
            };
        };
        Spacer: {
            baseStyle: {
                flexGrow: number;
            };
        };
        FormControl: {
            baseStyle: {
                width: string;
            };
        };
        FormControlLabel: {
            baseStyle: () => {
                flexDirection: string;
                justifyContent: string;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                };
                my: string;
                _light: {
                    _text: {
                        color: string;
                    };
                    _astrick: {
                        color: string;
                    };
                };
                _dark: {
                    _text: {
                        color: string;
                    };
                    _astrick: {
                        color: string;
                    };
                };
            };
        };
        FormControlHelperText: {
            baseStyle: () => {
                mt: string;
                _text: {
                    fontSize: string;
                };
                _light: {
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    _text: {
                        color: string;
                    };
                };
            };
        };
        FormControlErrorMessage: {
            baseStyle: () => {
                mt: string;
                _text: {
                    fontSize: string;
                };
                _stack: {
                    space: number;
                    alignItems: string;
                };
                _light: {
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    _text: {
                        color: string;
                    };
                };
            };
        };
        Heading: {
            baseStyle: () => {
                _light: {
                    color: string;
                };
                _dark: {
                    color: string;
                };
                fontWeight: string;
                lineHeight: string;
            };
            sizes: {
                '4xl': {
                    fontSize: {
                        base: string;
                        md: string;
                    };
                    letterSpacing: string;
                };
                '3xl': {
                    fontSize: {
                        base: string;
                        md: string;
                    };
                    letterSpacing: string;
                };
                '2xl': {
                    fontSize: {
                        base: string;
                        md: string;
                    };
                };
                xl: {
                    fontSize: {
                        base: string;
                        md: string;
                    };
                };
                lg: {
                    fontSize: {
                        base: string;
                        md: string;
                    };
                };
                md: {
                    fontSize: string;
                };
                sm: {
                    fontSize: string;
                };
                xs: {
                    fontSize: string;
                };
            };
            defaultProps: {
                size: string;
            };
        };
        HStack: {
            baseStyle: {};
            defaultProps: {};
        };
        VStack: {
            baseStyle: {};
            defaultProps: {};
        };
        Icon: {
            baseStyle: () => {
                _light: {
                    color: string;
                };
                _dark: {
                    color: string;
                };
            };
            sizes: {
                '2xs': number;
                xs: number;
                sm: number;
                md: number;
                lg: number;
                xl: number;
                '2xl': number;
                '3xl': number;
                '4xl': number;
                '5xl': number;
                '6xl': number;
            };
            defaultProps: {
                size: string;
            };
        };
        IconButton: {
            baseStyle: (props: any) => {
                borderRadius: string;
                flexDirection: string;
                justifyContent: string;
                alignItems: string;
                _web: {
                    _disabled: {
                        cursor: string;
                    };
                    _loading: {
                        cursor: string;
                    };
                    cursor: string;
                    userSelect: string;
                };
                _focus: {
                    borderColor: string;
                };
                _focusVisible: {
                    _web: {
                        style: any;
                    };
                };
                _loading: {
                    opacity: string;
                };
                _disabled: {
                    opacity: string;
                };
            };
            variants: {
                ghost: ({ colorScheme }: Record<string, any>) => {
                    _light: {
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                        };
                    };
                    _dark: {
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                        };
                    };
                };
                outline: ({ colorScheme }: Record<string, any>) => {
                    borderWidth: string;
                    _light: {
                        borderColor: string;
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                        _pressed: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                        _focus: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                    };
                    _dark: {
                        borderColor: string;
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                        _pressed: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                        _focus: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                    };
                };
                solid: ({ colorScheme }: Record<string, any>) => {
                    _light: {
                        bg: string;
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                        };
                        _icon: {
                            color: string;
                        };
                    };
                    _dark: {
                        bg: string;
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                            _icon: {
                                color: string;
                            };
                        };
                        _icon: {
                            color: string;
                        };
                    };
                };
                subtle: ({ colorScheme }: Record<string, any>) => {
                    _text: {
                        color: string;
                    };
                    _icon: {
                        color: string;
                    };
                    _light: {
                        bg: string;
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                        };
                    };
                    _dark: {
                        bg: string;
                        _hover: {
                            bg: string;
                        };
                        _pressed: {
                            bg: string;
                        };
                    };
                };
                link: ({ colorScheme }: Record<string, any>) => {
                    _spinner: {
                        color: string;
                    };
                    _light: {
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            _icon: {
                                color: string;
                            };
                        };
                        _pressed: {
                            _icon: {
                                color: string;
                            };
                        };
                    };
                    _dark: {
                        _icon: {
                            color: string;
                        };
                        _hover: {
                            _icon: {
                                color: string;
                            };
                        };
                        _pressed: {
                            _icon: {
                                color: string;
                            };
                        };
                    };
                };
                unstyled: () => {
                    _light: {
                        _icon: {
                            color: string;
                        };
                    };
                    _dark: {
                        _icon: {
                            color: string;
                        };
                    };
                };
            };
            sizes: {
                lg: {
                    p: string;
                    _icon: {
                        size: string;
                    };
                };
                md: {
                    p: string;
                    _icon: {
                        size: string;
                    };
                };
                sm: {
                    p: string;
                    _icon: {
                        size: string;
                    };
                };
                xs: {
                    p: string;
                    _icon: {
                        size: string;
                    };
                };
            };
            defaultProps: {
                variant: string;
                size: string;
                colorScheme: string;
            };
        };
        Image: {
            baseStyle: {
                maxWidth: string;
            };
            sizes: {
                '2xs': string;
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                '2xl': string;
                full: string;
            };
            defaultProps: {};
        };
        Input: {
            baseStyle: (props: import("native-base/lib/typescript/components/primitives/Input/types").InterfaceInputProps & {
                theme: any;
            }) => {
                fontFamily: string;
                py: string;
                px: string;
                borderRadius: string;
                overflow: string;
                _disabled: {
                    opacity: string;
                    _web: {
                        disabled: boolean;
                        cursor: string;
                    };
                };
                _web: {
                    outlineWidth: string;
                    overflow: string;
                    lineHeight: string;
                    style: {
                        outline: string;
                    };
                    cursor: string;
                };
                _input: {
                    bg: string;
                    flex: number;
                    w: string;
                    h: string;
                };
                _light: {
                    placeholderTextColor: string;
                    color: string;
                    borderColor: string;
                    _hover: {
                        borderColor: string;
                    };
                    _focus: {
                        borderColor: string;
                        _hover: {
                            borderColor: string;
                        };
                        _stack: {
                            style: {
                                outlineWidth: string;
                                outlineColor: string;
                                outlineStyle: string;
                            };
                        };
                    };
                    _invalid: {
                        borderColor: string;
                        _hover: {
                            borderColor: string;
                        };
                        _stack: {
                            style: {
                                outlineWidth: string;
                                outlineColor: string;
                                outlineStyle: string;
                            };
                        };
                    };
                    _ios: {
                        selectionColor: string;
                    };
                    _android: {
                        selectionColor: string;
                    };
                    _disabled: {
                        placeholderTextColor: string;
                        _hover: {
                            borderColor: string;
                        };
                    };
                    _stack: {
                        flexDirection: string;
                        alignItems: string;
                        overflow: string;
                    };
                };
                _dark: {
                    placeholderTextColor: string;
                    color: string;
                    borderColor: string;
                    _hover: {
                        borderColor: string;
                    };
                    _focus: {
                        borderColor: string;
                        _hover: {
                            borderColor: string;
                        };
                        _stack: {
                            style: {
                                outlineWidth: string;
                                outlineColor: string;
                                outlineStyle: string;
                            };
                        };
                    };
                    _invalid: {
                        borderColor: string;
                        _stack: {
                            style: {
                                outlineWidth: string;
                                outlineColor: string;
                                outlineStyle: string;
                            };
                        };
                        _hover: {
                            borderColor: string;
                        };
                    };
                    _ios: {
                        selectionColor: string;
                    };
                    _android: {
                        selectionColor: string;
                    };
                    _disabled: {
                        placeholderTextColor: string;
                        _hover: {
                            borderColor: string;
                        };
                    };
                    _stack: {
                        flexDirection: string;
                        alignItems: string;
                        overflow: string;
                    };
                };
            };
            defaultProps: {
                size: string;
                variant: string;
            };
            variants: {
                outline: any;
                underlined: any;
                rounded: any;
                filled: any;
                unstyled: any;
            };
            sizes: {
                '2xl': {
                    fontSize: string;
                };
                xl: {
                    fontSize: string;
                };
                lg: {
                    fontSize: string;
                };
                md: {
                    fontSize: string;
                };
                sm: {
                    fontSize: string;
                };
                xs: {
                    fontSize: string;
                };
            };
        };
        InputLeftAddon: {
            baseStyle: () => {
                p: string;
                borderWidth: string;
                borderRightWidth: string;
                borderLeftRadius: string;
                _text: {
                    fontWeight: number;
                };
                alignItems: string;
                justifyContent: string;
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        InputRightAddon: {
            baseStyle: () => {
                p: string;
                borderWidth: string;
                borderLeftWidth: string;
                borderRightRadius: string;
                _text: {
                    fontWeight: number;
                };
                alignItems: string;
                justifyContent: string;
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        Kbd: {
            baseStyle: (props: Record<string, any>) => {
                bg: any;
                borderColor: any;
                borderWidth: number;
                borderBottomWidth: number;
                shadow: number;
                borderRadius: string;
                px: number;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                    fontFamily: string;
                };
            };
            defaultProps: {};
        };
        Link: {
            baseStyle: (props: Record<string, any>) => {
                _text: {
                    textDecorationLine: string;
                };
                width: string;
                height: string;
            };
            defaultProps: {
                isUnderlined: boolean;
            };
        };
        List: {
            baseStyle: (props: Record<string, any>) => {
                py: number;
                borderWidth: number;
                borderColor: string;
                _hover: {
                    bg: any;
                };
            };
        };
        ListItem: {
            baseStyle: {
                py: number;
                borderColor: string;
            };
            defaultProps: {
                start: number;
            };
        };
        ListIcon: {
            baseStyle: {
                mr: number;
                size: string;
            };
        };
        Menu: {
            baseStyle: {
                py: number;
                borderRadius: string;
                shadow: number;
                _light: {
                    bg: string;
                };
                _dark: {
                    bg: string;
                };
                _presenceTransition: {
                    initial: {
                        opacity: number;
                    };
                    animate: {
                        opacity: number;
                        translateY: number;
                        transition: {
                            duration: number;
                        };
                    };
                    exit: {
                        opacity: number;
                        transition: {
                            duration: number;
                        };
                    };
                    style: import("react-native").RegisteredStyle<import("react-native").StyleSheet.AbsoluteFillStyle>;
                };
                _overlay: {};
                _backdrop: {
                    bg: string;
                };
            };
        };
        MenuGroup: {
            baseStyle: {
                _title: {
                    fontSize: string;
                    textTransform: string;
                    _light: {
                        color: string;
                    };
                    _dark: {
                        color: string;
                    };
                };
                p: number;
            };
        };
        MenuItem: {
            baseStyle: {
                px: number;
                py: number;
                _web: {
                    outlineWidth: number;
                };
                _stack: {
                    alignItems: string;
                    px: number;
                    space: number;
                };
                _icon: {
                    size: number;
                    opacity: number;
                };
                _light: {
                    _text: {
                        color: string;
                    };
                    _disabled: {
                        _text: {
                            color: string;
                        };
                    };
                    _hover: {
                        bg: string;
                    };
                    _focus: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                    _icon: {
                        color: string;
                    };
                    _focusVisible: {
                        _web: {
                            outlineWidth: string;
                            style: {
                                boxShadow: string;
                            };
                            bg: string;
                        };
                    };
                };
                _dark: {
                    _text: {
                        color: string;
                    };
                    _disabled: {
                        _text: {
                            color: string;
                        };
                    };
                    _hover: {
                        bg: string;
                    };
                    _focus: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                    _icon: {
                        color: string;
                    };
                };
                _focusVisible: {
                    _web: {
                        outlineWidth: string;
                        style: {
                            boxShadow: string;
                        };
                        bg: string;
                    };
                };
                _checked: {
                    _icon: {
                        opacity: number;
                    };
                };
            };
            defaultProps: {};
        };
        Modal: {
            baseStyle: {
                width: string;
                height: string;
                justifyContent: string;
                alignItems: string;
                _web: {
                    pointerEvents: string;
                };
                _backdropFade: {
                    exitDuration: number;
                    entryDuration: number;
                };
                _slide: {
                    overlay: boolean;
                    duration: number;
                };
                _fade: {
                    exitDuration: number;
                    entryDuration: number;
                };
            };
            sizes: {
                xs: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                sm: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                md: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                lg: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                xl: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                full: {
                    contentSize: {
                        width: string;
                    };
                };
            };
            defaultProps: {
                size: string;
                closeOnOverlayClick: boolean;
            };
        };
        ModalContent: {
            baseStyle: () => {
                shadow: number;
                rounded: string;
                maxHeight: string;
                overflow: string;
                _light: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        ModalHeader: {
            baseStyle: () => {
                p: string;
                borderBottomWidth: string;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                    lineHeight: string;
                };
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        ModalBody: {
            baseStyle: () => {
                p: string;
                _light: {
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    _text: {
                        color: string;
                    };
                };
            };
        };
        ModalFooter: {
            baseStyle: () => {
                p: string;
                flexDirection: string;
                justifyContent: string;
                flexWrap: string;
                borderTopWidth: number;
                _light: {
                    bg: string;
                    borderColor: string;
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                };
            };
        };
        ModalOverlay: {
            baseStyle: {
                position: string;
                left: string;
                top: string;
                opacity: string;
                right: string;
                bottom: string;
            };
        };
        ModalCloseButton: {
            baseStyle: () => {
                position: string;
                right: string;
                top: string;
                zIndex: string;
                colorScheme: string;
                p: string;
                bg: string;
                borderRadius: string;
                _web: {
                    outlineWidth: number;
                    cursor: string;
                };
                _icon: {
                    size: string;
                };
                _light: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
                _dark: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
            };
        };
        AlertDialog: {
            baseStyle: {
                width: string;
                height: string;
                justifyContent: string;
                alignItems: string;
                _web: {
                    pointerEvents: string;
                };
                _backdropFade: {
                    exitDuration: number;
                    entryDuration: number;
                };
                _fade: {
                    exitDuration: number;
                    entryDuration: number;
                };
                _slide: {
                    duration: number;
                    overlay: boolean;
                };
            };
            sizes: {
                xs: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                sm: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                md: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                lg: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                xl: {
                    contentSize: {
                        width: string;
                        maxWidth: string;
                    };
                };
                full: {
                    contentSize: {
                        width: string;
                    };
                };
            };
            defaultProps: {
                size: string;
                closeOnOverlayClick: boolean;
            };
        };
        AlertDialogContent: {
            baseStyle: () => {
                shadow: number;
                rounded: string;
                maxHeight: string;
                overflow: string;
                _light: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    color: string;
                };
            };
        };
        AlertDialogHeader: {
            baseStyle: () => {
                p: string;
                borderBottomWidth: string;
                _text: {
                    fontSize: string;
                    fontWeight: string;
                    lineHeight: string;
                };
                _light: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        AlertDialogBody: {
            baseStyle: () => {
                p: string;
                _light: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
                _dark: {
                    bg: string;
                    _text: {
                        color: string;
                    };
                };
            };
        };
        AlertDialogFooter: {
            baseStyle: () => {
                p: string;
                flexDirection: string;
                justifyContent: string;
                flexWrap: string;
                borderTopWidth: string;
                _light: {
                    bg: string;
                    borderColor: string;
                };
                _dark: {
                    bg: string;
                    borderColor: string;
                };
            };
        };
        AlertDialogOverlay: {
            baseStyle: {
                position: string;
                left: string;
                top: string;
                opacity: string;
                right: string;
                bottom: string;
            };
        };
        AlertDialogCloseButton: {
            baseStyle: () => {
                position: string;
                right: string;
                top: string;
                zIndex: string;
                p: string;
                bg: string;
                borderRadius: string;
                _web: {
                    outlineWidth: number;
                    cursor: string;
                };
                _icon: {
                    size: string;
                };
                _light: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
                _dark: {
                    _icon: {
                        color: string;
                    };
                    _hover: {
                        bg: string;
                    };
                    _pressed: {
                        bg: string;
                    };
                };
            };
        };
        NumberInput: {
            defaultProps: {
                size: string;
                step: number;
                min: number;
                max: number;
                defaultValue: string;
                keepWithinRange: boolean;
                clampValueOnBlur: boolean;
                focusInputOnChange: boolean;
                getAriaValueText: boolean;
            };
        };
        NumberInputStepper: {
            baseStyle: (props: Record<string, any>) => {
                bg: any;
                iconColor: any;
                _active: {};
                _disabled: {
                    opacity: number;
                };
            };
        };
        PinInput: {
            sizes: {
                '2xl': {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
                xl: {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
                lg: {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
                md: {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
                sm: {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
                xs: {
                    fontSize: string;
                    p: number;
                    width: string;
                    height: string;
                    textAlign: string;
                    borderRadius: string;
                };
            };
            defaultProps: {
                placeholder: string;
                size: string;
                manageFocus: boolean;
                space: number;
            };
        };
        Pressable: {
            baseStyle: (props: any) => {
                _focusVisible: {
                    _web: {
                        style: any;
                    };
                };
            };
            defaultProps: {};
        };
    };
    config: import("native-base").ColorModeOptions;
    sizes: {
        container: {
            sm: number;
            md: number;
            lg: number;
            xl: number;
        };
        '3xs': number;
        '2xs': number;
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
        px: string;
        '0': number;
        '0.5': number;
        '1': number;
        '1.5': number;
        '2': number;
        '2.5': number;
        '3': number;
        '3.5': number;
        '4': number;
        '5': number;
        '6': number;
        '7': number;
        '8': number;
        '9': number;
        '10': number;
        '12': number;
        '16': number;
        '20': number;
        '24': number;
        '32': number;
        '40': number;
        '48': number;
        '56': number;
        '64': number;
        '72': number;
        '80': number;
        '96': number;
        '1/2': string;
        '1/3': string;
        '2/3': string;
        '1/4': string;
        '2/4': string;
        '3/4': string;
        '1/5': string;
        '2/5': string;
        '3/5': string;
        '4/5': string;
        '1/6': string;
        '2/6': string;
        '3/6': string;
        '4/6': string;
        '5/6': string;
        full: string;
    };
    space: {
        px: string;
        '0': number;
        '0.5': number;
        '1': number;
        '1.5': number;
        '2': number;
        '2.5': number;
        '3': number;
        '3.5': number;
        '4': number;
        '5': number;
        '6': number;
        '7': number;
        '8': number;
        '9': number;
        '10': number;
        '12': number;
        '16': number;
        '20': number;
        '24': number;
        '32': number;
        '40': number;
        '48': number;
        '56': number;
        '64': number;
        '72': number;
        '80': number;
        '96': number;
        '1/2': string;
        '1/3': string;
        '2/3': string;
        '1/4': string;
        '2/4': string;
        '3/4': string;
        '1/5': string;
        '2/5': string;
        '3/5': string;
        '4/5': string;
        '1/6': string;
        '2/6': string;
        '3/6': string;
        '4/6': string;
        '5/6': string;
        full: string;
    };
    shadows: {
        none: {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '0': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '1': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '2': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '3': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '4': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '5': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '6': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '7': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '8': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        '9': {
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
    };
    opacity: {
        0: number;
        5: number;
        10: number;
        20: number;
        25: number;
        30: number;
        40: number;
        50: number;
        60: number;
        70: number;
        75: number;
        80: number;
        90: number;
        95: number;
        100: number;
    };
    letterSpacings: {
        xs: string;
        sm: string;
        md: number;
        lg: string;
        xl: string;
        '2xl': string;
    };
    lineHeights: {
        '2xs': string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
        '5xl': string;
    };
    fontConfig: {};
    fontWeights: {
        hairline: number;
        thin: number;
        light: number;
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
        extrabold: number;
        black: number;
        extraBlack: number;
    };
    fonts: {
        heading: undefined;
        body: undefined;
        mono: undefined;
    };
    fontSizes: {
        '2xs': number;
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
        '3xl': number;
        '4xl': number;
        '5xl': number;
        '6xl': number;
        '7xl': number;
        '8xl': number;
        '9xl': number;
    };
    borderWidths: {
        '0': number;
        '1': string;
        '2': string;
        '4': string;
        '8': string;
    };
    breakpoints: {
        base: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
    };
    colors: {
        contrastThreshold: number;
        white: string;
        black: string;
        lightText: string;
        darkText: string;
        rose: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        pink: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        fuchsia: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        purple: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        violet: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        indigo: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        blue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        lightBlue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        darkBlue: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        cyan: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        teal: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        emerald: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        green: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        lime: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        yellow: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        amber: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        orange: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        red: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        warmGray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        trueGray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        gray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        coolGray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        blueGray: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        dark: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        text: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        danger: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        error: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        success: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        warning: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        muted: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        primary: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        info: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        secondary: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        light: import("native-base/lib/typescript/theme/base/colors").IColorHues;
        tertiary: import("native-base/lib/typescript/theme/base/colors").IColorHues;
    };
    radii: {
        none: number;
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
        '3xl': number;
        full: number;
    };
} & {
    fontConfig: any;
};
export declare type MyThemeType = typeof theme;
declare module "native-base" {
    type ICustomTheme = MyThemeType;
}
//# sourceMappingURL=theme.d.ts.map