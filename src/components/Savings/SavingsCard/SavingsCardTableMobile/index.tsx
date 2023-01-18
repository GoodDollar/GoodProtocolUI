import React, { useEffect, useState } from 'react'
import { useStakerInfo, useGetEnvChainId, useReadOnlyProvider } from '@gooddollar/web3sdk-v2'

import Card from 'components/gd/Card'
import { ModalType } from 'components/Savings/SavingsModal'

import type { HeadingCopy } from '..'
import { ChainId } from '@sushiswap/sdk'
import { hasSavingsBalance } from 'functions'
import { SavingsCellsMobile } from './SavingsCellsMobile'

export const SavingsCardTableMobile = ({
    account,
    requiredChain,
    headings,
    toggleModal,
}: {
    account: string
    requiredChain: ChainId
    headings: HeadingCopy
    toggleModal: (type?: ModalType) => void
}): JSX.Element => {
    const { stats, error } = useStakerInfo(requiredChain, 10, account)
    const [hasBalance, setHasBalance] = useState<boolean | undefined>(false)
    const { defaultEnv } = useGetEnvChainId(requiredChain)
    const provider = useReadOnlyProvider(requiredChain)

    useEffect(() => {
        if (account && provider) {
            void hasSavingsBalance({ account, provider, defaultEnv }).then((res) => {
                setHasBalance(res)
            })
        }
    }, [account, setHasBalance, provider, defaultEnv, requiredChain])

    return (
        <>
            {hasBalance && (
                <Card className="mb-6 md:mb-4 card">
                    <SavingsCellsMobile
                        type="portfolio"
                        data={{ stats, error }}
                        headings={headings}
                        chain={requiredChain}
                        toggleModal={toggleModal}
                    />
                </Card>
            )}
        </>
    )
}
