export function isMiniPay(): boolean {
    try {
        // @ts-ignore
        return Boolean(window?.ethereum?.isMiniPay)
    } catch {
        return false
    }
}
