import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { lingui } from '@lingui/vite-plugin'
import dynamicImports from 'vite-plugin-dynamic-import'
import { visualizer } from 'rollup-plugin-visualizer'
import dotenv from 'dotenv'
import * as esbuild from 'esbuild'

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

const jsxTransform = (matchers: RegExp[]) => ({
    name: 'js-in-jsx',
    load(id: string) {
        if (matchers.some((matcher) => matcher.test(id)) && id.endsWith('.js')) {
            const file = fs.readFileSync(id, { encoding: 'utf-8' })
            return esbuild.transformSync(file, { loader: 'jsx', jsx: 'transform' })
        }
    },
})

export default defineConfig(({ command, mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
    return {
        envPrefix: 'REACT_APP_',
        server: {
            https,
        },
        plugins: [
            visualizer({
                template: 'treemap', // or sunburst
                open: false,
                gzipSize: true,
                brotliSize: true,
                filename: 'analice.html',
            }),
            dynamicImports(), //for lingui dynamic import lang files
            // checker({
            //     // e.g. use TypeScript check
            //     typescript: true,
            // }),
            nodePolyfills({
                protocolImports: true,
                exclude: ['constants', 'crypto'],
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
                'lottie-react-native': 'react-native-web-lottie',
                '@react-native-clipboard/clipboard': 'react-native-web-clipboard',
                jsbi: path.resolve(__dirname, '.', 'node_modules', 'jsbi', 'dist', 'jsbi-cjs.js'), // https://github.com/Uniswap/sdk-core/issues/20#issuecomment-1559863408
            },
            dedupe: ['react', 'ethers', 'react-dom', 'native-base'],
        },
        build: {
            commonjsOptions: {
                extensions: ['.js', '.jsx', '.web.js', '.web.jsx'],
                transformMixedEsModules: true, //handle deps that use "require" and "module.exports"
                include: [/node_modules/],
            },
            rollupOptions: {
                plugins: [jsxTransform([/react-native-.*\.jsx?$/])], //for some reason react-native packages are not being transpiled even with esbuild jsx settings
            },
        },
        define: {
            'process.browser': true,
            'process.env': process.env,
        },
        optimizeDeps: {
            esbuildOptions: {
                loader: {
                    '.html': 'text', // allow import or require of html files
                },
            },
        },
    }
})
