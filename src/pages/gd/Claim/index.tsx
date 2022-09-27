import React, { memo } from 'react'
import Title from 'components/gd/Title'
import { t } from '@lingui/macro'
import ClaimButton from './ClaimButton'
import { useLingui } from '@lingui/react'
import { PageContent, StyledLayout } from "./styled";

const Claim = () => {
	const { i18n } = useLingui()

	return (
		<StyledLayout classes="md:mt-24 xl:mt-0 sh:mt-30">
			<Title className="mb-6 md:pl-4">
				{i18n._(t`Claim`)}
			</Title>
			<PageContent>
				<ClaimButton/>
			</PageContent>
		</StyledLayout>
	)
}

export default memo(Claim)
