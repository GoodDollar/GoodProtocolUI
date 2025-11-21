import { check, claim, isWhitelisted, SupportedChainId, useGdContextProvider } from '@gooddollar/web3sdk'
import { useCallback, useEffect, useState } from 'react'
import usePromise from './usePromise'
import useSendAnalyticsData from './useSendAnalyticsData'
import { useClaim, useTimer } from '@gooddollar/web3sdk-v2'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'

interface UseClaimReturn {
    claimable?: boolean | Error
    tillClaim: string
    handleClaim: () => Promise<boolean>
    isFuse: boolean
    claimActive: boolean
    claimed: boolean
}

export const useClaiming = (): UseClaimReturn => {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const network = SupportedChainId[+(chainId ?? 1)]
    const { web3 } = useGdContextProvider()
    const sendData = useSendAnalyticsData()
    const { nextClaimTime } = useClaim()

    const [claimed, setIsClaimed] = useState(false)
    const [nextClaim, , setClaimTime] = useTimer(nextClaimTime)

    useEffect(() => setClaimTime(nextClaimTime), [nextClaimTime.toString()])

    const [claimable, , , refetch] = usePromise(async () => {
        if (!address || !web3 || (chainId as any) !== SupportedChainId.FUSE) return false
        const whitelisted = await isWhitelisted(web3, address).catch((e) => {
            console.error(e)
            return false
        })

        if (!whitelisted) return new Error('Only verified wallets can claim')

        const amount = await check(web3, address).catch((e) => {
            console.error(e)
            return new Error('Something went wrong.. try again later.')
        })
        if (amount instanceof Error) return amount

        if (amount === '0') {
            setIsClaimed(true)
        }

        return /[^0.]/.test(amount)
    }, [chainId, web3, address])

    const handleClaim = useCallback(async () => {
        if (!address || !web3) {
            return false
        }

        sendData({ event: 'claim', action: 'claim_start', network })

        const startClaim = await claim(web3, address).catch(() => {
            refetch()
            return false
        })

        if (!startClaim) {
            return false
        }

        sendData({ event: 'claim', action: 'claim_success', network })
        refetch()
        return true
    }, [address, web3, sendData, network, refetch])

    const isFuse = (chainId as any) === SupportedChainId.FUSE

    return {
        claimed,
        claimable,
        tillClaim: nextClaim ?? '',
        isFuse,
        claimActive: isFuse && claimable === true,
        handleClaim,
    }
}
