/***
 * Button to request network switch if not on correct network, or perform an action if on correct network
 */
import React from 'react'
import { useActiveWeb3React } from 'hooks/useActiveWeb3React'
import { ButtonAction } from './index'
import { useLingui } from '@lingui/react'
import { NETWORK_LABELS } from 'sdk/constants/chains'
import { useNetworkModalToggle } from 'state/application/hooks'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ActionOrSwitchButton = ({ requireChainId, children, ButtonEl = ButtonAction, ...props }: {
    width?: string
    borderRadius?: string
    error?: boolean
    size?: 'default' | 'sm'
    noShadow?: boolean
    requireChainId: number,
    children: any,
    onClick?: any,
    ButtonEl?: any
}) => {
    const toggleNetworkModal = useNetworkModalToggle()
    const { i18n } = useLingui()
    const { chainId, account } = useActiveWeb3React()
    // useEffect(() => { }, [chainId, account])
    if (chainId === requireChainId)
        return <ButtonEl {...props} >{children}</ButtonEl >

    return <ButtonEl {...props} width={'100%'} onClick={toggleNetworkModal}>{i18n._(`Switch network to {network}`, { network: NETWORK_LABELS[requireChainId] })}</ButtonEl >

}
