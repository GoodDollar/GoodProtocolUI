const MAX_REASON_LENGTH = 180

const truncate = (value: string, max = MAX_REASON_LENGTH) =>
    value.length > max ? `${value.slice(0, max - 1)}…` : value

const getNestedMessage = (input: string) => {
    const jsonMessage = input.match(/"message"\s*:\s*"([^"]+)"/i)?.[1]
    if (jsonMessage) return jsonMessage

    const textMessage = input.match(/message[:=]\s*([^,\n)]+)/i)?.[1]
    if (textMessage) return textMessage

    return input
}

const normalizeWhitespace = (value: string) =>
    value
        .replace(/0x[a-fA-F0-9]{80,}/g, '')
        .replace(/\s+/g, ' ')
        .trim()

export const decodeTransactionErrorReason = (error: unknown) => {
    const raw =
        typeof error === 'string'
            ? error
            : (error as { shortMessage?: string; reason?: string; message?: string } | null)?.shortMessage ||
              (error as { shortMessage?: string; reason?: string; message?: string } | null)?.reason ||
              (error as { shortMessage?: string; reason?: string; message?: string } | null)?.message ||
              ''

    const normalized = normalizeWhitespace(getNestedMessage(raw))

    if (/insufficient funds for gas \* price \+ value/i.test(raw) || /code\s*=\s*INSUFFICIENT_FUNDS/i.test(raw)) {
        return 'Insufficient funds for network gas. Add more native token and try again.'
    }

    if (!normalized) return 'Transaction failed. Please try again.'

    return truncate(normalized)
}
