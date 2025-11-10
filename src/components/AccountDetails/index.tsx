import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useAppKit } from '@reown/appkit/react'
import { useRedirectNotice } from '@gooddollar/good-design'
import { isMiniPay } from 'utils/minipay'

import { ReactComponent as Close } from '../../assets/images/x.svg'
import { WalletLabels } from '../../constants/wallets'
import { AppDispatch } from '../../state'
import { clearAllTransactions } from '../../state/transactions/actions'
import { ExternalLink } from 'theme'
import { getExplorerLink, shortenAddress } from '../../utils'
import { getSafeChainId } from 'utils/chain'
import { useConnectionInfo } from 'hooks/useConnectionInfo'
import { ButtonOutlined } from '../gd/Button'
import Title from '../gd/Title'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'

import { getEnv } from 'utils/env'
import { useDisconnect } from 'wagmi'

const UpperSection = styled.div`
    position: relative;

    h5 {
        margin: 0;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        font-weight: 400;
    }

    h5:last-child {
        margin-bottom: 0px;
    }

    h4 {
        margin-top: 0;
        font-weight: 500;
    }
`

const InfoCard = styled.div`
    // padding: 1rem;
    // border: 1px solid ${({ theme }) => theme.bg3};
    // border-radius: 10px;
    position: relative;
    display: grid;
    margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
    ${({ theme }) => theme.flexRowNoWrap};
    justify-content: space-between;
    align-items: center;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: ${({ theme }) => theme.color.text1};

    div {
        ${({ theme }) => theme.flexRowNoWrap}
        align-items: center;
    }

    @media screen and (max-width: 384px) {
        flex-direction: column;
    }
`

const AccountSection = styled.div`
    // background-color: ${({ theme }) => theme.bg1};
    padding: 0rem 1rem;
    ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
    h5 {
        margin: 0 0 1rem 0;
        font-weight: 400;
    }

    h4 {
        margin: 0;
        font-weight: 500;
    }
`

const LowerSection = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap}
    padding: 1.5rem 1rem;
    flex-grow: 1;
    overflow: auto;
    // background-color: ${({ theme }) => theme.bg2};
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: ${({ theme }) => theme.color.text1};

    h5 {
        margin: 0;
        font-weight: 400;
        color: ${({ theme }) => theme.text3};
    }

    @media screen and (max-width: 384px) {
        padding-top: 0.5rem;
    }
