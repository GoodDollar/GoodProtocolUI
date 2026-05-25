import React, { useEffect, useMemo, useState } from 'react'
import useENSName from '../../hooks/useENSName'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import Loader from '../Loader'
import WalletModal from '../WalletModal'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'
import { Text, HStack } from 'native-base'
import { useNativeBalance } from '@gooddollar/web3sdk-v2'
import { Currency } from '@sushiswap/sdk'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useEthers } from '@usedapp/core'
import { Spinner } from 'native-base'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
}

function Web3StatusInner() {
    const { i18n } = useLingui()
    const sendData = useSendAnalyticsData()
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { library } = useEthers() as any

    const { ENSName } = useENSName(address ?? undefined)

    const allTransactions = useAllTransactions()
    const nativeBalance = useNativeBalance()
    const [directNativeBalance, setDirectNativeBalance] = useState<string | undefined>()
    const [showBalance, setShowBalance] = useState(false)

    // added a timed-out fallback for when native-balance does not seem to complete (happening on mainnet)
    // it uses a timeout to avoid mis-formatted amounts based on old-chain decimals.
    useEffect(() => {
        let cancelled = false
        setShowBalance(false)
        setDirectNativeBalance(undefined)
        const timeoutId = window.setTimeout(() => {
            if (!cancelled) {
                setShowBalance(true)
            }
        }, 500)

        async function readBalance() {
            if (!address || !library?.getBalance) {
                return
            }

            try {
                const balance = await library.getBalance(address)
                if (!cancelled) {
                    setDirectNativeBalance(balance.toString())
                }
            } catch {
                if (!cancelled) {
                    setDirectNativeBalance(undefined)
                }
            }
        }

        void readBalance()

        return () => {
            cancelled = true
            window.clearTimeout(timeoutId)
        }
    }, [address, library, /*used*/ chainId])

    const displayNativeBalance = nativeBalance ?? directNativeBalance
    const shouldShowBalance = showBalance && !!displayNativeBalance

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

    const hasPendingTransactions = !!pending.length

    const onAccountClick = () => {
        sendData({ event: 'goto_page', action: 'goto_address' })
    }

    return (
        <HStack space={8} flexDirection="row">
            {address && (
                <div className="flex flex-row gap-4">
                    {shouldShowBalance ? (
                        <Text fontSize="sm" fontFamily="subheading" fontWeight="normal" color="gdPrimary">
                            {parseFloat(displayNativeBalance!).toFixed(4)}{' '}
                            {Currency.getNativeCurrencySymbol(+(chainId ?? 1))}
                        </Text>
                    ) : (
                        <Spinner size="sm" color="gdPrimary" />
                    )}
                    {hasPendingTransactions ? (
                        <div className="flex items-center justify-between">
                            <div className="pr-2">
                                {pending?.length} {i18n._(t`Pending`)}
                            </div>{' '}
                            <Loader stroke="#173046" />
                        </div>
                    ) : (
                        <div className="mr-2" onClick={onAccountClick}>
                            {ENSName || shortenAddress(address)}
                        </div>
                    )}
                </div>
            )}
        </HStack>
    )
}

export default function Web3Status(): JSX.Element {
    const { address } = useAppKitAccount()

    const { ENSName } = useENSName(address ?? undefined)

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions, address])

    const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
    const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

    return (
        <>
            <Web3StatusInner />
            <WalletModal
                ENSName={ENSName ?? undefined}
                pendingTransactions={pending}
                confirmedTransactions={confirmed}
            />
        </>
    )
}
