import { FC } from "react";
import { GestureResponderEvent } from "react-native";
import { IImageProps } from "native-base";
export interface CustomImageProps extends IImageProps {
    onPress?: (event: GestureResponderEvent) => void;
}
declare const Image: FC<CustomImageProps>;
export default Image;
//# sourceMappingURL=Image.d.ts.map