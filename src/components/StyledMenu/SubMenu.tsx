import React from 'react'
import { Text, View } from 'native-base'
import { ExternalLink } from 'theme'
import { NavLink } from '../Link'

export const SubMenuItems = ({
    items,
    handleExternal,
    handleInternal,
    styles,
}: {
    items: any
    handleExternal: any
    handleInternal: any
    styles?: any
}) =>
    items
        .filter((ext) => ext.show)
        .map(({ label, url, dataAttr, withIcon, route, text }) => {
            if (url) {
                return (
                    <ExternalLink
                        key={label}
                        label={label}
                        url={url}
                        dataAttr={dataAttr}
                        withIcon={withIcon}
                        customStyles={{ px: 2, py: 1, ...styles }}
                        // customStyles={styles}
                        onPress={handleExternal}
                    />
                )
            }
            if (route) {
                return (
                    <View style={{ margin: 8, ...styles }}>
                        <NavLink key={route} to={route} onPress={handleInternal}>
                            <Text>{text}</Text>
                        </NavLink>
                    </View>
                )
            }
        })
