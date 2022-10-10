// import React from "react";
// import { extendTheme, NativeBaseProvider } from "native-base";

// const nativeTheme = extendTheme({
// 	components: {
// 		Text: {
// 			baseStyle: {
// 				fontWeight: 'bold',
// 				fontSize: 34,
// 				lineHeight: 40,
// 				letterSpacing: '-0.03em',
// 			}
// 		},
// 		Button: {
// 			baseStyle: {
// 				rounded: 'md',
// 				borderRadius: '3rem',
// 				cursor: 'pointer',
// 				userSelect: 'none',
// 				fontSize: '1rem',
// 			}
// 		}
// 	},
// })

// export function NativeBaseThemeProvider({ children }: { children: React.ReactNode }) {
// 	return <NativeBaseProvider theme={nativeTheme}>{children}</NativeBaseProvider>
// }
//TODO: move logic to good-design, no native-base logic here.
//Everything that is needed from within the nativebase provider should be part of whatever component is returned
// all that should be in protocolUI is a
// <NativeBaseProvider theme={theme}> <component> </NativeBaseProvider>
export {}
