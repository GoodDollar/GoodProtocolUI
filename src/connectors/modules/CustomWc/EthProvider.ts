import WalletConnect from '@walletconnect/client'
import { Subject, fromEvent } from 'rxjs'
import { takeUntil, take } from 'rxjs/operators'
import QRCodeModal from '@walletconnect/qrcode-modal'
import { isMobile } from './helpers/isMobile'
import { ProviderRpcError, ProviderRpcErrorCode } from '@web3-onboard/common'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import EventEmitter from 'eventemitter3'
import { AsyncStorage } from '@gooddollar/web3sdk-v2'

import { WcConnectOptions } from './types'
import type { Chain, EIP1193Provider, ProviderAccounts } from '@web3-onboard/common'
import type { StaticJsonRpcProvider as StaticJsonRpcProviderType } from '@ethersproject/providers'

export class EthProvider {
    public request: EIP1193Provider['request']
    public connector: InstanceType<typeof WalletConnect>
    public chains: Chain[]
    public disconnect: EIP1193Provider['disconnect']
    public emit: EventEmitter['emit']
    public on: EventEmitter['on']
    public removeListener: EventEmitter['removeListener']
    public QrCodeModal: typeof QRCodeModal

    private disconnected$: InstanceType<typeof Subject>
    private providers: Record<string, StaticJsonRpcProviderType>

    constructor({
        connector,
        chains,
        emitter,
        options,
    }: {
        connector: InstanceType<typeof WalletConnect>
        chains: Chain[]
        emitter: any
        options: WcConnectOptions
    }) {
        this.emit = emitter.emit.bind(emitter)
        this.on = emitter.on.bind(emitter)
        this.removeListener = emitter.removeListener.bind(emitter)

        this.connector = connector
        this.chains = chains
        this.disconnected$ = new Subject()
        this.providers = {}
        //@ts-ignore - Sometimes default exists, sometimes doesnt
        this.QrCodeModal = QRCodeModal.default || QRCodeModal

        const { customLabelFor: label, qrcodeModalOptions, connectFirstChainId } = options

        // listen for session updates
        fromEvent(this.connector, 'session_update', (error: any, payload: any) => {
            if (error) {
                throw error
            }

            return payload
        })
            .pipe(takeUntil(this.disconnected$))
            .subscribe({
                next: ({ params }: { params: any }) => {
                    const [{ accounts, chainId }] = params
                    this.emit('accountsChanged', accounts)
                    this.emit('chainChanged', `0x${chainId.toString(16)}`)
                },
                error: console.warn,
            })

        // listen for disconnect event
        fromEvent(this.connector, 'disconnect', (error: any, payload: any) => {
            if (error) {
                throw error
            }

            return payload
        })
            .pipe(takeUntil(this.disconnected$))
            .subscribe({
                next: () => {
                    this.emit('accountsChanged', [])
                    this.disconnected$.next(true)
                    AsyncStorage.safeRemove('walletconnect')
                },
                error: console.warn,
            })

        this.disconnect = () => this.connector.killSession()

        this.request = async ({ method, params }: { method: string; params?: any }) => {
            if (method === 'eth_chainId') {
                return `0x${this.connector.chainId.toString(16)}`
            }

            if (method === 'eth_requestAccounts') {
                return new Promise<ProviderAccounts>((resolve, reject) => {
                    // Check if connection is already established
                    if (!this.connector.connected) {
                        // create new session
                        void this.connector
                            .createSession(connectFirstChainId ? { chainId: parseInt(chains[0].id, 16) } : undefined)
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

            if (method === 'wallet_switchEthereumChain' || method === 'eth_selectAccounts') {
                throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                    message: `The Provider does not support the requested method: ${method}`,
                })
            }

            if (method === 'eth_sendTransaction') {
                return this.connector.sendTransaction(params[0])
            }

            if (method === 'eth_signTransaction') {
                return this.connector.signTransaction(params[0])
            }

            if (method === 'personal_sign') {
                return this.connector.signPersonalMessage(params)
            }

            if (method === 'eth_sign') {
                return this.connector.signMessage(params)
            }

            if (method === 'eth_signTypedData') {
                return this.connector.signTypedData(params)
            }

            if (method === 'eth_accounts') {
                return this.connector.sendCustomRequest({
                    id: 1337,
                    jsonrpc: '2.0',
                    method,
                    params,
                })
            }

            const chainId = await this.request({ method: 'eth_chainId' })

            if (!this.providers[chainId]) {
                const currentChain = chains.find(({ id }) => id === chainId)

                if (!currentChain) {
                    throw new ProviderRpcError({
                        code: ProviderRpcErrorCode.CHAIN_NOT_ADDED,
                        message: `The Provider does not have a rpcUrl to make a request for the requested method: ${method}`,
                    })
                }

                this.providers[chainId] = new StaticJsonRpcProvider(currentChain.rpcUrl)
            }

            return this.providers[chainId].send(method, params)
        }
    }
}
