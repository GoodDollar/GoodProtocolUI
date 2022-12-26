import React, { FC, useCallback } from 'react'
import { QuestionHelper } from 'components'
import Title from 'components/gd/Title'
import { LoadingPlaceHolder } from 'theme/components'
import { CellSC } from '../styled'

import { SavingsStats, useSavingsStats } from '@gooddollar/web3sdk-v2'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ModalButton } from 'components/Savings/SavingsModal/ModalButton'

import type { HeadingCopy } from 'components/Savings/SavingsCard'
import { NETWORK_LABEL } from 'constants/networks'
import { ChainId } from '@sushiswap/sdk'

interface SavingsDepositMobileProps {
    headings: HeadingCopy
    requiredChain: ChainId
    showModal: (chain: ChainId) => void
}

interface SavingsMobileStatProps {
    stats?: SavingsStats
    statsKey: string
    requiredChain: ChainId
}

const SavingsMobileStat: FC<SavingsMobileStatProps> = ({ stats, statsKey, requiredChain }) => {
    const { i18n } = useLingui()

    if (!stats) {
        return null
    }

    switch (statsKey) {
        case 'token':
            return <div>{i18n._(t`G$`)}</div>
        case 'protocol':
            return <div>{i18n._(t`GoodDollar`)}</div>
        case 'network':
            return <>{NETWORK_LABEL[requiredChain]}</>
        case 'apy':
            return <div>{stats?.apy?.toFixed(0)} %</div>
        case 'totalStaked':
            return (
                <>
                    {stats?.totalStaked?.format({
                        useFixedPrecision: true,
                        fixedPrecisionDigits: 2,
                    })}
                </>
            )
        case 'totalRewardsPaid':
            return <>{stats?.totalRewardsPaid?.format()} </>
        default:
            return null
    }
}

export const SavingsDepositMobile: FC<SavingsDepositMobileProps> = ({ headings, requiredChain, showModal }) => {
    const { stats, error } = useSavingsStats(10)
    const { i18n } = useLingui()

    const onModalButtonPress = useCallback(() => showModal(requiredChain), [requiredChain, showModal])

    return (
        <CellSC>
            {headings.map(
                (item, index) =>
                    index !== 0 && ( // skip token header on mobile
                        <div key={index}>
                            <div key={index} className="flex flex-grow-1">
                                <Title type="category" className="flex items-center title">
                                    {item.title} <QuestionHelper text={item.questionText || ''} />
                                </Title>
                            </div>
                            <div className="font-bold value">
                                {error ? (
                                    <LoadingPlaceHolder />
                                ) : (
                                    <SavingsMobileStat
                                        statsKey={item.statsKey}
                                        stats={stats}
                                        requiredChain={requiredChain}
                                    />
                                )}
                            </div>
                        </div>
                    )
            )}
            <div className="savingdeposit">
                <ModalButton
                    type={'deposit'}
                    title={i18n._(t`Deposit G$`)}
                    chain={requiredChain}
                    toggleModal={onModalButtonPress}
                />
            </div>
        </CellSC>
    )
}
