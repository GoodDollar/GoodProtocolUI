import React, { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { usePostHog } from 'posthog-react-native'
import { Spinner } from 'native-base'

import { RedirectHashRoutes } from 'pages/routes/redirects'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CustomLightSpinner } from 'theme'
import Circle from 'assets/images/blue-loader.svg'

const Dashboard = lazy(() => import('./pages/gd/DatastudioDashboard'))
const Swap = lazy(() => import('./pages/gd/Swap'))
const Stakes = lazy(() => import('./pages/gd/Stake'))
const Portfolio = lazy(() => import('./pages/gd/Portfolio'))
const MicroBridge = lazy(() => import('./pages/gd/MicroBridge'))
const Claim = lazy(() => import('./pages/gd/Claim/'))
const GoodId = lazy(() => import('./pages/gd/GoodId'))
const BuyGd = lazy(() => import('./pages/gd/BuyGD'))
const NewsFeedPage = lazy(() => import('./pages/gd/News'))

const RoutesWrapper = () => {
    const posthog = usePostHog()
    const [posthogInitialized, setPosthogInitialized] = useState(false)

    useEffect(() => {
        if (posthog) {
            posthog.onFeatureFlags(() => {
                setPosthogInitialized(true)
                return
            })
        }

        // Fallback: if PostHog doesn't initialize within 3 seconds, proceed anyway
        const timeout = setTimeout(() => {
            setPosthogInitialized(true)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [posthog])

    return posthogInitialized ? <Routes /> : <Spinner variant="page-loader" size="lg" />
}

function Routes(): JSX.Element {
    const { chainId } = useActiveWeb3React()

    return (
        <Suspense fallback={<CustomLightSpinner src={Circle} alt="loader" size={'48px'} />}>
            <Switch>
                <Route exact strict path="/dashboard" component={Dashboard} />
                <Route exact strict path="/swap/:widget" component={Swap} key={chainId} />
                <Route exact strict path="/stakes" component={Stakes} />
                <Route exact strict path="/portfolio" component={Portfolio} />
                <Route exact strict path="/goodid" component={GoodId} />
                <Route exact strict path="/buy" component={BuyGd} />
                <Route exact strict path="/claim" component={Claim} />
                <Route exact strict path="/microbridge" component={MicroBridge} />
                <Route exact strict path="/news" component={NewsFeedPage} />
                <Route component={RedirectHashRoutes} />
            </Switch>
        </Suspense>
    )
}

export default RoutesWrapper
