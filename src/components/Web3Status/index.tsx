import { darken, lighten } from 'polished'
import React, { useMemo } from 'react'
import { Activity } from 'react-feather'
import styled from 'styled-components'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../ButtonLegacy'
import Loader from '../Loader'
import WalletModal from '../WalletModal' 
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { OnboardConnectButton } from '../BlockNativeOnboard'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { UnsupportedChainId } from '@gooddollar/web3sdk'

const IconWrapper = styled.div<{ size?: number }>`
    ${({ theme }) => theme.flexColumnNoWrap};
    align-items: center;
    justify-content: center;
    & > * {
        height: ${({ size }) => (size ? size + 'px' : '32px')};
        width: ${({ size }) => (size ? size + 'px' : '32px')};
    }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
    ${({ theme }) => theme.flexRowNoWrap}
    width: 100%;
    align-items: center;
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    cursor: pointer;
    user-select: none;
    :focus {
        outline: none;
    }
`
const Web3StatusError = styled(Web3StatusGeneric)`
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
    color: ${({ theme }) => theme.white};
    font-weight: 500;
    :hover,
    :focus {
        background-color: ${({ theme }) => darken(0.1, theme.red1)};
    }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
    background-color: ${({ theme }) => theme.color.text2};
    border: none;
    border-radius: 6px;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: ${({ theme }) => theme.color.main};
    padding-left: 17px;
    padding-right: 17px;
    height: 42px;
    transition: background 0.25s;

    &:hover,
    &:focus {
        border: none;
        background-color: ${({ theme }) => theme.color.text2hover};
        transition: background 0.25s;
    }
`

const Text = styled.p`
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 1rem;
    width: fit-content;
    font-weight: 500;
`

const NetworkIcon = styled(Activity)`
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
    return b.addedTime - a.addedTime
}

const Web3StatusInnerSC = styled.div`
    background: ${({ theme }) => theme.color.bg1};
    color: ${({ theme }) => theme.color.input}; 
    box-shadow: ${({ theme }) => theme.shadow.settings};
    border-radius: 3px;
`

function Web3StatusInner() {
    const { i18n } = useLingui()
    const { account, error } = useActiveWeb3React()

    const { ENSName } = useENSName(account ?? undefined)

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)

    const hasPendingTransactions = !!pending.length

    const toggleWalletModal = useWalletModalToggle()

    if (account && !error) {
        return (
            <Web3StatusInnerSC
                id="web3-status-connected"
                className="flex items-center px-3 py-2 rounded-lg"
                onClick={toggleWalletModal}
            >
                {hasPendingTransactions ? (
                    <div className="flex items-center justify-between">
                        <div className="pr-2">
                            {pending?.length} {i18n._(t`Pending`)}
                        </div>{' '}
                        <Loader stroke="#173046" />
                    </div>
                ) : (
                    <div className="mr-2">{ENSName || shortenAddress(account)}</div>
                )}
            </Web3StatusInnerSC>
        )
    } else if (error) {
        return (
            <Web3StatusError onClick={toggleWalletModal}>
                <NetworkIcon />
                <Text>
                    {
                    error instanceof UnsupportedChainId
                        ? i18n._(t`You are on the wrong network`)
                        : i18n._(t`Error`)}
                </Text>
            </Web3StatusError>
        )
    } else {
        return (
          <OnboardConnectButton />
        )
    }
}

export default function Web3Status() {
    const { active, account } = useActiveWeb3React()

    const { ENSName } = useENSName(account ?? undefined)

    const allTransactions = useAllTransactions()

    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
    }, [allTransactions])

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
