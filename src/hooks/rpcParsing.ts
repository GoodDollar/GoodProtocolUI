export const FALLBACK_RPCS_BY_CHAIN: Record<string, string[]> = {
    '1': ['https://eth.llamarpc.com', 'https://1rpc.io/eth'],
    '122': ['https://rpc.fuse.io'],
    '42220': ['https://forno.celo.org'],
    '50': ['https://rpc.xinfin.network'],
}

const TARGET_CHAIN_IDS = ['1', '122', '42220', '50'] as const

function findBalancedSegment(source: string, startIndex: number, openChar: string, closeChar: string): string | null {
    let depth = 0
    let inSingleQuote = false
    let inDoubleQuote = false
    let inTemplate = false
    let inLineComment = false
    let inBlockComment = false
    let isEscaped = false

    for (let i = startIndex; i < source.length; i++) {
        const char = source[i]
        const next = source[i + 1]

        if (inLineComment) {
            if (char === '\n') inLineComment = false
            continue
        }

        if (inBlockComment) {
            if (char === '*' && next === '/') {
                inBlockComment = false
                i++
            }
            continue
        }

        if (inSingleQuote) {
            if (!isEscaped && char === "'") inSingleQuote = false
            isEscaped = !isEscaped && char === '\\'
            continue
        }

        if (inDoubleQuote) {
            if (!isEscaped && char === '"') inDoubleQuote = false
            isEscaped = !isEscaped && char === '\\'
            continue
        }

        if (inTemplate) {
            if (!isEscaped && char === '`') inTemplate = false
            isEscaped = !isEscaped && char === '\\'
            continue
        }

        if (char === '/' && next === '/') {
            inLineComment = true
            i++
            continue
        }

        if (char === '/' && next === '*') {
            inBlockComment = true
            i++
            continue
        }

        if (char === "'") {
            inSingleQuote = true
            isEscaped = false
            continue
        }

        if (char === '"') {
            inDoubleQuote = true
            isEscaped = false
            continue
        }

        if (char === '`') {
            inTemplate = true
            isEscaped = false
            continue
        }

        if (char === openChar) {
            depth++
        } else if (char === closeChar) {
            depth--
            if (depth === 0) {
                return source.slice(startIndex, i + 1)
            }
        }
    }

    return null
}

function extractUrlsFromArrayLiteral(arrayLiteral: string): string[] {
    const urls = new Set<string>()
    const urlRegex = /(['"`])(https?:\/\/[\s\S]*?)\1/g

    for (const match of arrayLiteral.matchAll(urlRegex)) {
        const candidate = match[2].trim()
        try {
            const parsed = new URL(candidate)
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                urls.add(candidate)
            }
        } catch {
            // ignore malformed URL literals
        }
    }

    return [...urls]
}

function extractExtraRpcsObjectLiteral(chainlistContent: string): string {
    const declarationIndex = chainlistContent.indexOf('export const extraRpcs')
    if (declarationIndex < 0) {
        throw new Error('Could not find extraRpcs export in chainlist')
    }

    const objectStart = chainlistContent.indexOf('{', declarationIndex)
    if (objectStart < 0) {
        throw new Error('Could not parse extraRpcs from chainlist')
    }

    const objectLiteral = findBalancedSegment(chainlistContent, objectStart, '{', '}')
    if (!objectLiteral) {
        throw new Error('Could not parse extraRpcs object boundaries from chainlist')
    }

    return objectLiteral
}

function extractChainRpcArrayLiteral(extraRpcsObjectLiteral: string, chainId: string): string | null {
    const escapedChainId = chainId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const chainPattern = new RegExp(`(?:^|[,{\\n])\\s*["']?${escapedChainId}["']?\\s*:`, 'm')
    const chainMatch = chainPattern.exec(extraRpcsObjectLiteral)
    if (!chainMatch) return null

    let valueStart = chainMatch.index + chainMatch[0].length
    while (/\s/.test(extraRpcsObjectLiteral[valueStart] ?? '')) {
        valueStart++
    }

    if (extraRpcsObjectLiteral[valueStart] === '[') {
        return findBalancedSegment(extraRpcsObjectLiteral, valueStart, '[', ']')
    }

    if (extraRpcsObjectLiteral[valueStart] === '{') {
        const chainObjectLiteral = findBalancedSegment(extraRpcsObjectLiteral, valueStart, '{', '}')
        if (!chainObjectLiteral) return null

        const rpcsMatch = /\brpcs\s*:\s*/.exec(chainObjectLiteral)
        if (!rpcsMatch) return null

        let rpcsStart = rpcsMatch.index + rpcsMatch[0].length
        while (/\s/.test(chainObjectLiteral[rpcsStart] ?? '')) {
            rpcsStart++
        }

        if (chainObjectLiteral[rpcsStart] !== '[') return null
        return findBalancedSegment(chainObjectLiteral, rpcsStart, '[', ']')
    }

    return null
}

export function parseExtraRpcsFromChainlist(chainlistContent: string): Record<string, string[]> {
    const extraRpcsObjectLiteral = extractExtraRpcsObjectLiteral(chainlistContent)

    return TARGET_CHAIN_IDS.reduce<Record<string, string[]>>((acc, chainId) => {
        const rpcArrayLiteral = extractChainRpcArrayLiteral(extraRpcsObjectLiteral, chainId)
        if (!rpcArrayLiteral) return acc

        acc[chainId] = extractUrlsFromArrayLiteral(rpcArrayLiteral)
        return acc
    }, {})
}
