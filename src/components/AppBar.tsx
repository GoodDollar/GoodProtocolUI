import { Fraction } from '@uniswap/sdk-core'
import React, { useState, useCallback } from 'react'
import { ReactComponent as LogoPrimary } from '../assets/svg/logo_primary_2023.svg'
import { ReactComponent as LogoWhite } from '../assets/svg/logo_white_2023.svg'
import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { useApplicationTheme } from '../state/application/hooks'
import { ReactComponent as Burger } from '../assets/images/burger.svg'
import { ReactComponent as X } from '../assets/images/x.svg'
import { t } from '@lingui/macro'
import SideBar from './SideBar'
import usePromise from '../hooks/usePromise'
import { g$Price } from '@gooddollar/web3sdk'
import NetworkModal from './NetworkModal'
import AppNotice from './AppNotice'
import { isMobile } from 'react-device-detect'
import { Text, useBreakpointValue, ITextProps, Pressable } from 'native-base'
import { useWalletModalToggle } from '../state/application/hooks'
import { OnboardConnectButton } from './BlockNativeOnboard'
import { useIsSimpleApp } from 'state/simpleapp/simpleapp'

const AppBarWrapper = styled.header`
    background: ${({ theme }) => theme.color.secondaryBg};
    .site-logo {
        height: 29px;
    }
    height: 87px;

    .mobile-menu-button {
        display: none;
    }
    @media ${({ theme }) => theme.media.lg} {
        box-shadow: ${({ theme }) => theme.shadow.headerNew};
    }

    @media ${({ theme }) => theme.media.md} {
        .actions-wrapper {
            background: ${({ theme }) => theme.color.main};
            box-shadow: ${({ theme }) => (theme.darkMode ? 'none' : theme.shadow.headerNew)};
            border-top: ${({ theme }) => (theme.darkMode ? '1px solid rgba(208, 217, 228, 0.483146)' : 'none')};
            margin: 0 !important;
        }

        .mobile-menu-button {
            display: block;
        }

        .site-logo {
            width: 131px;
            height: 25px;
        }
    }
`
export const LogoWrapper = styled.div<{ $mobile: boolean }>`
    ${({ theme, $mobile }) =>
        theme.darkMode &&
        $mobile &&
        `
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 131px;
        height: 18.4px;
      }
    `}
`

