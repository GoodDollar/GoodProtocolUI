import React, { useCallback, useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useSwitchNetwork } from '@gooddollar/web3sdk-v2'
import { Text, Link } from 'native-base'
import { SwitchChainModal } from '@gooddollar/good-design'
import { ChainId } from '@sushiswap/sdk'
import { UnsupportedChainId } from '@gooddollar/web3sdk'
import Modal from '../Modal'
import ModalHeader from '../ModalHeader'
import Option from '../WalletModal/Option'
import styled from 'styled-components'
import { AdditionalChainId } from '../../constants'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { NETWORK_ICON, NETWORK_LABEL } from '../../constants/networks'
import { useModalOpen, useNetworkModalToggle, useSelectedChain } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/types'

import useSendAnalyticsData from '../../hooks/useSendAnalyticsData'
import { getEnv } from 'utils/env'

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

const ChainOption = ({ chainId, chain, toggleNetworkModal, switchChain, labels, icons, error }: any) => {
    const onOptionClick = useCallback(() => {
        toggleNetworkModal()
        switchChain(chain)
    }, [switchChain, toggleNetworkModal, chain])

    const isUnsupported = error instanceof UnsupportedChainId

    return (
        <Option
            clickable={isUnsupported || chainId !== chain}
            active={chainId === chain && !isUnsupported}
            header={labels[chain]}
            subheader={null}
            icon={icons[chain]}
            id={String(chain)}
            onClick={onOptionClick}
        />
    )
}

export default function NetworkModal(): JSX.Element | null {
    const { i18n } = useLingui()
    const { setSelectedChain } = useSelectedChain()
    const { chainId, error, active } = useActiveWeb3React()
    const sendData = useSendAnalyticsData()
    const { switchNetwork } = useSwitchNetwork()
    const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
    const toggleNetworkModal = useNetworkModalToggle()
    const [toAddNetwork, setToAddNetwork] = useState<ChainId | AdditionalChainId | undefined>()

    const networkLabel: string | null = error ? null : (NETWORK_LABEL as any)[chainId]
    const network = getEnv()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const prodNetworks = [AdditionalChainId.CELO, ChainId.MAINNET, AdditionalChainId.FUSE]

    const allowedNetworks = useMemo(() => {
        switch (true) {
            case network === 'staging':
            case network === 'fuse':
                return [AdditionalChainId.CELO, AdditionalChainId.FUSE]
            default:
                return prodNetworks
        }
    }, [network, prodNetworks])

    const closeNetworkModal = useCallback(() => {
        setToAddNetwork(undefined)
        toggleNetworkModal()
    }, [toggleNetworkModal])

    const switchChain = useCallback(
        async (chain: ChainId | AdditionalChainId) => {
            try {
                if (active) await switchNetwork(chain)
                else setSelectedChain(chain) // only change chain to trigger onboard re-init if not already connected
            } catch (e: any) {
                if (e.code === 4902) {
                    setToAddNetwork(chain)
                    toggleNetworkModal()
                    return
                }
            }
            sendData({
                event: 'network_switch',
                action: 'network_switch_success',
                network: ChainId[chain],
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [switchNetwork, sendData]
    )

    return (
        <SwitchChainModal>
            <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
                {toAddNetwork ? (
                    <>
                        <ModalHeader className="mb-1" onClose={closeNetworkModal} title="Add network" />
                        <Text display="flex" flexDir="column">
                            {i18n._(
                                t`We see you don't have ${
                                    (NETWORK_LABEL as any)[toAddNetwork]
                                } added to your wallet. Kindly add the network, and try again.`
                            )}
                            <Link
                                color="main"
                                href="https://www.notion.so/gooddollar/How-to-Manually-Add-Networks-to-Your-Web3-Wallet-02cf2088a64240c3a7286616fb3e3113"
                            >
                                Learn more here.
                            </Link>
                        </Text>
                    </>
                ) : (
                    <>
                        <ModalHeader className="mb-1" onClose={toggleNetworkModal} title="Select network" />
                        <TextWrapper>
                            {i18n._(t`You are currently browsing`)} <span className="site">GOOD DOLLAR</span>
                            {networkLabel && (
                                <>
                                    {` `}
                                    {i18n._(t`on the`)} <span className="network">{networkLabel}</span>{' '}
                                    {i18n._(t`network`)}
                                </>
                            )}
                        </TextWrapper>

                        <div className="flex flex-col mt-3 space-y-5 overflow-y-auto">
                            {allowedNetworks.map((chain: ChainId | AdditionalChainId) => (
                                <ChainOption
                                    key={chain}
                                    chainId={chainId}
                                    chain={chain}
                                    labels={NETWORK_LABEL}
                                    icons={NETWORK_ICON}
                                    toggleNetworkModal={toggleNetworkModal}
                                    switchChain={switchChain}
                                    error={error}
                                />
                            ))}
                        </div>
                    </>
                )}
            </Modal>
            <Modal isOpen={networkModalOpen} onDismiss={toggleNetworkModal}>
                {toAddNetwork ? (
                    <>
                        <ModalHeader className="mb-1" onClose={closeNetworkModal} title="Add network" />
                        <Text display="flex" flexDir="column">
                            {i18n._(
                                t`We see you don't have ${
                                    (NETWORK_LABEL as any)[toAddNetwork]
                                } added to your wallet. Kindly add the network, and try again.`
                            )}
                            <Link
                                color="main"
                                href="https://www.notion.so/gooddollar/How-to-Manually-Add-Networks-to-Your-Web3-Wallet-02cf2088a64240c3a7286616fb3e3113"
                            >
                                Learn more here.
                            </Link>
                        </Text>
                    </>
                ) : (
                    <>
                        <ModalHeader className="mb-1" onClose={toggleNetworkModal} title="Select network" />
                        <TextWrapper>
                            {i18n._(t`You are currently browsing`)} <span className="site">GOOD DOLLAR</span>
                            {networkLabel && (
                                <>
                                    {` `}
                                    {i18n._(t`on the`)} <span className="network">{networkLabel}</span>{' '}
                                    {i18n._(t`network`)}
                                </>
                            )}
                        </TextWrapper>

                        <div className="flex flex-col mt-3 space-y-5 overflow-y-auto">
                            {allowedNetworks.map((chain: ChainId | AdditionalChainId) => (
                                <ChainOption
                                    key={chain}
                                    chainId={chainId}
                                    chain={chain}
                                    labels={NETWORK_LABEL}
                                    icons={NETWORK_ICON}
                                    toggleNetworkModal={toggleNetworkModal}
                                    switchChain={switchChain}
                                    error={error}
                                />
                            ))}
                        </div>
                    </>
                )}
            </Modal>
        </SwitchChainModal>
    )
}
