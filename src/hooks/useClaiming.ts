import { check, claim, isWhitelisted, SupportedChainId, useGdContextProvider } from '@gooddollar/web3sdk'
import { useCallback, useEffect, useState } from 'react'
import usePromise from './usePromise'
import useActiveWeb3React from './useActiveWeb3React'
import useSendAnalyticsData from './useSendAnalyticsData'

const getTimer = () => {
    const start = new Date() as any
    start.setUTCHours(12, 0, 0)

    function pad(num: any) {
        return ('0' + parseInt(num)).substr(-2)
    }

    function tick() {
        const now = new Date() as any

        if (now > start) {
            start.setDate(start.getDate() + 1)
        }

        const remain = (start - now) / 1000
        const hh = pad((remain / 60 / 60) % 60)
        const mm = pad((remain / 60) % 60)
        const ss = pad(remain % 60)
        const timeLeft = hh + ':' + mm + ':' + ss

        return timeLeft
    }

    return tick()
}

interface UseClaimReturn {
    claimable?: boolean | Error
    tillClaim: string
    handleClaim: () => Promise<void>
    isFuse: boolean
    claimActive: boolean
    claimed: boolean
}

export const useClaiming = (): UseClaimReturn => {
    const { chainId, account } = useActiveWeb3React()
    const network = SupportedChainId[chainId]
    const { web3 } = useGdContextProvider()
    const sendData = useSendAnalyticsData()

    const [claimed, setIsClaimed] = useState(false)
    const [tillClaim, setTillClaim] = useState('')

    const fetchTimer = useCallback(() => {
        const timer = getTimer()
        setTillClaim(timer)
    }, [])

    useEffect(() => {
        if (!claimed) return
        else {
            const interval = setInterval(fetchTimer, 1000)
            return () => clearInterval(interval)
        }
    }, [fetchTimer, claimed])

    const [claimable, , , refetch] = usePromise(async () => {
        if (!account || !web3 || (chainId as any) !== SupportedChainId.FUSE) return false
        const whitelisted = await isWhitelisted(web3, account).catch((e) => {
            console.error(e)
            return false
        })

        if (!whitelisted) return new Error('Only verified wallets can claim')

        const amount = await check(web3, account).catch((e) => {
            console.error(e)
            return new Error('Something went wrong.. try again later.')
        })
        if (amount instanceof Error) return amount

        if (amount === '0') {
            setIsClaimed(true)
        }

        return /[^0.]/.test(amount)
    }, [chainId, web3, account])

    const handleClaim = useCallback(async () => {
        if (account && web3) {
            sendData({ event: 'claim', action: 'claimStart', network })

            const startClaim = await claim(web3, account).catch((e) => {
                refetch()
                return false
            })

            if (startClaim) {
                sendData({ event: 'claim', action: 'claimSuccess', network })
                refetch()
            }
        }
    }, [account, web3, sendData, network, refetch])

    const isFuse = (chainId as any) === SupportedChainId.FUSE

    return { claimed, claimable, tillClaim, isFuse, claimActive: isFuse && claimable === true, handleClaim }
}