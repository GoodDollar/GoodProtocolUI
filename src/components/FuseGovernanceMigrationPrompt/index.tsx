import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import Modal from 'components/Modal'
import Title from 'components/gd/Title'
import { ButtonAction } from 'components/gd/Button'
import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import useFuseGovernanceStake from 'hooks/useFuseGovernanceStake'
import { useAppKitAccount } from '@reown/appkit/react'
import { useHistory } from 'react-router-dom'

type Step = 'summary' | 'bridge' | 'success'

const Popover = styled.div`
    margin: 12px 0 20px;
    border: 1px solid ${({ theme }) => theme.color.border2};
    background: ${({ theme }) => theme.color.main};
    color: ${({ theme }) => theme.color.text1};
    border-radius: 10px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`

const ModalContent = styled.div`
    padding: 16px;
    max-width: 520px;

    .actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        flex-wrap: wrap;
    }
`

export default function FuseGovernanceMigrationPrompt() {
    const { i18n } = useLingui()
    const { address } = useAppKitAccount()
    const sendData = useSendAnalyticsData()
    const history = useHistory()
    const { stakeAmount, hasStake, loading, refetch } = useFuseGovernanceStake()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<Step>('summary')
    const [completed, setCompleted] = useState(false)
    const shownRef = useRef<string>()

    const showPrompt = useMemo(() => hasStake && !completed, [hasStake, completed])

    useEffect(() => {
        if (!address) {
            setCompleted(false)
            setIsOpen(false)
            setStep('summary')
            shownRef.current = undefined
        }
    }, [address])

    useEffect(() => {
        if (showPrompt && address && shownRef.current !== address) {
            sendData({ event: 'stake_migration', action: 'prompt_shown', network: 'fuse' })
            shownRef.current = address
        }
    }, [showPrompt, address, sendData])

    useEffect(() => {
        if (isOpen && step !== 'summary' && !loading && !hasStake) {
            setStep('success')
            setCompleted(true)
            sendData({ event: 'stake_migration', action: 'step_success', network: 'fuse' })
        }
    }, [isOpen, step, loading, hasStake, sendData])

    const openModal = useCallback(() => {
        setIsOpen(true)
        setStep('summary')
        sendData({ event: 'stake_migration', action: 'prompt_migrate_click', network: 'fuse' })
    }, [sendData])

    const onDismiss = useCallback(() => {
        setIsOpen(false)
        if (step === 'success') {
            setCompleted(true)
        }
    }, [step])

    const onContinue = useCallback(() => {
        setStep('bridge')
        sendData({ event: 'stake_migration', action: 'step_summary_continue', network: 'fuse' })
    }, [sendData])

    const onOpenBridge = useCallback(() => {
        history.push('/microbridge')
        sendData({ event: 'stake_migration', action: 'step_bridge_open', network: 'fuse' })
    }, [history, sendData])

    const onCheckStatus = useCallback(() => {
        sendData({ event: 'stake_migration', action: 'step_bridge_check', network: 'fuse' })
        refetch()
    }, [refetch, sendData])

    if (!showPrompt && !(isOpen && step === 'success')) {
        return null
    }

    return (
        <>
            {showPrompt && (
                <Popover>
                    <div>
                        {i18n._(
                            t`You still have Governance stake on Fuse. Migrate it to Celo Savings to keep earning.`
                        )}
                    </div>
                    <ButtonAction size="sm" borderRadius="6px" onClick={openModal}>
                        {i18n._(t`Migrate`)}
                    </ButtonAction>
                </Popover>
            )}

            <Modal isOpen={isOpen} onDismiss={onDismiss} showClose>
                <ModalContent>
                    <Title className="mb-2">
                        {step === 'summary'
                            ? i18n._(t`Migrate Fuse stake`)
                            : step === 'bridge'
                            ? i18n._(t`Bridge and verify`)
                            : i18n._(t`Migration complete`)}
                    </Title>

                    {step === 'summary' && (
                        <>
                            <div>
                                {i18n._(
                                    t`You currently have ${stakeAmount.toFixed(
                                        2
                                    )} G$ staked on Fuse Governance. This wizard helps you migrate to Celo Savings.`
                                )}
                            </div>
                            <div className="actions">
                                <ButtonAction size="sm" borderRadius="6px" onClick={onContinue}>
                                    {i18n._(t`Continue`)}
                                </ButtonAction>
                            </div>
                        </>
                    )}

                    {step === 'bridge' && (
                        <>
                            <div>
                                {i18n._(
                                    t`Use the bridge flow to move your funds from Fuse to Celo, then return here and verify your Fuse stake is zero.`
                                )}
                            </div>
                            <div className="actions">
                                <ButtonAction size="sm" borderRadius="6px" onClick={onOpenBridge}>
                                    {i18n._(t`Open Bridge`)}
                                </ButtonAction>
                                <ButtonAction size="sm" borderRadius="6px" onClick={onCheckStatus}>
                                    {loading ? i18n._(t`Checking...`) : i18n._(t`I migrated, check status`)}
                                </ButtonAction>
                            </div>
                        </>
                    )}

                    {step === 'success' && <div>{i18n._(t`Success! Your Fuse governance stake is now zero.`)}</div>}
                </ModalContent>
            </Modal>
        </>
    )
}
