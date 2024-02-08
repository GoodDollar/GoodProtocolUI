import React from 'react'
import { CentreBox } from '@gooddollar/good-design'

const DASHBOARD_URL = process.env.REACT_APP_DATASTUDIO_DASHBOARD_URL || 'https://dashboard.gooddollar.org/'

export default function DatastudioDashboard(): JSX.Element {
    return (
        <CentreBox h={800} width="100%">
            <iframe
                title="Datastudio Dashboard"
                width="100%"
                height="900"
                src={DASHBOARD_URL}
                style={{ border: 'none' }}
                allowFullScreen
            ></iframe>
        </CentreBox>
    )
}
