import { MenuFlyout, StyledMenu, StyledMenuButton } from 'components/StyledMenu'
import React, { memo, useRef } from 'react'
import styled from 'styled-components'
import ArFlag from '../../assets/images/countries/ar-flag.png'
import ChFlag from '../../assets/images/countries/ch-flag.png'
import DeFlag from '../../assets/images/countries/de-flag.png'
import EnFlag from '../../assets/images/countries/en-flag.png'
import EsFlag from '../../assets/images/countries/es-flag.png'
import HeFlag from '../../assets/images/countries/he-flag.png'
import ItFlag from '../../assets/images/countries/it-flag.png'
import RoFlag from '../../assets/images/countries/ro-flag.png'
import RuFlag from '../../assets/images/countries/ru-flag.png'
import UkFlag from '../../assets/images/countries/uk-flag.png'
import ViFlag from '../../assets/images/countries/vi-flag.png'
import { useLanguageData } from '../../language/hooks'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/types'

const ExtendedStyledMenuButton = styled(StyledMenuButton)`
    border-radius: 10px;
    font-size: 1.25rem;
    height: 40px;

    &:hover {
        border-color: rgb(33, 34, 49);
    }
`

const ExtendedMenuFlyout = styled(MenuFlyout)`
    min-width: 10rem;
    ${({ theme }) => theme.mediaWidth.upToMedium`
    max-height: 232px;
    overflow: auto;
    min-width: 11rem;
    top: -16.5rem;
  `};
`

const MenuItem = styled.span`
    align-items: center;
    flex: 1;
    //display: flex;
    padding: 0.5rem 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text2};
    :hover {
        color: ${({ theme }) => theme.text1};
        cursor: pointer;
        text-decoration: none;
    }
    > svg {
        margin-right: 8px;
    }
`

const MenuItemFlag = styled.img`
    display: inline;
    margin-right: 0.625rem;
    width: 20px;
    height: 20px;
    vertical-align: middle;
`

const MenuButtonFlag = styled.img`
    width: 24px;
    height: 24px;
    vertical-align: middle;
`

// Use https://onlineunicodetools.com/convert-unicode-to-image to convert
// Unicode flags to png as Windows does not support Unicode flags
// Use 24px as unicode characters font size
const LANGUAGES: { [x: string]: { flag: string; language: string; dialect?: string } } = {
    en: {
        flag: EnFlag,
        language: 'English',
    },
    de: {
        flag: DeFlag,
        language: 'German',
    },
    it: {
        flag: ItFlag,
        language: 'Italian',
    },
    he: {
        flag: HeFlag,
        language: 'Hebrew',
    },
    ru: {
        flag: RuFlag,
        language: 'Russian',
    },
    ro: {
        flag: RoFlag,
        language: 'Romanian',
    },
    uk: {
        flag: UkFlag,
        language: 'Ukrainian',
    },
    vi: {
        flag: ViFlag,
        language: 'Vietnamese',
    },
    'zh-CN': {
        flag: ChFlag,
        language: 'Chinese',
        dialect: '简',
    },
    'zh-TW': {
        flag: ChFlag,
        language: 'Chinese',
        dialect: '繁',
    },
    es: {
        flag: EsFlag,
        language: 'Spanish',
    },
    'es-419': {
        flag: ArFlag,
        language: 'Spanish',
        dialect: 'AR',
    },
}

const LanguageSwitch = memo(() => {
    const node = useRef<HTMLDivElement>(null)
    const open = useModalOpen(ApplicationModal.LANGUAGE)
    const toggle = useToggleModal(ApplicationModal.LANGUAGE)
    // TODO-FIX: After moving the switch, this is triggered on every click, so click on language is not registered
    // useOnClickOutside(node, open ? toggle : undefined)
    const { language, setLanguage } = useLanguageData()

    const onClick = (key: string) => {
        setLanguage(key)
        toggle()
    }

    return (
        <StyledMenu ref={node}>
            <ExtendedStyledMenuButton onClick={toggle}>
                <MenuButtonFlag src={LANGUAGES[language]?.flag} alt={LANGUAGES[language]?.language} />
            </ExtendedStyledMenuButton>
            {open && (
                <ExtendedMenuFlyout>
                    {Object.entries(LANGUAGES).map(([key, { flag, language, dialect }]) => (
                        <MenuItem onClick={() => onClick(key)} key={key}>
                            <MenuItemFlag src={flag} alt={language} />
                            {language}{' '}
                            {dialect && (
                                <sup>
                                    <small>{dialect}</small>
                                </sup>
                            )}
                        </MenuItem>
                    ))}
                </ExtendedMenuFlyout>
            )}
        </StyledMenu>
    )
})

export default LanguageSwitch
