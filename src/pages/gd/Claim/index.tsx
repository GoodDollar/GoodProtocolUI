import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// TODO: check when good-design will be merged
import { ClaimButton, Layout, Title } from '@gooddollar/good-design'
import { StyleSheet } from "react-native";
import { View } from "native-base";

const Claim = () => {
  const { i18n } = useLingui()

  return (
    <Layout>
      <Title>
        {i18n._(t`Claim`)}
      </Title>
      <View style={styles.content}>
        <ClaimButton  firstName={'Test'} method={'redirect'}/>
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
})
