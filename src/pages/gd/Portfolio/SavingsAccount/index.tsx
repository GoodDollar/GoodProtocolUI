import React, { useEffect, useState } from 'react'
import { SavingsSDK, useGetEnvChainId, useReadOnlyProvider } from '@gooddollar/web3sdk-v2'
import { SavingsCard } from 'components/Savings/SavingsCard'
import { useLingui } from '@lingui/react'
import { PortfolioTitleSC } from '../styled'

export const SavingsAccount = ({ account }: { account: string | null | undefined }): JSX.Element => {
    const [hasBalance, setHasBalance] = useState<boolean | undefined>(true)
    const { i18n } = useLingui()
    const { chainId, defaultEnv } = useGetEnvChainId()
    const provider = useReadOnlyProvider(chainId)

    useEffect(() => {
        if (account && provider) {
            const sdk = new SavingsSDK(provider, defaultEnv)

            sdk.hasBalance(account).then((res) => {
                setHasBalance(res)
            })
        }
    }, [account, setHasBalance, defaultEnv, provider])

    return (
        <>
            <PortfolioTitleSC className="mt-4 mb-3 md:pl-2">{i18n._(`Savings`)}</PortfolioTitleSC>
            {account && <SavingsCard account={account} hasBalance={hasBalance} />}
        </>
    )
}
