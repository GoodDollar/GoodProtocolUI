import 'react'

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'gooddollar-savings-widget': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                ref?: React.Ref<
                    HTMLElement & {
                        connectWallet?: () => void
                        web3Provider?: unknown | null
                    }
                >
            }
        }
    }
}
