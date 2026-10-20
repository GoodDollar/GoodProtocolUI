import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3Context } from '@gooddollar/web3sdk-v2'
import { Web3Provider, TransactionReceipt } from '@ethersproject/providers'
import { useAppKitNetwork } from '@reown/appkit/react'
import { i18n } from '@lingui/core'
import { useAddPopup, useBlockNumber } from '../application/hooks'
import { AppDispatch, AppState } from '../index'
import {
    checkedTransaction,
    finalizeTransaction,
    removeTransaction,
    replaceTransaction,
    SerializableTransactionReceipt,
} from './actions'
import { removePopup } from '../application/actions'
import { checkPendingTransaction, PENDING_TIMEOUT_MS, shouldCheck } from './lifecycle'
import type { TransactionDetails } from './reducer'

export { shouldCheck } from './lifecycle'

function serializable(receipt: TransactionReceipt): SerializableTransactionReceipt {
    return {
        blockHash: receipt.blockHash,
        blockNumber: receipt.blockNumber,
        contractAddress: receipt.contractAddress,
        from: receipt.from,
        status: receipt.status,
        to: receipt.to,
        transactionHash: receipt.transactionHash,
        transactionIndex: receipt.transactionIndex,
    }
}

export default function Updater(): null {
    const { chainId } = useAppKitNetwork()
    const { web3Provider: library } = useWeb3Context() as { web3Provider: Web3Provider }
    const lastBlockNumber = useBlockNumber()
    const dispatch = useDispatch<AppDispatch>()
    const state = useSelector<AppState, AppState['transactions']>((state) => state.transactions)
    const transactions: Record<string, TransactionDetails> = chainId ? state[chainId] ?? {} : {}
    const addPopup = useAddPopup()

    useEffect(() => {
        if (!chainId || !library) return
        let active = true
        const checking = new Set<string>()
        const timers: ReturnType<typeof setTimeout>[] = []
        const check = async (hash: string, tx: TransactionDetails) => {
            if (checking.has(hash)) return
            checking.add(hash)
            try {
                const result = await checkPendingTransaction(library, hash, tx.addedTime)
                if (!active) return
                if ('replacement' in result) {
                    const { hash: replacementHash, receipt, reason } = result.replacement
                    const summary =
                        reason === 'repriced'
                            ? tx.summary
                            : reason === 'cancelled'
                            ? i18n._('Transaction cancelled')
                            : i18n._('Replacement transaction')
                    dispatch(
                        replaceTransaction({
                            chainId: +chainId,
                            hash,
                            replacementHash,
                            receipt: serializable(receipt),
                            reason,
                            summary,
                        })
                    )
                    dispatch(removePopup({ key: hash }))
                    if (!transactions[replacementHash]?.receipt) {
                        addPopup(
                            {
                                txn: {
                                    hash: replacementHash,
                                    success: reason !== 'cancelled' && receipt.status === 1,
                                    summary,
                                },
                            },
                            replacementHash
                        )
                    }
                } else if ('dismissed' in result) {
                    dispatch(removeTransaction({ chainId: +chainId, hash }))
                    dispatch(removePopup({ key: hash }))
                } else if ('receipt' in result) {
                    dispatch(
                        finalizeTransaction({
                            chainId: +chainId,
                            hash,
                            receipt: serializable(result.receipt),
                            summary: tx.summary,
                        })
                    )
                    addPopup({ txn: { hash, success: result.receipt.status === 1, summary: tx.summary } }, hash)
                } else if (lastBlockNumber) {
                    dispatch(checkedTransaction({ chainId: +chainId, hash, blockNumber: lastBlockNumber }))
                }
            } catch (error) {
                if (active) console.error(`failed to check transaction hash: ${hash}`, error)
            } finally {
                checking.delete(hash)
            }
        }
        for (const [hash, tx] of Object.entries(transactions)) {
            if (tx.receipt) continue
            if (lastBlockNumber && shouldCheck(lastBlockNumber, tx)) void check(hash, tx)
            // The timer uses the same receipt handling as block polling, including confirmations.
            timers.push(
                setTimeout(() => {
                    void check(hash, tx)
                }, Math.max(0, tx.addedTime + PENDING_TIMEOUT_MS - Date.now()))
            )
        }
        return () => {
            active = false
            timers.forEach(clearTimeout)
        }
    }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup])
    return null
}
