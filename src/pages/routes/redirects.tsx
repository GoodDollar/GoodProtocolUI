import React from 'react'
import { Redirect, Route, RouteComponentProps } from 'react-router-dom'
import SavingsPage from 'pages/Savings'

<Route path="/savings" component={SavingsPage} />

// Redirects Legacy Hash Routes to Browser Routes
export function RedirectHashRoutes({ location }: RouteComponentProps) {
    if (!location.hash) {
        return <Redirect to={{ ...location, pathname: '/claim' }} />
    }
    return <Redirect to={location.hash.replace('#', '')} />
}

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
    return <Redirect to={{ ...location, pathname: '/claim' }} />
}

