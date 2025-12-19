type MaybeMiniPayProvider = {
    isMiniPay?: boolean
    providers?: MaybeMiniPayProvider[]
}

const findMiniPayProvider = (ethereum: MaybeMiniPayProvider): MaybeMiniPayProvider | undefined => {
    if (!ethereum) {
        return undefined
    }

    // EIP-6963 style multi-injected provider array
    if (Array.isArray(ethereum.providers)) {
        const provider = ethereum.providers.find((candidate) => candidate?.isMiniPay)
        if (provider) {
            return provider
        }
    }

    return ethereum.isMiniPay ? ethereum : undefined
}

export const getMiniPayProvider = (): MaybeMiniPayProvider | undefined => {
    if (typeof window === 'undefined') {
        return undefined
    }

    // @ts-ignore: ethereum is injected by wallets
    const { ethereum } = window
    if (!ethereum) {
        return undefined
    }

    return findMiniPayProvider(ethereum)
}

export function isMiniPay(): boolean {
    return Boolean(getMiniPayProvider())
}

export const waitForMiniPayProvider = async (timeoutMs = 1200): Promise<MaybeMiniPayProvider | undefined> => {
    const existing = getMiniPayProvider()
    if (existing) {
        return existing
    }

    if (typeof window === 'undefined') {
        return undefined
    }

    return new Promise((resolve) => {
        const handleReady = () => {
            const provider = getMiniPayProvider()
            if (provider) {
                cleanup()
                resolve(provider)
            }
        }

        const cleanup = () => {
            window.removeEventListener('ethereum#initialized', handleReady as any)
            clearTimeout(timer)
        }

        const timer = window.setTimeout(() => {
            cleanup()
            resolve(getMiniPayProvider())
        }, timeoutMs)

        window.addEventListener('ethereum#initialized', handleReady as any, { once: true })
    })
}
