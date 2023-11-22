import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { lingui } from '@lingui/vite-plugin'
import checker from 'vite-plugin-checker'
import dynamicImports from 'vite-plugin-dynamic-import'
import dotenv from 'dotenv'

dotenv.config()

import fs from 'fs'
import path from 'path'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/

let https: any
if (process.env.HTTPS === 'true') {
    https = {
        key: fs.readFileSync(process.env.SSL_KEY_FILE as any),
        cert: fs.readFileSync(process.env.SSL_CRT_FILE as any),
    }
} else {
    https = false
}
export default defineConfig({
    envPrefix: 'REACT_APP_',
    server: {
        https,
    },
    plugins: [
        // visualizer({
        //     template: 'treemap', // or sunburst
        //     open: true,
        //     gzipSize: true,
        //     brotliSize: true,
        //     filename: 'analice.html',
        // }) as PluginOption,
        dynamicImports(), //for lingui dynamic import lang files
        // checker({
        //     // e.g. use TypeScript check
        //     typescript: true,
        // }),
        nodePolyfills({
            protocolImports: true,
            exclude: ['constants'],
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        }),
        react({
            babel: {
                plugins: ['macros'],
            },
        }),
        lingui(),
        viteTsconfigPaths(),
        svgrPlugin(),
    ],
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'react-native-svg': 'react-native-svg-web',
            'react-native-webview': 'react-native-web-webview',
            jsbi: path.resolve(__dirname, '.', 'node_modules', 'jsbi', 'dist', 'jsbi-cjs.js'), // https://github.com/Uniswap/sdk-core/issues/20#issuecomment-1559863408
        },
        dedupe: ['react', 'ethers', 'react-dom', 'native-base'],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true, //handle deps that use "require" and "module.exports"
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.html': 'text', // allow import or require of html files
            },
        },
        include: [
            '@kimafinance/kima-transaction-widget',
            '@solana/web3.js',
            '@juggle/resize-observer',
            'readable-stream',
        ], // handle kima require undefined in production build
    },
})
