import { createReducer } from '@reduxjs/toolkit'
import {
    addTransaction,
    checkedTransaction,
    clearAllTransactions,
    finalizeTransaction,
    removeTransaction,
    replaceTransaction,
    SerializableTransactionReceipt,
} from './actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
    hash: string
    approval?: { tokenAddress: string; spender: string }
    summary?: string
    claim?: { recipient: string }
    receipt?: SerializableTransactionReceipt
    lastCheckedBlockNumber?: number
    addedTime: number
    confirmedTime?: number
    replacementReason?: 'repriced' | 'cancelled' | 'replaced'
    from: string
    tradeInfo?: {
        input: {
            decimals: number | undefined
            symbol: string | undefined
        }
        output: {
            decimals: number | undefined
            symbol: string | undefined
        }
    }
}

export interface TransactionState {
    [chainId: number]: {
        [txHash: string]: TransactionDetails
    }
}

export const initialState: TransactionState = {}

const transactions = createReducer(initialState, (builder) =>
    builder
        .addCase(
            addTransaction,
            (transactions, { payload: { chainId, from, hash, approval, summary, claim, tradeInfo } }) => {
                if (transactions[chainId]?.[hash]) {
                    throw Error('Attempted to add existing transaction.')
                }
                const txs = transactions[chainId] ?? {}
                txs[hash] = { hash, approval, summary, tradeInfo, claim, from, addedTime: now() }
                transactions[chainId] = txs
            }
        )
        .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
            if (!transactions[chainId]) return
            transactions[chainId] = {}
        })
        .addCase(removeTransaction, (transactions, { payload: { chainId, hash } }) => {
            if (transactions[chainId]?.[hash] && !transactions[chainId][hash].receipt) {
                delete transactions[chainId][hash]
            }
        })
        .addCase(
            replaceTransaction,
            (transactions, { payload: { chainId, hash, replacementHash, receipt, reason, summary } }) => {
                const tx = transactions[chainId]?.[hash]
                if (!tx || tx.receipt || hash === replacementHash) return
                const existing = transactions[chainId][replacementHash]
                transactions[chainId][replacementHash] = {
                    ...(reason === 'repriced' ? tx : { from: receipt.from, addedTime: tx.addedTime }),
                    ...existing,
                    hash: replacementHash,
                    receipt,
                    confirmedTime: now(),
                    replacementReason: reason,
                    claim: reason === 'repriced' ? existing?.claim ?? tx.claim : undefined,
                    approval: reason === 'repriced' ? existing?.approval ?? tx.approval : undefined,
                    tradeInfo: reason === 'repriced' ? existing?.tradeInfo ?? tx.tradeInfo : undefined,
                    summary: existing?.summary ?? (reason === 'repriced' ? tx.summary : summary),
                }
                delete transactions[chainId][hash]
            }
        )
        .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
            const tx = transactions[chainId]?.[hash]
            if (!tx) {
                return
            }
            if (!tx.lastCheckedBlockNumber) {
                tx.lastCheckedBlockNumber = blockNumber
            } else {
                tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
            }
        })
        .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt, summary } }) => {
            const tx = transactions[chainId]?.[hash]
            if (!tx) {
                return
            }
            tx.receipt = receipt
            tx.confirmedTime = now()
            if (summary !== undefined) tx.summary = summary
        })
)

export default transactions
