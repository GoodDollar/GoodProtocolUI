import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// TODO: check when good-design will be merged
import { ClaimButton, Layout, Title } from '@gooddollar/good-design'
import { StyleSheet } from 'react-native'
import { View, Text } from 'native-base'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const Claim = () => {
    const { i18n } = useLingui()
    const { account } = useActiveWeb3React()

    return (
        <Layout>
            <Title>{i18n._(t`Claim`)}</Title>
            <View style={styles.content}>
                {account ? (
                    <ClaimButton firstName={'Test'} method={'redirect'} />
                ) : (
                    <Text color={'white'} style={styles.notice} mt={'5'}>
                        {i18n._(t`CONNECT A WALLET TO CLAIM YOUR GOODDOLLARS`)}
                    </Text>
                )}
            </View>
        </Layout>
    )
}

export default memo(Claim)

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    notice: {
        width: '100%',
        textAlign: 'center',
        borderRadius: 5,
        font: {},
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 0.35,
        backgroundColor: '#0d263d66',
        padding: '40px',
    },
})
