import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import Modal from 'components/Modal'
import Title from 'components/gd/Title'
import { ButtonAction } from 'components/gd/Button'
import { ActionOrSwitchButton } from 'components/gd/Button/ActionOrSwitchButton'
import useSendAnalyticsData from 'hooks/useSendAnalyticsData'
import useStakeMigration, { StakeMigrationPendingError } from 'hooks/useStakeMigration'
import { useAppKitAccount } from '@reown/appkit/react'
import Loader from 'components/Loader'

type Step = 'summary' | 'migrating' | 'success' | 'error'

const PopoverBanner = styled.div`
    margin: 12px 0 20px;
    border: 1px solid ${({ theme }) => theme.color.border2};
    background: ${({ theme }) => theme.color.main};
    border-radius: 10px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`

const PopoverText = styled.p`
    margin: 0;
    flex: 1;
    min-width: 0;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.color.text2};
`

const PopoverCta = styled(ButtonAction)`
    min-width: unset;
    width: auto;
    flex-shrink: 0;
    padding: 0 24px;
    white-space: nowrap;

    @media (max-width: 768px) {
        width: 100%;
    }
`

const ModalContent = styled.div`
    padding: 24px;
    max-width: 520px;

    .body {
        font-size: 14px;
        line-height: 1.5;
        color: ${({ theme }) => theme.color.text2};
    }

    .error {
        color: ${({ theme }) => theme.red1};
        font-size: 14px;
        margin-top: 8px;
    }

    .actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 20px;
    }

    .loader-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
    }
`

const ModalButton = styled(ButtonAction)`
    min-width: unset;
    width: 100%;
`

export default function FuseGovernanceMigrationPrompt() {
    const { i18n } = useLingui()
    const { address } = useAppKitAccount()
    const sendData = useSendAnalyticsData()
    const { stakeAmount, hasStake, stakeLoading, migrating, migrate, refetch, apiConfigured, onFuse } =
        useStakeMigration()
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState<Step>('summary')
    const [errorMessage, setErrorMessage] = useState<string>()
    const [completed, setCompleted] = useState(false)
    const shownRef = useRef<string>()

    const showPrompt = useMemo(() => hasStake && !completed, [hasStake, completed])

    useEffect(() => {
        if (!address) {
            setCompleted(false)
            setIsOpen(false)
            setStep('summary')
            setErrorMessage(undefined)
            shownRef.current = undefined
        }
    }, [address])

    useEffect(() => {
        if (showPrompt && address && shownRef.current !== address) {
            sendData({ event: 'stake_migration', action: 'prompt_shown', network: 'fuse' })
            shownRef.current = address
        }
    }, [showPrompt, address, sendData])

    const openModal = useCallback(() => {
        setIsOpen(true)
        setStep('summary')
        setErrorMessage(undefined)
        sendData({ event: 'stake_migration', action: 'prompt_migrate_click', network: 'fuse' })
    }, [sendData])

    const onDismiss = useCallback(() => {
        if (!migrating) {
            setIsOpen(false)
            if (step === 'success') {
                setCompleted(true)
            }
        }
    }, [migrating, step])

    const onMigrate = useCallback(async () => {
        setErrorMessage(undefined)
        setStep('migrating')
        sendData({ event: 'stake_migration', action: 'migration_start', network: 'fuse' })

        try {
            await migrate()

            sendData({ event: 'stake_migration', action: 'migration_success', network: 'fuse' })
            setStep('success')
            setCompleted(true)
            refetch()
        } catch (e) {
            const message =
                e instanceof StakeMigrationPendingError
                    ? i18n._(t`Migration is already running. Wait about ${e.retryAfter ?? 60} seconds and try again.`)
                    : e instanceof Error
                    ? e.message
                    : i18n._(t`Migration failed. Please try again.`)

            setErrorMessage(message)
            setStep('error')
            sendData({ event: 'stake_migration', action: 'migration_error', network: 'fuse' })
        }
    }, [migrate, sendData, refetch, i18n])

    if (!showPrompt && !(isOpen && (step === 'success' || step === 'error'))) {
        return null
    }

    return (
        <>
            {showPrompt && (
                <PopoverBanner>
                    <PopoverText>
                        {i18n._(
                            t`You still have Governance stake on Fuse. Migrate it to Celo Savings to keep earning.`
                        )}
                    </PopoverText>
                    <PopoverCta size="sm" borderRadius="6px" onClick={openModal}>
                        {i18n._(t`Migrate`)}
                    </PopoverCta>
                </PopoverBanner>
            )}

            <Modal isOpen={isOpen} onDismiss={onDismiss} showClose={!migrating}>
                <ModalContent>
                    <Title className="mb-2">
                        {step === 'success'
                            ? i18n._(t`Migration complete`)
                            : step === 'migrating'
                            ? i18n._(t`Migrating your stake`)
                            : step === 'error'
                            ? i18n._(t`Migration issue`)
                            : i18n._(t`Migrate Fuse stake`)}
                    </Title>

                    {step === 'summary' && (
                        <>
                            <div className="body">
                                {stakeLoading
                                    ? i18n._(t`Loading your Fuse stake...`)
                                    : i18n._(
                                          t`You have ${stakeAmount.toFixed(
                                              2
                                          )} G$ staked on Fuse Governance (sG$). Approve the migration operator to move your stake to Celo Savings. The rest is handled automatically after you sign.`
                                      )}
                            </div>
                            {!apiConfigured && (
                                <div className="error">
                                    {i18n._(t`Migration is not configured for this environment.`)}
                                </div>
                            )}
                            <div className="actions">
                                <ActionOrSwitchButton
                                    requireChain="FUSE"
                                    ButtonEl={ModalButton}
                                    size="sm"
                                    borderRadius="6px"
                                    onClick={onMigrate}
                                    disabled={!apiConfigured || stakeLoading || migrating}
                                >
                                    {i18n._(t`Approve and migrate`)}
                                </ActionOrSwitchButton>
                            </div>
                        </>
                    )}

                    {step === 'migrating' && (
                        <div className="loader-row">
                            <Loader />
                            <div className="body">
                                {onFuse
                                    ? i18n._(
                                          t`Approve sG$ on Fuse, then completing bridge and Celo Savings stake. This can take several minutes.`
                                      )
                                    : i18n._(t`Switch to Fuse and submit your approval...`)}
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <>
                            <div className="body">
                                {i18n._(
                                    t`We could not finish migrating your Fuse stake. If you already approved, wait a minute and try again.`
                                )}
                            </div>
                            {errorMessage && <div className="error">{errorMessage}</div>}
                            <div className="actions">
                                <ActionOrSwitchButton
                                    requireChain="FUSE"
                                    ButtonEl={ModalButton}
                                    size="sm"
                                    borderRadius="6px"
                                    onClick={onMigrate}
                                    disabled={migrating}
                                >
                                    {i18n._(t`Try again`)}
                                </ActionOrSwitchButton>
                            </div>
                        </>
                    )}

                    {step === 'success' && (
                        <>
                            <div className="body">
                                {i18n._(
                                    t`Your Fuse governance stake was migrated to Celo Savings. It may take a moment for balances to update.`
                                )}
                            </div>
                            <div className="actions">
                                <ModalButton size="sm" borderRadius="6px" onClick={onDismiss}>
                                    {i18n._(t`Done`)}
                                </ModalButton>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
