import './styles/index.css'
import '@fontsource/dm-sans/index.css'
import 'react-tabs/style/react-tabs.css'
import './bootstrap'

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HashRouter as Router } from 'react-router-dom'
import { AnalyticsProvider } from '@gooddollar/web3sdk-v2'
import { PostHogProvider } from 'posthog-react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { GoodXProvider } from '@gooddollar/good-design'

import Blocklist from './components/Blocklist'
import App from './pages/App'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import MulticallUpdater from './state/multicall/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { TwTheme } from './theme'
import LanguageProvider from 'language'
import { createGlobalStyle } from 'styled-components'
import { analyticsConfig, appInfo } from 'hooks/useSendAnalyticsData'
import { HttpsProvider } from 'utils/HttpsProvider'
import { registerServiceWorker } from './serviceWorker'
import { AppKitProvider } from './reown/reownprovider'
import { SimpleAppProvider } from 'state/simpleapp/simpleapp'
import { nbTheme } from './theme/nbtheme'

if (window.ethereum) {
    window.ethereum.autoRefreshOnNetworkChange = false
}

const GlobalStyle = createGlobalStyle`
  body {
      color: ${({ theme }: { theme: TwTheme }) => theme.color.text1};
  }

  :root {
    --onboard-wallet-columns: 2;
    --foreground-color: #eff1fc;
    --onboard-wallet-button-background-hover: #eff1fc;
    --onboard-wallet-button-border-color: #E9ECFF;
    --onboard-wallet-app-icon-border-color: #E9ECFF;
    --onboard-close-button-background: none;
    --onboard-close-button-color: black;
    --onboard-font-family-normal: ${({ theme }: { theme: TwTheme }) => theme.font.primary};
    --onboard-font-family-light: ${({ theme }: { theme: TwTheme }) => theme.font.secondary};


  }
  onboard-v2::part(sidebar-heading-img) {
    max-width: 100%;
    height: auto;
  }
  onboard-v2::part(main-modal) {
    @media screen and (max-width: 420px) {
      width: 90%;
    }
  }
  onboard-v2::part(mobile-icon-container) {
    width: auto;
  }

  onboard-v2::part(mobile-icon-img) {
    width: 120px;
    height: auto;
  }
`

const enableHttpsRedirect = String(process.env.REACT_APP_ENABLE_HTTPS_REDIRECT) === '1'
const enableServiceWorker =
    window.location.hostname !== 'localhost' && String(process.env.REACT_APP_ENABLE_SERVICE_WORKER) === '1'

const ProviderWrapper = ({ children }) => (
    <Provider store={store}>
        <PostHogProvider
            apiKey={import.meta.env.REACT_APP_POSTHOG_KEY}
            options={{
                host: import.meta.env.REACT_APP_POSTHOG_PROXY ?? 'https://app.posthog.com',
            }}
            autocapture={false}
        >
            <AppKitProvider>
                <GoodXProvider
                    nativeBaseProps={{ config: { suppressColorAccessibilityWarning: true }, theme: nbTheme }}
                >
                    <LanguageProvider>{children}</LanguageProvider>
                </GoodXProvider>
            </AppKitProvider>
        </PostHogProvider>
    </Provider>
)

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
    <StrictMode>
        <HttpsProvider enabled={enableHttpsRedirect}>
            <ProviderWrapper>
                <AnalyticsProvider config={analyticsConfig} appProps={appInfo}>
                    <Blocklist>
                        <UserUpdater />
                        <ApplicationUpdater />
                        <MulticallUpdater />
                        <ThemeProvider>
                            <PaperProvider>
                                <GlobalStyle />
                                <Router>
                                    <SimpleAppProvider>
                                        <App />
                                    </SimpleAppProvider>
                                </Router>
                            </PaperProvider>
                        </ThemeProvider>
                    </Blocklist>
                </AnalyticsProvider>
            </ProviderWrapper>
        </HttpsProvider>
    </StrictMode>
)

console.log('service worker options', {
    REACT_APP_ENABLE_SERVICE_WORKER: process.env.REACT_APP_ENABLE_SERVICE_WORKER,
    enableServiceWorker,
})

if (enableServiceWorker) {
    console.log('registering service worker...')

    registerServiceWorker()
}
