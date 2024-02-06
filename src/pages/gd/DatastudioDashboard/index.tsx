import React from 'react'
import styled from 'styled-components'

const DASHBOARD_URL = process.env.REACT_APP_DATASTUDIO_DASHBOARD_URL || 'https://dashboard.gooddollar.org/'

const Wrapper = styled.div`
    width: 100%;
    margin-top: -2.5rem;

    @media only screen and (max-width: 768px) {
        margin-top: -2rem;
    }

    @media only screen and (max-width: 480px) {
        margin-top: -1rem;
    }
`

export default function DatastudioDashboard(): JSX.Element {
    return (
        <Wrapper>
            <iframe
                title="Datastudio Dashboard"
                width="100%"
                height="924"
                src={DASHBOARD_URL}
                style={{ border: 'none' }}
                allowFullScreen
            ></iframe>
        </Wrapper>
    )
}
