import React from "react";
import { useThemeProps } from "native-base";

export const withTheme =
  (options?: { name?: string }) =>
  <T,>(Component: React.ComponentType<T>) => {
    const { name: defaultName } = Component;
    const id = options?.name ?? defaultName;

    if (!id) {
      throw new Error(
        "Theming can not be applied on anonymous function without " +
          "setting component name explicitly in the HoC options: " +
          'useTheme({ name: "MyComponent" })(props => <some jsx>)'
      );
    }

    const Wrapped: React.ComponentType<T> = ({ children, ...props }) => {
      const themeProps = useThemeProps(id, props);

      // @ts-ignore
      return <Component {...themeProps}>{children}</Component>;
    };

    Wrapped.displayName = `withTheme(${id})`;
    return Wrapped;
  };
