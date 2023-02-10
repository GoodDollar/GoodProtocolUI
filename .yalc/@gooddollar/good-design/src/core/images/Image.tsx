import { get, isFunction, isString } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { GestureResponderEvent, Image as NativeImage, StyleSheet } from "react-native";
import { Image as BaseImage, IImageProps, Pressable } from "native-base";

const isAutoHeight = (width: IImageProps["w"], height: IImageProps["h"]) => !!width && "auto" === height;

export interface CustomImageProps extends IImageProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const Image: FC<CustomImageProps> = ({ source, style = {}, w, h, onPress, ...props }) => {
  const [aspectRatio, setAspectRatio] = useState<number>();

  const flattenStyle = useMemo(() => StyleSheet.flatten(style), [style]);

  // image source could be base64 data uri
  const uri = useMemo(() => get(source, "uri", isString(source) ? source : null), [source]);
  const fixed = !isAutoHeight(w, h);

  const imageStyle = useMemo(
    () =>
      fixed
        ? flattenStyle
        : {
            ...flattenStyle,
            aspectRatio
          },
    [fixed, flattenStyle, aspectRatio]
  );

  useEffect(() => {
    const onImageSize = (width: number, height: number) => setAspectRatio(width / height);

    if (!uri || fixed) {
      return;
    }

    NativeImage.getSize(uri, onImageSize);
  }, [uri, fixed]);

  if (!aspectRatio && !fixed) {
    return null;
  }

  return (
    <Pressable disabled={!isFunction(onPress)} onPress={onPress}>
      <BaseImage alt="GoodDollar" {...props} source={source} style={imageStyle} w={w} h={h} />
    </Pressable>
  );
};

export default Image;
