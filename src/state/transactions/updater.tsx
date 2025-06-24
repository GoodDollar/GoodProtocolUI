import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAddPopup } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import { checkedTransaction, finalizeTransaction } from './actions'
import { useChainId, usePublicClient, useBlockNumber } from 'wagmi'

interface TransactionDetails {
    hash: string
    addedTime: number
    receipt?: object
    lastCheckedBlockNumber?: number
    summary?: string
}

export function shouldCheck(
    lastBlockNumber: number,
    tx: { addedTime: number; receipt?: object; lastCheckedBlockNumber?: number }
): boolean {
    if (tx.receipt) return false
    if (!tx.lastCheckedBlockNumber) return true
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
    if (blocksSinceCheck < 1) return false
    const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
    if (minutesPending > 60) {
        // every 10 blocks if pending for longer than an hour
        return blocksSinceCheck > 9
    } else if (minutesPending > 5) {
        // every 3 blocks if pending more than 5 minutes
        return blocksSinceCheck > 2
    } else {
        // otherwise every block
        return true
    }
}

export default function Updater(): null {
    const chainId = useChainId()
    const publicClient = usePublicClient()
    const { data: lastBlockNumber } = useBlockNumber({ watch: true })

    const dispatch = useDispatch<AppDispatch>()

    const transactions = useSelector<AppState, { [txHash: string]: TransactionDetails }>((state) =>
        chainId ? state.transactions[chainId] ?? {} : {}
    )

    const addPopup = useAddPopup()

    useEffect(() => {
        if (!chainId || !publicClient || !lastBlockNumber) return

        Object.keys(transactions)
            .filter((hash) => shouldCheck(Number(lastBlockNumber), transactions[hash]))
            .forEach((hash) => {
                publicClient
                    .getTransactionReceipt({ hash: hash as `0x${string}` })
                    .then((receipt) => {
                        const confirmedSummary = transactions[hash]?.summary
                        if (receipt) {
                            dispatch(
                                finalizeTransaction({
                                    chainId,
                                    hash,
                                    receipt: {
                                        blockHash: receipt.blockHash,
                                        blockNumber: Number(receipt.blockNumber),
                                        contractAddress: receipt.contractAddress ?? '',
                                        from: receipt.from,
                                        status:
                                            receipt.status === 'success'
                                                ? 1
                                                : receipt.status === 'reverted'
                                                ? 0
                                                : undefined,
                                        to: receipt.to ?? '',
                                        transactionHash: receipt.transactionHash,
                                        transactionIndex: receipt.transactionIndex,
                                    },
                                    summary: confirmedSummary,
                                })
                            )

                            addPopup(
                                {
                                    txn: {
                                        hash,
                                        success: Number(receipt.status) === 1,
                                        summary: confirmedSummary,
                                    },
                                },
                                hash
                            )
                        } else {
                            dispatch(checkedTransaction({ chainId, hash, blockNumber: Number(lastBlockNumber) }))
                        }
                    })
                    .catch((error) => {
                        console.error(`Failed to check transaction hash: ${hash}`, error)
                    })
            })
    }, [chainId, publicClient, transactions, lastBlockNumber, dispatch, addPopup])

    return null
}
