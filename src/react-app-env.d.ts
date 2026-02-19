/// <reference types="react-scripts" />
import type React from 'react'

declare module 'react-tradingview-widget'

declare module 'jazzicon' {
    export default function (diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

declare global {
    interface RequestArguments {
        method: string
        params?: unknown[] | object
    }

    interface Window {
        walletLinkExtension?: any
        BinanceChain?: any
        eth?: object
        ethereum?: {
            isMiniPay?: boolean
            isOpera?: boolean
            isMetaMask?: boolean
            on?: (...args: any[]) => void
            off?: (...args: any[]) => void
            removeListener?: (...args: any[]) => void
            removeAllListeners?: (...args: any[]) => void
            autoRefreshOnNetworkChange?: boolean
            request?: (args: RequestArguments) => Promise<unknown>
            providers?: Array<any>
            selectedProvider: {
                isMetaMask?: boolean
                on?: (...args: any[]) => void
                off?: (...args: any[]) => void
                removeListener?: (...args: any[]) => void
                removeAllListeners?: (...args: any[]) => void
                autoRefreshOnNetworkChange?: boolean
                request?: (args: RequestArguments) => Promise<unknown>
            } | null
        }
        web3?: object
    }

    type ArrayType<T> = T extends ArrayLike<infer I> ? I : never

    namespace JSX {
        interface IntrinsicElements {
            'gooddollar-savings-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                ref?: React.MutableRefObject<any>
            }
        }
    }
}
declare module 'content-hash' {
    export function decode(x: string): string
    export function getCodec(x: string): string
}

declare module 'multihashes' {
    export function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
    export function toB58String(hash: Uint8Array): string
}
