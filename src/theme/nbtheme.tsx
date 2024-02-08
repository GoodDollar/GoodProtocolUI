import { theme as baseTheme } from '@gooddollar/good-design'
import { extendTheme } from 'native-base'

import { navbarTheme as NavBar } from 'components/StyledMenu/Navbar'
import { mpContainerTheme as MainPageContainer } from 'components/Layout/MainPageContainer'
import { menuContainerTheme as MenuContainer } from 'components/Layout/MenuContainer'

const { components } = baseTheme

export const nbTheme = extendTheme({
    ...baseTheme,
    components: {
        ...components,
        NavBar,
        MainPageContainer,
        MenuContainer,
    },
})
