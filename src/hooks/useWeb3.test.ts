import fs from 'fs'
import path from 'path'
import * as ts from 'typescript'

describe('Web3 provider wiring', () => {
    it('transpiles the provider with the QA-aware opening and closing component tags', () => {
        const source = fs.readFileSync(path.join(__dirname, 'useWeb3.tsx'), 'utf8')
        const result = ts.transpileModule(source, {
            fileName: 'useWeb3.tsx',
            reportDiagnostics: true,
            compilerOptions: {
                jsx: ts.JsxEmit.ReactJSX,
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ESNext,
            },
        })
        const errors = (result.diagnostics || []).filter(
            (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
        )

        expect(errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))).toEqual([])
        expect(source).toContain('<QaAwareWeb3Provider')
        expect(source).toContain('</QaAwareWeb3Provider>')
        expect(source).toContain('qa={{ forceTradeLimits: forceTradeLimitsQa }}')
    })
})
