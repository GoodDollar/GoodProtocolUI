import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3Context } from '@gooddollar/web3sdk-v2'
import useDebounce from '../../hooks/useDebounce'
import useIsWindowVisible from '../../hooks/useIsWindowVisible'
import { updateBlockNumber } from './actions'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'

export default function Updater(): null {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { web3Provider: library } = useWeb3Context() as { web3Provider: Web3Provider }
    const dispatch = useDispatch()

    const windowVisible = useIsWindowVisible()

    const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
        chainId: +(chainId ?? 42220),
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

    // attach/detach listeners
    useEffect(() => {
        if (!address || !library || !chainId || !windowVisible) return undefined

        setState({ chainId: +(chainId ?? 42220), blockNumber: null })
        library
            .getBlockNumber()
            .then(blockNumberCallback)
            .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error))

        library.on('block', blockNumberCallback)
        return () => {
            library.removeListener('block', blockNumberCallback)
        }
    }, [/*used */ dispatch, chainId, library, blockNumberCallback, windowVisible, address])

    const debouncedState = useDebounce(state, 100)

    useEffect(() => {
        if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return
        dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }))
    }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId])

    return null
}
