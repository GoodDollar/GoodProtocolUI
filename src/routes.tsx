import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { RedirectHashRoutes } from 'pages/routes/redirects'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { CustomLightSpinner } from 'theme'
import Circle from 'assets/images/blue-loader.svg'

const Dashboard = lazy(() => import('./pages/gd/DatastudioDashboard'))
const Swap = lazy(() => import('./pages/gd/Swap'))
const Stakes = lazy(() => import('./pages/gd/Stake'))
const Portfolio = lazy(() => import('./pages/gd/Portfolio'))
const MicroBridge = lazy(() => import('./pages/gd/MicroBridge'))
const Claim = lazy(() => import('./pages/gd/Claim'))
const GoodId = lazy(() => import('./pages/gd/GoodId'))
const BuyGd = lazy(() => import('./pages/gd/BuyGD'))
const NewsFeedPage = lazy(() => import('./pages/gd/News'))

function Routes(): JSX.Element {
    const { chainId } = useActiveWeb3React()

    return (
        <Suspense fallback={<CustomLightSpinner src={Circle} alt="loader" size={'48px'} />}>
            <Switch>
                <Route exact strict path="/dashboard" component={Dashboard} />
                <Route exact strict path="/swap" component={Swap} key={chainId} />
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

export default Routes
