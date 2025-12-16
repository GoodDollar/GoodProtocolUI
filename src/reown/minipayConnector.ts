import { createConnector } from 'wagmi'
import { getMiniPayProvider, waitForMiniPayProvider } from '../utils/minipay'

interface MiniPayProvider {
    isMiniPay: boolean
    request(args: { method: string; params?: unknown[] }): Promise<unknown>
    disconnect?: () => Promise<void>
    on?(...args: unknown[]): void
    removeListener?(...args: unknown[]): void
}

function handleProviderError(error: unknown): never {
    if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = error.code
        if (errorCode === 4001) {
            throw new Error('User rejected the request')
        }
        if (errorCode === 4902) {
            throw new Error('Chain not added to wallet')
        }
    }
    throw error instanceof Error ? error : new Error('Unknown error occurred')
}

function parseChainId(chainId: string | number): number {
    if (typeof chainId === 'number') return chainId
    if (typeof chainId === 'string') {
        return Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10)
    }
    throw new Error('Invalid chain ID format')
}

export function miniPayConnector() {
    const resolveMiniPayProvider = async (): Promise<MiniPayProvider | undefined> => {
        const provider = (await waitForMiniPayProvider()) as MiniPayProvider | undefined
        if (provider?.isMiniPay) {
            return provider
        }
        return undefined
    }

    return createConnector((config) => {
        let provider: MiniPayProvider | undefined
        let cleanup: (() => void) | undefined

        const accountsChangedHandler = (accounts: string[]) => {
            if (accounts.length === 0) {
                config.emitter.emit('disconnect')
            } else {
                config.emitter.emit('change', {
                    accounts: accounts.map((account) => account as `0x${string}`),
                })
            }
        }

        const chainChangedHandler = (chainId: string | number) => {
            const id = parseChainId(chainId)
            config.emitter.emit('change', { chainId: id })
        }

        const disconnectHandler = () => {
            config.emitter.emit('disconnect')
        }

        const setupEventListeners = (targetProvider: MiniPayProvider) => {
            cleanup = () => {
                targetProvider.removeListener?.('accountsChanged', accountsChangedHandler)
                targetProvider.removeListener?.('chainChanged', chainChangedHandler)
                targetProvider.removeListener?.('disconnect', disconnectHandler)
            }

            targetProvider.on?.('accountsChanged', accountsChangedHandler)
            targetProvider.on?.('chainChanged', chainChangedHandler)
            targetProvider.on?.('disconnect', disconnectHandler)
        }

        return {
            id: 'minipay',
            name: 'MiniPay',
            type: 'injected',
            async connect() {
                if (typeof window === 'undefined') {
                    throw new Error('MiniPay is not available in this browser')
                }

                provider = await resolveMiniPayProvider()
                if (!provider || !provider.isMiniPay) {
                    throw new Error('MiniPay provider not found')
                }

                try {
                    const accounts = (await provider.request({
                        method: 'eth_requestAccounts',
                    })) as string[]

                    const account = accounts[0]
                    if (!account) {
                        throw new Error('No account found')
                    }

                    const chainId = (await provider.request({
                        method: 'eth_chainId',
                    })) as string

                    setupEventListeners(provider)

                    return {
                        accounts: [account as `0x${string}`],
                        chainId: parseChainId(chainId),
                    }
                } catch (error) {
                    handleProviderError(error)
                }
            },
            async disconnect() {
                cleanup?.()
                cleanup = undefined

                if (provider && typeof provider.disconnect === 'function') {
                    try {
                        await provider.disconnect()
                    } catch (error) {
                        console.warn('Error disconnecting MiniPay:', error)
                    }
                }

                provider = undefined
            },
            async getAccounts() {
                provider = getMiniPayProvider() as MiniPayProvider | undefined
                if (!provider) return []

                try {
                    const accounts = (await provider.request({
                        method: 'eth_accounts',
                    })) as string[]
                    return accounts.map((account) => account as `0x${string}`)
                } catch {
                    return []
                }
            },
            async getChainId() {
                provider = getMiniPayProvider() as MiniPayProvider | undefined
                if (!provider) {
                    throw new Error('MiniPay provider not available')
                }

                try {
                    const chainId = (await provider.request({
                        method: 'eth_chainId',
                    })) as string
                    return parseChainId(chainId)
                } catch {
                    throw new Error('Failed to get chain ID from MiniPay provider')
                }
            },
            async isAuthorized() {
                provider = getMiniPayProvider() as MiniPayProvider | undefined
                if (!provider) return false

                try {
                    const accounts = (await provider.request({
                        method: 'eth_accounts',
                    })) as string[]
                    return accounts.length > 0
                } catch {
                    return false
                }
            },
            onAccountsChanged(accounts) {
                accountsChangedHandler(accounts)
            },
            onChainChanged(chainId) {
                chainChangedHandler(chainId)
            },
            onDisconnect() {
                disconnectHandler()
            },
            async switchChain({ chainId }) {
                provider = getMiniPayProvider() as MiniPayProvider | undefined
                if (!provider) {
                    throw new Error('MiniPay provider not found')
                }

                const targetChain = config.chains.find((chain) => chain.id === chainId)
                if (!targetChain) {
                    throw new Error(`Chain ${chainId} not configured`)
                }

                const hexChainId = `0x${chainId.toString(16)}`

                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: hexChainId }],
                    })
                    return targetChain
                } catch (error) {
                    if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
                        try {
                            await provider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: hexChainId,
                                        chainName: targetChain.name,
                                        nativeCurrency: targetChain.nativeCurrency,
                                        rpcUrls: targetChain.rpcUrls.default.http,
                                        blockExplorerUrls: targetChain.blockExplorers?.default
                                            ? [targetChain.blockExplorers.default.url]
                                            : undefined,
                                    },
                                ],
                            })
                            return targetChain
                        } catch (addError) {
                            handleProviderError(addError)
                        }
                    }
                    handleProviderError(error)
                }
            },
            async getProvider() {
                const provider = getMiniPayProvider()
                if (!provider) return undefined
                return provider as any
            },
        }
    })
}
