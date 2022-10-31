import React, { useEffect, useCallback } from 'react'
import { useStakerInfo, SupportedV2Networks } from '@gooddollar/web3sdk-v2'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import { ActionOrSwitchButton } from 'components/gd/Button/ActionOrSwitchButton'
import { ModalType } from 'components/Savings/SavingsModal'
import { LoadingPlaceHolder } from 'theme/components'
import sendGa from 'functions/sendGa'

export const SavingsCardRow = ({
    account,
    requiredChain,
    toggleModal,
}: {
    account: string
    requiredChain: number
    toggleModal: (type?: ModalType) => void
}): JSX.Element => {
    const { i18n } = useLingui()
    const { stats, error } = useStakerInfo(requiredChain, 10, account)

    useEffect(() => {
        if (error) {
            console.error('Unable to fetch staker info:', { error })
        }
    }, [error])

    const toggleSavingsModal = useCallback(
        (type: ModalType) => {
            sendGa({ event: 'savings', action: 'start' + type })
            toggleModal(type)
        },
        [toggleModal]
    )

    return (
        <tr>
            <td>{i18n._(t`Savings`)}</td>
            <td>{i18n._(t`G$`)}</td>
            <td>{i18n._(t`GoodDAO`)}</td>
            <td>
                <div className="flex flex-col segment">
                    {stats?.principle ? (
                        <>{stats.principle.format({ useFixedPrecision: true, fixedPrecisionDigits: 2 })}</>
                    ) : (
                        <LoadingPlaceHolder />
                    )}
                </div>
            </td>
            <td>
                <div className="flex flex-col segment">
                    {stats?.claimable ? (
                        <>
                            <div>{stats.claimable.g$Reward.format()}</div>
                            <div>{stats.claimable.goodReward.format()}</div>
                        </>
                    ) : (
                        <div className="flex flex-col">
                            <div style={{ width: '200px', marginBottom: '10px' }} className="flex flex-row">
                                <LoadingPlaceHolder />
                            </div>
                            <div style={{ width: '200px' }}>
                                <LoadingPlaceHolder />
                            </div>
                        </div>
                    )}
                </div>
            </td>
            {/* <td>
        <div className="flex flex-col segment">
            <div>{stats?.rewardsPaid.g$Minted.toFixed(2, {groupSeparator: ','})} G$</div> // will maybe added later
            <div>{stats?.rewardsPaid.goodMinted.toFixed(2, {groupSeparator: ','})} GOOD</div>
        </div>
      </td> */}
            <td className="flex content-center justify-center">
                <div className="flex items-end justify-center md:flex-col segment withdraw-buttons">
                    <div className="h-full withdraw-button md:h-auto">
                        <ActionOrSwitchButton
                            width="130px"
                            size="sm"
                            borderRadius="6px"
                            requireChain={SupportedV2Networks[requiredChain] as keyof typeof SupportedV2Networks}
                            noShadow={true}
                            onClick={() => toggleSavingsModal('withdraw')}
                        >
                            {' '}
                            {i18n._(t`Withdraw G$`)}{' '}
                        </ActionOrSwitchButton>
                        <div className={'mb-1'}></div>
                        <ActionOrSwitchButton
                            width="130px"
                            size="sm"
                            noShadow={true}
                            borderRadius="6px"
                            requireChain={SupportedV2Networks[requiredChain] as keyof typeof SupportedV2Networks}
                            onClick={() => toggleSavingsModal('claim')}
                        >
                            {' '}
                            {i18n._(t`Claim Rewards`)}{' '}
                        </ActionOrSwitchButton>
                    </div>
                </div>
            </td>
        </tr>
    )
}