// TODO: Move and combine with styling for ButtonOutlined
export const DivOutlined = styled.div<{
    size?: 'default' | 'sm'
    error?: boolean
    width?: string
    borderRadius?: string
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${({ size }) => (size === 'sm' ? '32px' : '42px')};
    width: ${({ width = '100%' }) => width};
    border-radius: ${({ borderRadius = '6px' }) => borderRadius};
    color: ${({ theme }) => theme.color.text2};
    background: transparent;
    border: 1px solid ${({ theme }) => theme.color.text2};
    cursor: pointer;

    font-style: normal;
    font-weight: 500;
    font-size: ${({ size }) => (size === 'sm' ? '14px' : '16px')};
    line-height: 16px;
    text-align: center;
    user-select: none;

    :disabled {
        opacity: 0.5;
        cursor: auto;
    }
`
const SidebarContainer = styled.div<{ $mobile: boolean }>`
    ${({ $mobile }) =>
        $mobile &&
        `  top: 75px;
  width: 75%;
  height: 95%;
  left: -806px;
  position: fixed;
  transition: transform 1s ease;
  z-index: 11;
  &.open {
    transition: transform 1s ease;
    transform: translateX(806px)
  }`}
`

const SidebarOverlay = styled.div`
    z-index: 0;
    opacity: 0;
    transition: all 0.5s ease;
    &.open {
        top: 75px;
        transition: all 0.5s ease;
        opacity: 1;
        background-color: #3c3c3c3c;
        z-index: 10;
        height: 100%;
    }
`
// will be moved to native base soon
const TopBar = styled.div<{ $mobile: boolean }>`
    ${({ $mobile }) =>
        $mobile &&
        `
    background-color: transparent;
    height: 40px;
    align-items: flex-end;
    padding-left: 16px;
    padding-right: 16px;
  }`}
`

const G$Balance = ({
    price,
    color,
    display = 'block',
    ...props
}: {
    price: Fraction | undefined
    color: string
    display?: string
} & ITextProps) => (
    <Text
        display={display}
        fontFamily="subheading"
        fontWeight="400"
        color={color}
        fontSize="xs"
        justifyContent="flex-start"
        alignSelf="flex-start"
        {...props}
    >
        {price ? `1,000G$ = ${price.multiply(1000).toFixed(3)}USD` : ''}
    </Text>
)

function AppBar(): JSX.Element {
    const [theme] = useApplicationTheme()
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleWalletModal = useWalletModalToggle()
    const isSimpleApp = useIsSimpleApp()

    const [G$Price] = usePromise(async () => {
        try {
            const data = await g$Price()
            return data.DAI
        } catch {
            return undefined
        }
    }, [chainId])

    const toggleSideBar = useCallback(() => {
        setSidebarOpen(!sidebarOpen)
    }, [sidebarOpen])

    const fontColor = useBreakpointValue({
        base: 'goodGrey.400',
        lg: 'lightGrey',
    })
    const showBalance = useBreakpointValue({
        base: 'none',
        lg: 'block',
    })

    return (
        <AppBarWrapper
            className="relative z-10 flex flex-row justify-between w-screen flex-nowrap background"
            style={{ flexDirection: 'column' }}
        >
            <AppNotice text={i18n._(t``)} link={['']} show={false}></AppNotice>
            <>
                <div className="lg:px-8 lg:pt-4 lg:pb-2">
                    <TopBar $mobile={isMobile} className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <LogoWrapper $mobile={isMobile} className="flex-shrink-0">
                                {theme === 'dark' ? (
                                    <LogoWhite className="w-auto site-logo lg:block" />
                                ) : (
                                    <LogoPrimary className="w-auto site-logo lg:block" />
                                )}
                            </LogoWrapper>
                            <G$Balance price={G$Price} display={showBalance} color={fontColor} pl="0" p="2" />
                        </div>

                        {!isSimpleApp && (
                            <div className="flex flex-row items-end h-10 space-x-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <button
                                        onClick={toggleSideBar}
                                        className="inline-flex items-center justify-center rounded-md mobile-menu-button focus:outline-none"
                                    >
                                        <span className="sr-only">{i18n._(t`Open main menu`)}</span>
                                        {sidebarOpen ? (
                                            <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                                        ) : (
                                            <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                                <div className="fixed bottom-0 left-0 flex flex-row items-center justify-center w-full h-20 gap-2 lg:w-auto lg:relative lg:p-0 actions-wrapper lg:h-12">
                                    <div className="hidden xs:inline-block">
                                        <Web3Network />
                                    </div>

                                    {account ? (
                                        <Pressable
                                            onPress={toggleWalletModal}
                                            h={10}
                                            display="flex"
                                            alignItems="center"
                                            px={3}
                                            py={2}
                                            ml={2}
                                            borderWidth="1"
                                            borderRadius="12px"
                                            borderColor="borderBlue"
                                        >
                                            <Web3Status />
                                        </Pressable>
                                    ) : (
                                        <OnboardConnectButton />
                                    )}
                                    <NetworkModal />
                                </div>
                            </div>
                        )}
                    </TopBar>
                    <div className="px-4 pb-2 lg:hidden">
                        <G$Balance price={G$Price} color={fontColor} padding="0" />
                    </div>
                </div>
                {isMobile && !isSimpleApp && (
                    <>
                        <SidebarContainer $mobile={isMobile} className={`${sidebarOpen ? ' open ' : ''} w-64`}>
                            <SideBar mobile={isMobile} closeSidebar={toggleSideBar} />
                        </SidebarContainer>
                        <SidebarOverlay
                            id="overlay"
                            onClick={toggleSideBar}
                            className={`fixed lg:hidden w-full ${sidebarOpen ? ' open ' : ''}`}
                        ></SidebarOverlay>
                    </>
                )}
            </>
        </AppBarWrapper>
    )
}

export default AppBar
