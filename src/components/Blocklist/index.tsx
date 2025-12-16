import React, { ReactNode, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { BLOCKED_ADDRESSES } from '../../constants'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export default function Blocklist({ children }: { children: ReactNode }) {
    const { i18n } = useLingui()
    const { address } = useAccount()
    const blocked: boolean = useMemo(
        () => Boolean(address && BLOCKED_ADDRESSES.includes(address.toLowerCase())),
        [address]
    )
    if (blocked) {
        return <div>{i18n._(t`Blocked address`)}</div>
    }
    return <>{children}</>
}
