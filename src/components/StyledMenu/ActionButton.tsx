// @flow
import React from 'react'
import { SvgXml } from '@gooddollar/good-design'
import { NavLink } from 'components/Link'

import Donate from 'assets/svg/donate.svg'
import Claim from 'assets/svg/claim.svg'
import Swap from 'assets/svg/swap.svg'
import Dapplib from 'assets/svg/library.svg'

const actionIcons = {
    donate: {
        route: '/donate',
        icon: Donate,
        width: 40,
        height: 40,
    },
    claim: {
        route: '/claim',
        icon: Claim,
        width: 30,
        height: 40,
    },
    swap: {
        route: '/swap',
        icon: Swap,
        width: 30,
        height: 40,
    },
    dapplib: {
        icon: Dapplib,
        width: 70,
        height: 40,
        route: '/dapp',
    },
}

type ActionButtonProps = {
    action: string
}

export const ActionButton = ({ action }: ActionButtonProps) => {
    const { width, height, icon, route } = actionIcons[action]

    return (
        <NavLink to={route} isNavBar>
            <SvgXml width={width} height={height} src={icon} />
        </NavLink>
    )
}