`

const AccountControl = styled.div`
    display: flex;
    justify-content: space-between;
    min-width: 0;
    width: 100%;

    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 28px;
    color: ${({ theme }) => theme.color.text7};

    a {
        margin-left: 1rem;
        display: flex;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        text-decoration-line: underline;
        color: ${({ theme }) => theme.color.text2};
    }

    p {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media screen and (max-width: 384px) {
        justify-content: center;
    }

    span {
        @media screen and (max-width: 384px) {
            width: 120px;
        }
    }
`

const CloseIcon = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    &:hover {
        cursor: pointer;
        opacity: 0.6;
    }
`

const CloseColor = styled(Close)`
    path {
        fill: ${({ theme }) => theme.color.text8};
    }
`

const TransactionListWrapper = styled.div`
    ${({ theme }) => theme.flexColumnNoWrap};
`

const WalletAction = styled(ButtonOutlined)`
    &:hover {
        opacity: 0.6;
    }
`

function renderTransactions(transactions: string[]) {
    return (
        <TransactionListWrapper>
            {transactions.map((hash, i) => {
                return <Transaction key={i} hash={hash} />
            })}
        </TransactionListWrapper>
    )
}

interface AccountDetailsProps {
    toggleWalletModal: () => void
    pendingTransactions: string[]
    confirmedTransactions: string[]
    ENSName?: string
    openOptions: () => void
}

export default function AccountDetails({
    toggleWalletModal,
    pendingTransactions,
    confirmedTransactions,
    ENSName,
}: AccountDetailsProps): any {
    const { i18n } = useLingui()
    const dispatch = useDispatch<AppDispatch>()
    const network = getEnv()

    const { address, chainId, walletInfo } = useConnectionInfo()

    const { open } = useAppKit()
    const { disconnect } = useDisconnect()

    // Connection management handled by AppKit modal and wagmi disconnect
    const sendData = useSendAnalyticsData()
    const { goToExternal } = useRedirectNotice()

    // walletInfo provided by useConnectionInfo

    const miniPay = React.useMemo(() => isMiniPay(), [])

    function formatConnectorName() {
        const name = miniPay ? 'MiniPay' : walletInfo?.name ?? ''
        return `${i18n._(t`Connected with`)} ${name}`
    }

    const changeWallet = useCallback(async () => {
        toggleWalletModal()
        await open({ view: 'Connect' })
    }, [toggleWalletModal, open])

    const disconnectWallet = useCallback(() => {
        toggleWalletModal()
        sendData({ event: 'account', action: 'address_disconnect_success', network: network })
        disconnect()
        void open({ view: 'Connect' })
    }, [toggleWalletModal, disconnect, open, network, sendData])

    const clearAllTransactionsCallback = useCallback(() => {
        if (chainId) dispatch(clearAllTransactions({ chainId: getSafeChainId(chainId) }))
    }, [dispatch, chainId])

    const goToExplorer = (e: any, url: string) => {
        toggleWalletModal()
        goToExternal(e, url)
    }

    return (
        <>
            <UpperSection>
                <CloseIcon onClick={toggleWalletModal}>
                    <CloseColor />
                </CloseIcon>

                <Title className="mb-8 text-center">{i18n._(t`Account`)}</Title>
                <AccountSection>
                    <YourAccount>
                        <InfoCard>
                            <AccountGroupingRow>
                                {formatConnectorName()}
                                <div className="mt-3.5 mb-3.5">
                                    {(walletInfo?.name || isMiniPay()) &&
                                        WalletLabels.includes(isMiniPay() ? 'MiniPay' : walletInfo?.name ?? '') && (
                                            <WalletAction
                                                width={'85px'}
                                                size="sm"
                                                style={{ marginRight: '5px' }}
                                                onClick={disconnectWallet}
                                            >
                                                {i18n._(t`Disconnect`)}
                                            </WalletAction>
                                        )}
                                    <WalletAction
                                        width={'75px'}
                                        size="sm"
                                        style={{ marginRight: '-5px' }}
                                        onClick={walletInfo?.label === 'MetaMask' ? disconnectWallet : changeWallet}
                                    >
                                        {i18n._(t`Change`)}
                                    </WalletAction>
                                </div>
                            </AccountGroupingRow>
                            <AccountGroupingRow id="web3-account-identifier-row">
                                <AccountControl>
                                    <div className="justify-center text-center">
                                        <p> {ENSName ?? shortenAddress(address ?? '')}</p>
                                    </div>
                                </AccountControl>
                            </AccountGroupingRow>
                            <AccountGroupingRow className="mt-4">
                                <AccountControl>
                                    <div>
                                        {address && (
                                            <Copy toCopy={address}>
                                                <span style={{ marginLeft: '4px' }}>{i18n._(t`Copy address`)}</span>
                                            </Copy>
                                        )}
                                        {chainId && address && (
                                            <ExternalLink
                                                url={getExplorerLink(getSafeChainId(chainId), address, 'address')}
                                                label={i18n._(t`View on explorer`)}
                                                dataAttr="external_explorer"
                                                onPress={goToExplorer}
                                            />
                                        )}
                                    </div>
                                </AccountControl>
                            </AccountGroupingRow>
                        </InfoCard>
                    </YourAccount>
                </AccountSection>
            </UpperSection>
            {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                <LowerSection>
                    <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
                        <Title type="category">{i18n._(t`Recent Transactions`)}</Title>
                        <ButtonOutlined className="px-2" size="sm" width="auto" onClick={clearAllTransactionsCallback}>
                            {i18n._(t`Clear all`)}
                        </ButtonOutlined>
                    </AutoRow>
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                </LowerSection>
            ) : (
                <LowerSection>{i18n._(t`Your transactions will appear here...`)}</LowerSection>
            )}
        </>
    )
}
