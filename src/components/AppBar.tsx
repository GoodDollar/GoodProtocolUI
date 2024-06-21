import React, { useMemo } from 'react'
import { Fraction } from '@uniswap/sdk-core'
import { useLingui } from '@lingui/react'
import styled from 'styled-components'
import { t } from '@lingui/macro'
import { g$ReservePrice, useGdContextProvider } from '@gooddollar/web3sdk'
import { Box, ITextProps, Pressable, PresenceTransition, Text, useBreakpointValue } from 'native-base'
import { useFeatureFlag, useFeatureFlagWithPayload } from 'posthog-react-native'
import { BasePressable, CentreBox, useScreenSize } from '@gooddollar/good-design'
import { useG$Balance } from '@gooddollar/web3sdk-v2'

import { useActiveWeb3React } from '../hooks/useActiveWeb3React'
import Web3Network from './Web3Network'
import Web3Status from './Web3Status'
import { useWalletModalToggle } from '../state/application/hooks'
import SideBar from './SideBar'
// import { NavBar } from './StyledMenu/Navbar'
import usePromise from '../hooks/usePromise'
import NetworkModal from './NetworkModal'
import AppNotice from './AppNotice'
import { OnboardConnectButton } from './BlockNativeOnboard'
import { useIsSimpleApp } from 'state/simpleapp/simpleapp'
import WalletBalanceWrapper from './WalletBalance'
import { MenuContainer } from './Layout/MenuContainer'

import { ReactComponent as WalletBalanceIcon } from '../assets/images/walletBalanceIcon.svg'
import { ReactComponent as LogoPrimary } from '../assets/svg/logo_primary_2023.svg'
import { ReactComponent as LogoWhite } from '../assets/svg/logo_white_2023.svg'
import { useApplicationTheme } from '../state/application/hooks'
import { ReactComponent as Burger } from '../assets/images/burger.svg'
import { ReactComponent as X } from '../assets/images/x.svg'

