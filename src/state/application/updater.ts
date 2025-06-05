import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useAccount, usePublicClient, useChainId } from 'wagmi'

export default function Updater(): null {
    const { address: account } = useAccount()
    const chainId = useChainId()
    const publicClient = usePublicClient()
    const dispatch = useDispatch()

    const windowVisible = useIsWindowVisible()

    const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
        chainId,
        blockNumber: null,
    })

    const blockNumberCallback = useCallback(
        (blockNumber: number) => {
            setState((state) => {
                if (chainId === state.chainId) {
                    if (typeof state.blockNumber !== 'number') return { chainId, blockNumber }
                    return { chainId, blockNumber: Math.max(blockNumber, state.blockNumber) }
                }
                return state
            })
        },
        [chainId, setState]
    )

    useEffect(() => {
        if (!account || !publicClient || !chainId || !windowVisible) return undefined

        const fetchBlockNumber = async () => {
            try {
                const blockNumber = await publicClient.getBlockNumber()
                blockNumberCallback(Number(blockNumber))
            } catch (error) {
                console.error(`Failed to get block number for chainId: ${chainId}`, error)
            }
        }

        void fetchBlockNumber()
        const intervalId = setInterval(fetchBlockNumber, 15000)

        return () => {
            clearInterval(intervalId)
        }
    }, [account, publicClient, chainId, windowVisible, blockNumberCallback])

    const debouncedState = useDebounce(state, 100)

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
        dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

    return null
}
