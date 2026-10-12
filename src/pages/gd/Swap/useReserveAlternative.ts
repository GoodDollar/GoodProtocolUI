import { useEffect, useState } from 'react'

export type ReserveAlternativeCheck = () => Promise<{ chainId: number; checkedAt: number } | undefined>
const refreshInterval = 15000

export const useReserveAlternative = (
    sourceChainId: number | undefined,
    enabled: boolean,
    check: ReserveAlternativeCheck | undefined
): number | undefined => {
    const [verified, setVerified] = useState<{ sourceChainId: number; chainId: number; checkedAt: number }>()

    useEffect(() => {
        let cancelled = false
        let timer: ReturnType<typeof setTimeout> | undefined
        setVerified(undefined)
        if (!enabled || !check || (sourceChainId !== 42220 && sourceChainId !== 50)) return
        const otherChainId = sourceChainId === 42220 ? 50 : 42220

        const refresh = async () => {
            setVerified(undefined)
            try {
                const result = await check()
                const age = result ? Date.now() - result.checkedAt : Infinity
                if (!cancelled && result?.chainId === otherChainId && age >= 0 && age < refreshInterval) {
                    setVerified({ ...result, sourceChainId })
                }
            } catch {
                // An unreachable or unchecked Reserve must not show an alternative-chain suggestion.
            } finally {
                if (!cancelled) timer = setTimeout(() => void refresh(), refreshInterval)
            }
        }
        void refresh()
        return () => {
            cancelled = true
            if (timer) clearTimeout(timer)
        }
    }, [sourceChainId, enabled, check])

    return enabled &&
        verified &&
        verified.sourceChainId === sourceChainId &&
        Date.now() - verified.checkedAt < refreshInterval
        ? verified.chainId
        : undefined
}
