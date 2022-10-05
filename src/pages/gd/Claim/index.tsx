import React, { memo } from 'react'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
// TODO: check when good-design will be merged
// import { ClaimButton } from '@gooddollar/good-design'
import { StyleSheet } from "react-native";
import { useTheme } from "styled-components";
import { Text, View } from "native-base";

const Claim = () => {
	const {i18n} = useLingui()
	const theme = useTheme()
	const styles = makeStyles(theme)

	return (
		<View style={styles.layout}>
			<Text color={theme.color.text4}>
				{i18n._(t`Claim`)}
			</Text>
			<View style={styles.content}>
				{/*<ClaimButton />*/}
			</View>
		</View>
	)
}

export default memo(Claim)

const makeStyles = (theme: any) => StyleSheet.create({
	title: {
		fontFamily: theme.font.primary,
		fontStyle: 'normal',
		fontWeight: 'bold',
		fontSize: 34,
		lineHeight: 40,
		letterSpacing: -0.02,
	},
	layout: {
		maxWidth: 712,
		width: '100%',
		background: theme.color.main,
		boxShadow: theme.shadow.button,
		borderRadius: 20,
		paddingVertical: 20,
		paddingHorizontal: 17,
	},
	content: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
	},
})
