import { fromEvent } from 'rxjs'
import { take } from 'rxjs/operators'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { default as defaultWcModule } from '@web3-onboard/walletconnect'
import { GetInterfaceHelpers, ProviderAccounts, ProviderRpcError, WalletInit, WalletModule } from '@web3-onboard/common'

import { getDevice, isMobile } from '../../../base/utils/platform'
import { icons } from './icons'

import { CustomLabels, WcConnectOptions } from './types'

function customWcModule(options: WcConnectOptions): WalletInit {
  const { customLabelFor: label, connectFirstChainId, qrcodeModalOptions = {}, bridge = 'https://bridge.walletconnect.org' } = options
  const defaultWc = defaultWcModule({ bridge });

  if (!isMobile()) {
    (qrcodeModalOptions as any).desktopLinks = ['ZenGo'];
  }

  return () => {
    const wc = defaultWc({ device: getDevice() }) as WalletModule;
    const { getInterface } = wc;

    wc.label = CustomLabels[label as keyof typeof CustomLabels];
    wc.getIcon = async () => icons[label];

    wc.getInterface = async (helpers: GetInterfaceHelpers) => {
      const ui = await getInterface(helpers);
      const { provider } = ui as { provider: any };
      const { connector, request } = provider;

      // hack QR code opts
      connector._qrcodeModalOptions = qrcodeModalOptions;

      // hack requests, SHOULD be function to keep provider instance's 'this' context
      provider.request = async function ({ method, params }: { method: string; params?: any }) {
        if (method !== 'eth_requestAccounts') {
          return request({ method, params })
        }

        // for 'eth_requestAccounts' method only
        return new Promise<ProviderAccounts>((resolve, reject) => {
          // Check if connection is already established
          if (!this.connector.connected) {
            // create new session
            void this.connector
              .createSession(connectFirstChainId ? { chainId: parseInt(this.chains[0].id, 16) } : undefined)
              .then(() => {
                if (label === 'zengo' && isMobile()) {
                  window.open(
                    `https://get.zengo.com/wc?uri=${encodeURIComponent(this.connector.uri)}`,
                    '_blank'
                  )
                } else {
                  QRCodeModal.open(
                    this.connector.uri,
                    () =>
                      reject(
                        new ProviderRpcError({
                          code: 4001,
                          message: 'User rejected the request.',
                        })
                      ),
                    qrcodeModalOptions
                  )
                }
              })
          } else {
            const { accounts, chainId } = this.connector.session

            this.emit('chainChanged', `0x${chainId.toString(16)}`)
            return resolve(accounts)
          }

          // Subscribe to connection events
          fromEvent(this.connector, 'connect', (error: any, payload: any) => {
            if (error) {
              throw error
            }

            return payload
          })
            .pipe(take(1))
            .subscribe({
              next: ({ params }: { params: any }) => {
                const [{ accounts, chainId }] = params
                this.emit('accountsChanged', accounts)
                this.emit('chainChanged', `0x${chainId.toString(16)}`)
                QRCodeModal.close()
                resolve(accounts)
              },
              error: reject,
            })
        })
      }

      return ui;
    }

    return wc
  };
}

export default customWcModule
