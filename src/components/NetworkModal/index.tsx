import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/types'
import { ChainId } from '@sushiswap/sdk'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import React, { useCallback, useMemo, useState } from 'react'
import Option from '../WalletModal/Option'
import styled from 'styled-components'
import { AdditionalChainId, ChainIdHex } from '../../constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSetChain } from '@web3-onboard/react'

import { getNetworkEnv, UnsupportedChainId } from '@gooddollar/web3sdk'
import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'
import { useUpdateEffect } from '@gooddollar/web3sdk-v2'

const TextWrapper = styled.div`
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.color.text1};

    .site {
        font-weight: 700;
        color: ${({ theme }) => theme.color.text2};
    }

    .network {
        font-weight: 700;
        color: ${({ theme }) => theme.color.switch};
    }
`

const ChainOption = ({ chainId, key, toggleNetworkModal, switchChain, labels, icons }: any) => {
    const onOptionClick = useCallback(() => {
        toggleNetworkModal()
        switchChain(key)
    }, [switchChain, toggleNetworkModal, key])

    return (
        <Option
            clickable={chainId !== key}
            active={chainId === key}
            header={labels[key]}
            subheader={null}
            icon={icons[key]}
            id={String(key)}
            key={key}
            onClick={onOptionClick}
        />
    )
}

export default function NetworkModal(): JSX.Element | null {
    const { i18n } = useLingui()
    const { chainId, error } = useActiveWeb3React()
    const sendData = useSendAnalyticsData()

    const [{ connectedChain }, setChain] = useSetChain()
    const [currentChain, setCurrentChain] = useState<number>(chainId)
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()

    const networkLabel: string | null = error ? null : (NETWORK_LABEL as any)[chainId]
    const network = getNetworkEnv()

    const allowedNetworks = useMemo(() => {
        switch (true) {
            case network === 'production' && !error:
                return [ChainId.MAINNET, AdditionalChainId.FUSE]

            case network === 'production' && error instanceof UnsupportedChainId:
                return [ChainId.MAINNET]

            case network === 'staging' && !error:
                return [AdditionalChainId.FUSE, AdditionalChainId.CELO]

            default:
                return [AdditionalChainId.FUSE, ChainId.MAINNET, AdditionalChainId.CELO]
        }
    }, [error, network])

    const switchChain = useCallback(
        (key: ChainId | AdditionalChainId) => {
            if ([ChainId.MAINNET, ChainId.RINKEBY, ChainId.GÖRLI].includes(key as any)) {
                void setChain({ chainId: `0x${key.toString(16)}` })
            } else {
                void setChain({ chainId: ChainIdHex[key] })
            }
        },
        [setChain]
    )

    useUpdateEffect(() => {
        const newChain = ChainIdHex[connectedChain?.id as keyof typeof ChainIdHex]
        if (newChain && currentChain !== newChain) {
            sendData({ event: 'network_switch', action: 'network_switch_success', network: ChainId[chainId] })
            setCurrentChain(chainId)
        }
    }, [connectedChain])

    return (
        <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
            <ModalHeader className="mb-1" onClose={toggleNetworkModal} title="Select network" />
            <TextWrapper>
                {i18n._(t`You are currently browsing`)} <span className="site">GOOD DOLLAR</span>
                <br />{' '}
                {networkLabel && (
                    <>
                        {i18n._(t`on the`)} <span className="network">{networkLabel}</span> {i18n._(t`network`)}
                    </>
                )}
            </TextWrapper>

            <div className="flex flex-col mt-3 space-y-5 overflow-y-auto">
                {allowedNetworks.map((key: ChainId | AdditionalChainId) => (
                    <ChainOption
                        key={key}
                        chainId={chainId}
                        labels={NETWORK_LABEL}
                        icons={NETWORK_ICON}
                        toggleNetworkModal={toggleNetworkModal}
                        switchChain={switchChain}
                    />
                ))}
            </div>
        </Modal>
    )
}
