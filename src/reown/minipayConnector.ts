import { createConnector } from 'wagmi'
import { isMiniPay } from '../utils/minipay'

/**
 * Custom MiniPay connector for Wagmi
 * Explicitly detects and connects to MiniPay wallet
 * Based on MiniPay documentation: https://docs.minipay.xyz
 */
export function miniPayConnector() {
    return createConnector((config) => ({
        id: 'minipay',
        name: 'MiniPay',
        type: 'injected',
        async connect() {
            const provider = this.getProvider()
            if (!provider) {
                throw new Error('MiniPay provider not found')
            }

            // Request account access
            const accounts = await (provider as any).request({
                method: 'eth_requestAccounts',
            })

            const account = accounts[0]
            if (!account) {
                throw new Error('No account found')
            }

            // Get chain ID
            const chainId = await (provider as any).request({ method: 'eth_chainId' })

            return {
                accounts: [account as `0x${string}`],
                chainId: Number(chainId),
            }
        },
        async disconnect() {
            const provider = this.getProvider()
            if (provider && typeof provider.disconnect === 'function') {
                await provider.disconnect()
            }
        },
        async getAccounts() {
            const provider = this.getProvider()
            if (!provider) return []
            const accounts = await (provider as any).request({ method: 'eth_accounts' })
            return accounts.map((account: string) => account as `0x${string}`)
        },
        async getChainId() {
            const provider = this.getProvider()
            if (!provider) return config.chains[0].id
            const chainId = await (provider as any).request({ method: 'eth_chainId' })
            return Number(chainId)
        },
        async isAuthorized() {
            const provider = this.getProvider()
            if (!provider) return false
            const accounts = await (provider as any).request({ method: 'eth_accounts' })
            return accounts.length > 0
        },
        onAccountsChanged(accounts) {
            if (accounts.length === 0) {
                config.emitter.emit('disconnect')
            } else {
                config.emitter.emit('change', { accounts: accounts.map((account: string) => account as `0x${string}`) })
            }
        },
        onChainChanged(chainId) {
            const id = Number(chainId)
            config.emitter.emit('change', { chainId: id })
        },
        onDisconnect() {
            config.emitter.emit('disconnect')
        },
        async switchChain({ chainId }) {
            const provider = this.getProvider()
            if (!provider) {
                throw new Error('MiniPay provider not found')
            }

            const id = `0x${chainId.toString(16)}`
            await (provider as any).request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: id }],
            })

            return config.chains.find((chain) => chain.id === chainId) || config.chains[0]
        },
        getProvider() {
            // Only return provider if MiniPay is detected
            if (typeof window !== 'undefined' && isMiniPay() && (window as any).ethereum) {
                return (window as any).ethereum
            }
            return undefined
        },
    }))
}
