import deployment from '@gooddollar/goodprotocol/releases/deployment.json'

export const FUSE_GOVERNANCE_STAKING_V2 = deployment.production.GovernanceStakingV2 as string

export const FUSE_CHAIN_ID = 122

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
