import React from "react";
import { extendTheme, NativeBaseProvider } from "native-base";


const nativeTheme = extendTheme({
	components: {
		Text: {
			baseStyle: {
				fontWeight: 'bold',
				fontSize: 34,
				lineHeight: 40,
				letterSpacing: '-0.03em',
			}
		},
		Button: {
			baseStyle: {
				rounded: 'md',
				borderRadius: '3rem',
				cursor: 'pointer',
				userSelect: 'none',
				fontSize: '1rem',
			}
		}
	},
})

export function NativeBaseThemeProvider({ children }: { children: React.ReactNode }) {
	return <NativeBaseProvider theme={nativeTheme}>{children}</NativeBaseProvider>
}