const AppBarWrapper = styled.header`
    background: ${({ theme }) => theme.color.secondaryBg};
    .site-logo {
        height: 29px;
    }

    @media ${({ theme }) => theme.media.lg} {
        box-shadow: ${({ theme }) => theme.shadow.headerNew};
    }

    @media ${({ theme }) => theme.media.xl} {
        .mobile-menu-button {
            display: none;
        }
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
            height: 20px;
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
const SidebarContainer = styled.div<{ $mobile: boolean; scrWidth?: number | string; appNotice: boolean }>`
    ${({ $mobile, scrWidth, appNotice }) =>
        $mobile &&
        `top: ${appNotice ? `140px` : `40px`};
  width: ${scrWidth};
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

const Web3Bar = () => {
    const { account } = useActiveWeb3React()
    const toggleWalletModal = useWalletModalToggle()

    return (
        <>
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
        </>
    )
}

function AppBar({ sideBar, walletBalance }): JSX.Element {
    const [theme] = useApplicationTheme()
    const { i18n } = useLingui()
    const { account, chainId } = useActiveWeb3React()
    const isSimpleApp = useIsSimpleApp()
    const showPrice = useFeatureFlag('show-gd-price')
    const { web3 } = useGdContextProvider()

    const { ethereum } = window
    const isMinipay = ethereum?.isMiniPay

    const [, payload] = useFeatureFlagWithPayload('app-notice')
    const { enabled: appNoticeEnabled, message, color, link } = (payload as any) || {}
    const [sidebarOpen, setSidebarOpen] = sideBar
    const [walletBalanceOpen, setWalletBalanceOpen] = walletBalance
    const { isMobileView, isSmallTabletView, isTabletView, isDesktopView } = useScreenSize()

    const { G$ } = useG$Balance(5)

    const [G$Price] = usePromise(async () => {
        try {
            const data = await g$ReservePrice(web3, 1)

            return data.DAI.asFraction
        } catch {
            return undefined
        }
    }, [chainId, web3])

    const gdBalance = useMemo(
        () =>
            G$?.format({
                useFixedPrecision: true,
                suffix: '',
                prefix: G$.currency?.ticker + ' ',
            }) ?? '0.00',
        [G$]
    )

    const fontColor = useBreakpointValue({
        base: 'goodGrey.400',
        lg: 'lightGrey',
    })

    const toggleSideBar = () => {
        setSidebarOpen((prevSidebarOpen) => {
            if (!prevSidebarOpen) {
                setWalletBalanceOpen(false)
            }
            return !prevSidebarOpen
        })
    }

    const toggleWalletBalance = () => {
        setWalletBalanceOpen((prevWalletBalanceOpen) => {
            if (!prevWalletBalanceOpen) {
                setSidebarOpen(false)
            }
            return !prevWalletBalanceOpen
        })
    }

    const walletBalanceStyles = useBreakpointValue({
        base: {
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            height: 24,
        },
        lg: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 'auto',
        },
    })

    const barContainerStyles = useBreakpointValue({
        base: {
            paddingTop: 12,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            justifyContent: 'space-between',
        },
        md: {
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 32,
            paddingRight: 32,
            justifyContent: 'space-between',
        },
        lg: {
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 48,
            paddingRight: 48,
            justifyContent: 'space-between',
        },
    })

    return (
        <AppBarWrapper
            className="relative z-10 flex flex-row justify-between w-screen flex-nowrap background"
            style={{ flexDirection: 'column', height: appNoticeEnabled ? '150px' : '87px' }}
        >
            <>
                {appNoticeEnabled && <AppNotice text={message} bg={color} link={link} show={true} />}
                <CentreBox style={barContainerStyles} flexDir="row">
                    <div className="flex flex-col">
                        <LogoWrapper $mobile={isTabletView} className="flex-shrink-0">
                            {theme === 'dark' ? (
                                <LogoWhite className="w-auto site-logo lg:block" />
                            ) : (
                                <LogoPrimary className="w-auto site-logo lg:block" />
                            )}
                        </LogoWrapper>
                    </div>

                    <div className="relative flex flex-row items-center">
                        {account && (
                            <Box flexDirection="row" alignItems="center">
                                <BasePressable onPress={toggleWalletBalance} innerView={{ flexDirection: 'row' }}>
                                    <Text
                                        color={walletBalanceOpen ? 'primary' : 'goodGrey.700'}
                                        selectable={false}
                                        pr={1}
                                        fontFamily="subheading"
                                        fontWeight={400}
                                        fontSize="sm"
                                        style={walletBalanceStyles}
                                    >
                                        {gdBalance}
                                    </Text>
                                    <WalletBalanceIcon fill={walletBalanceOpen ? '#00AFFF' : '#000'} />
                                </BasePressable>
                                <PresenceTransition
                                    visible={walletBalanceOpen}
                                    initial={{
                                        scaleY: 0,
                                        translateY: 20,
                                        translateX: isSmallTabletView ? 47 : 0,
                                    }}
                                    animate={{
                                        scaleY: 1,
                                        translateY: 0,
                                        translateX: isSmallTabletView ? 47 : 0,
                                        transition: { duration: 250 },
                                    }}
                                >
                                    <WalletBalanceWrapper toggleView={toggleWalletBalance} />
                                </PresenceTransition>
                            </Box>
                        )}
                        <div className="z-50 flex flex-row items-center">
                            <button
                                onClick={toggleSideBar}
                                className="inline-flex items-center justify-center ml-2 rounded-md mobile-menu-button focus:outline-none"
                            >
                                <span className="sr-only">{i18n._(t`Open main menu`)}</span>
                                {sidebarOpen ? (
                                    <X title="Close" className="block w-6 h-6" aria-hidden="true" />
                                ) : (
                                    <Burger title="Burger" className="block w-6 h-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>

                        {!isMinipay && (
                            <MenuContainer>
                                {!isSimpleApp ? <Web3Bar /> : null}
                                {/* // : isMobile ? <NavBar /> : null} <-- dont show navbar anyway until design updates */}
                            </MenuContainer>
                        )}
                    </div>
                </CentreBox>
                <div className="px-4 pb-2 lg:hidden">
                    {showPrice && <G$Balance price={G$Price} color={fontColor} padding="0" />}
                </div>
                {!isDesktopView && (
                    <>
                        <SidebarContainer
                            $mobile={!isDesktopView}
                            appNotice={appNoticeEnabled}
                            scrWidth={isMobileView ? '100%' : isSmallTabletView ? '50%' : '40%'}
                            className={`${sidebarOpen ? ' open ' : ''} w-64`}
                        >
                            <SideBar mobile={!isDesktopView} closeSidebar={toggleSideBar} />
                        </SidebarContainer>
                    </>
                )}
                <Pressable
                    display={sidebarOpen || walletBalanceOpen ? 'block' : 'none'}
                    position="absolute"
                    h="100vh"
                    w="100%"
                    //@ts-ignore no other way to apply style for cursor, but not part of type definition
                    style={{ cursor: 'default' }}
                    onPress={walletBalanceOpen ? toggleWalletBalance : toggleSideBar}
                    zIndex={'-1'}
                >
                    <PresenceTransition
                        testID="overlay"
                        visible={sidebarOpen || walletBalanceOpen}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                            transition: { duration: 500 },
                        }}
                        style={{
                            zIndex: walletBalanceOpen ? -1 : sidebarOpen ? 10 : 0,
                            backgroundColor: !isDesktopView ? '#3c3c3c3c' : 'none ',
                            width: '100%',
                            top: appNoticeEnabled ? `140px` : `40px`,
                            height: '100%',
                        }}
                    />
                </Pressable>
            </>
        </AppBarWrapper>
    )
}

export default AppBar
