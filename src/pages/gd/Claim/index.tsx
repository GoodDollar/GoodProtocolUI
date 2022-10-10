import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// import { ClaimButton } from '@gooddollar/good-design'
import { NativeBaseProvider } from 'native-base'
import { ClaimButton, theme } from '@gooddollar/good-design'

const Claim = () => {
    const { i18n } = useLingui()
    return (
        <NativeBaseProvider theme={theme}>
            <ClaimButton firstName={'lewis'} method={'redirect'} text={'claimButton'} />
        </NativeBaseProvider>
        // <View style={styles.layout}>
        // 	<Text color={theme.color.text4}>
        // 		{i18n._(t`Claim`)}
        // 	</Text>
        // 	<View style={styles.content}>
        // 		{/*<ClaimButton />*/}
        // 	</View>
        // </View>
    )
}

export default memo(Claim)
