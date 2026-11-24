import React from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Modal from 'components/Modal'
import Title from 'components/gd/Title'
import { ButtonAction } from 'components/gd/Button'

interface ReserveLimitModalProps {
    chainId?: number
    otherChainId?: number
    showCeloDexRoutes: boolean
    onClose: () => void
}

export default function ReserveLimitModal({
    chainId,
    otherChainId,
    showCeloDexRoutes,
    onClose,
}: ReserveLimitModalProps) {
    const { i18n } = useLingui()
    const chain = chainId === 42220 ? 'Celo' : chainId === 50 ? 'XDC' : i18n._(t`this network`)
    const otherChain =
        otherChainId !== chainId && (otherChainId === 42220 ? 'Celo' : otherChainId === 50 ? 'XDC' : undefined)

    return (
        <Modal isOpen={chainId !== undefined} onDismiss={onClose} showClose>
            <div className="space-y-4 p-4">
                <Title type="popup" as="h2">
                    {i18n._(t`Reserve swap limit reached`)}
                </Title>
                <p>{i18n._(t`This swap exceeds the Reserve’s current trading allowance on ${chain}.`)}</p>
                <p>
                    {otherChain
                        ? i18n._(t`You can try swapping with the Reserve on ${otherChain}.`)
                        : i18n._(t`You may be able to swap with the Reserve on another supported network.`)}
                </p>
                <p>
                    {i18n._(
                        t`Switching networks does not move your funds. Bridging may be needed to use another network.`
                    )}
                </p>
                {otherChain && <p>{i18n._(t`The Reserve may use a different token on that network.`)}</p>}
                {showCeloDexRoutes && (
                    <>
                        <p>{i18n._(t`You can also check Uniswap or Ubeswap on Celo for another swap route.`)}</p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                className="underline"
                                href="https://app.uniswap.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {i18n._(t`Check Uniswap (Celo)`)}
                            </a>
                            <a
                                className="underline"
                                href="https://app.ubeswap.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {i18n._(t`Check Ubeswap (Celo)`)}
                            </a>
                        </div>
                        <p>
                            {i18n._(
                                t`Check liquidity, price impact and minimum received before swapping. A route may not be available, and returns can differ.`
                            )}
                        </p>
                    </>
                )}
                <ButtonAction onClick={onClose}>{i18n._(t`Close`)}</ButtonAction>
            </div>
        </Modal>
    )
}
