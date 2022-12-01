import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ClaimButton, Layout, Title } from '@gooddollar/good-design'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const Claim = memo(() => {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()

    return (
        <div className="flex flex-col flex-grow w-full">
            <Title>{i18n._(t`Claim UBI`)}</Title>

            <span>UBI is your fair share of G$ tokens, which you can claim daily on CELO.</span>

            <div className="flex items-center">
                {account ? (
                    <ClaimButton firstName="Test" method="redirect" />
                ) : (
                    <div className="blue p-40 mt-5 w-full">
                        <span className="white text-center">
                            {i18n._(t`CONNECT A WALLET TO CLAIM YOUR GOODDOLLARS`)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
})

export default Claim
