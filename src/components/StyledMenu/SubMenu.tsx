import React from 'react'
import { ExternalLink } from 'theme'

export const SubMenuItems = ({ items, onPress, styles }: { items: any; onPress: any; styles?: any }) =>
    items
        .filter((ext) => ext.show)
        .map(({ label, url, dataAttr, withIcon }) => (
            <ExternalLink
                key={label}
                label={label}
                url={url}
                dataAttr={dataAttr}
                withIcon={withIcon}
                customStyles={styles}
                onPress={onPress}
            />
        ))
