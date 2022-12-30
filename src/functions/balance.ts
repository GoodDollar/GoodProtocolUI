import { SavingsSDK } from '@gooddollar/web3sdk-v2'

export type SavingsBalance = {
    account: string
    provider: any
    defaultEnv: string
}

export const hasSavingsBalance = ({ account, provider, defaultEnv }: SavingsBalance) => {
    const sdk = new SavingsSDK(provider, defaultEnv)
    const hasBalance = sdk
        .hasBalance(account)
        .then((res) => {
            return res
        })
        .catch(() => {
            return false
        })
    return hasBalance
}
