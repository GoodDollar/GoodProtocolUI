import { addTransaction, replaceTransaction } from './actions'
import reducer from './reducer'
const receipt = {
    to: 'recipient',
    from: 'sender',
    contractAddress: '',
    transactionIndex: 0,
    blockHash: 'block',
    transactionHash: 'new',
    blockNumber: 8,
    status: 1,
}
describe('atomic replacement state', () => {
    for (const reason of ['repriced', 'cancelled', 'replaced'] as const)
        it(`replaces old queue entry for ${reason}`, () => {
            let state = reducer(
                undefined,
                addTransaction({
                    chainId: 1,
                    hash: 'old',
                    from: 'sender',
                    summary: 'Claim reward',
                    claim: { recipient: 'sender' },
                    approval: { tokenAddress: 'token', spender: 'spender' },
                })
            )
            state = reducer(
                state,
                replaceTransaction({
                    chainId: 1,
                    hash: 'old',
                    replacementHash: 'new',
                    receipt,
                    reason,
                    summary: 'Replacement',
                })
            )
            expect(state[1].old).toBeUndefined()
            expect(state[1].new.receipt?.transactionHash).toBe('new')
            expect(state[1].new.replacementReason).toBe(reason)
            expect(state[1].new.claim).toEqual(reason === 'repriced' ? { recipient: 'sender' } : undefined)
            expect(state[1].new.approval).toEqual(
                reason === 'repriced' ? { tokenAddress: 'token', spender: 'spender' } : undefined
            )
            expect(state[1].new.summary).toBe(reason === 'repriced' ? 'Claim reward' : 'Replacement')
            expect(
                reducer(state, replaceTransaction({ chainId: 1, hash: 'old', replacementHash: 'new', receipt, reason }))
            ).toBe(state)
        })
    it('preserves a replacement already tracked by its real hash', () => {
        let state = reducer(
            undefined,
            addTransaction({ chainId: 1, hash: 'old', from: 'sender', summary: 'Old summary' })
        )
        state = reducer(state, addTransaction({ chainId: 1, hash: 'new', from: 'sender', summary: 'Already tracked' }))
        state = reducer(
            state,
            replaceTransaction({ chainId: 1, hash: 'old', replacementHash: 'new', receipt, reason: 'repriced' })
        )
        expect(state[1].new.summary).toBe('Already tracked')
        expect(Object.keys(state[1])).toEqual(['new'])
    })
})
