export const FALLBACK_RPCS_BY_CHAIN: Record<string, string[]> = {
    '1': ['https://eth.llamarpc.com', 'https://1rpc.io/eth'],
    '122': ['https://rpc.fuse.io'],
    '42220': ['https://forno.celo.org'],
    '50': ['https://rpc.xinfin.network'],
}

export function parseExtraRpcsFromChainlist(chainlistContent: string): Record<string, any> {
    const declarationIndex = chainlistContent.indexOf('export const extraRpcs')
    if (declarationIndex < 0) {
        throw new Error('Could not find extraRpcs export in chainlist')
    }

    const objectStart = chainlistContent.indexOf('{', declarationIndex)
    if (objectStart < 0) {
        throw new Error('Could not parse extraRpcs from chainlist')
    }

    let depth = 0
    let inSingleQuote = false
    let inDoubleQuote = false
    let inTemplate = false
    let inLineComment = false
    let inBlockComment = false
    let isEscaped = false
    let objectEnd = -1

    for (let i = objectStart; i < chainlistContent.length; i++) {
        const char = chainlistContent[i]
        const next = chainlistContent[i + 1]

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

        if (char === '{') {
            depth++
        } else if (char === '}') {
            depth--
            if (depth === 0) {
                objectEnd = i
                break
            }
        }
    }

    if (objectEnd < 0) {
        throw new Error('Could not parse extraRpcs object boundaries from chainlist')
    }

    const extraRpcsObjectLiteral = chainlistContent.slice(objectStart, objectEnd + 1)
    const privacyStatement = {}

    return eval(
        `(function() { const privacyStatement = ${JSON.stringify(
            privacyStatement
        )}; return ${extraRpcsObjectLiteral}; })()`
    ) as Record<string, any>
}
