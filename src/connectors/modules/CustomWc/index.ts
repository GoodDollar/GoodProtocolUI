import { isMobile } from './helpers/isMobile'
import { EthProvider } from './EthProvider'

import type { Chain, WalletInit } from '@web3-onboard/common'
import { IWalletConnectOptions } from '@walletconnect/types'
import { WcConnectOptions, CustomLabels } from './types'

function customWcModule(options: WcConnectOptions): WalletInit {
    const { customLabelFor: label, bridge = 'https://bridge.walletconnect.org' } = options
    return () => ({
        label: CustomLabels[label as keyof typeof CustomLabels],
        getIcon: async () => (await import(`./helpers/icons/${label}/icon.js`)).default,
        getInterface: async ({ chains, EventEmitter }: { chains: Chain[]; EventEmitter: any }) => {
            const { default: WalletConnect } = await import('@walletconnect/client')

            let wcOptions: IWalletConnectOptions = { bridge }
            if (!isMobile()) {
                wcOptions = {
                    ...wcOptions,
                    qrcodeModalOptions: { desktopLinks: ['ZenGo'] }, // Todo: doesn't show up
                }
            }

            const connector = new WalletConnect(wcOptions)

            const emitter = new EventEmitter()
            const provider = new EthProvider({ chains, connector, emitter, options })

            return {
                provider,
            }
        },
    })
}

export default customWcModule
