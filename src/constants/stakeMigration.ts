import deployment from '@gooddollar/goodprotocol/releases/deployment.json'
import { getEnv } from 'utils/env'

export const FUSE_CHAIN_ID = 122

type FuseDeploymentRow = Record<string, string | undefined>

function fuseGovernanceDeploymentRow(): FuseDeploymentRow {
    const env = getEnv()
    if (env === 'production' || env === 'staging') {
        return deployment.production as FuseDeploymentRow
    }
    if (deployment.fuse) {
        return deployment.fuse as FuseDeploymentRow
    }
    return deployment.production as FuseDeploymentRow
}

export function getFuseOldGovernanceStakingAddress(): string {
    const fromEnv = process.env.REACT_APP_FUSE_GOVERNANCE_STAKING_V2?.trim()
    if (fromEnv) {
        return fromEnv
    }

    const row = fuseGovernanceDeploymentRow()
    const address = row.GovernanceStakingV2 ?? row.GovernanceStaking
    if (!address) {
        throw new Error('No Fuse governance staking address in deployment.json for current env')
    }

    return address
}

export function getStakeMigrationOperator(): string | undefined {
    const value = process.env.REACT_APP_STAKE_MIGRATION_OPERATOR?.trim()
    return value && value.length > 0 ? value : undefined
}

export function getStakeMigrationApiUrl(): string | undefined {
    const base = process.env.REACT_APP_STAKE_MIGRATION_API_URL?.trim().replace(/\/$/, '')
    return base ? `${base}/migrate-stake-from-approval` : undefined
}

export function getStakeMigrationApiToken(): string | undefined {
    const value = process.env.REACT_APP_STAKE_MIGRATION_API_TOKEN?.trim()
    return value && value.length > 0 ? value : undefined
}

export type StakeMigrationApiResult = {
    user?: string
    approvedAmount?: string
    migratedAmount?: string
    fuseTransferTx?: string
    fuseWithdrawTx?: string
    bridgeTx?: string
    celoStakeTx?: string
    skipped?: boolean
    skipReason?: string
    error?: string
    status?: string
    lastSuccessfulStep?: string
    retryAfter?: number
}
