import { ChainId } from '@sushiswap/sdk'
import { addTransaction, finalizeTransaction, removeTransaction } from './actions'
import reducer from './reducer'

describe('remove pending transaction', () => {
    it('removes only the requested chain and hash', () => {
        let state = reducer(undefined, addTransaction({ chainId: ChainId.MAINNET, hash: 'old', from: 'sender' }))
        state = reducer(state, addTransaction({ chainId: ChainId.MAINNET, hash: 'other', from: 'sender' }))
        state = reducer(state, removeTransaction({ chainId: ChainId.MAINNET, hash: 'old' }))
        expect(state[ChainId.MAINNET].old).toBeUndefined()
        expect(state[ChainId.MAINNET].other).toBeDefined()
        expect(reducer(state, removeTransaction({ chainId: ChainId.MAINNET, hash: 'missing' }))).toBe(state)
    })
    it('does not remove a receipt if a late timeout races confirmation', () => {
        let state = reducer(undefined, addTransaction({ chainId: ChainId.MAINNET, hash: 'old', from: 'sender' }))
        state = reducer(
            state,
            finalizeTransaction({
                chainId: ChainId.MAINNET,
                hash: 'old',
                receipt: {
                    to: 'to',
                    from: 'sender',
                    contractAddress: '',
                    transactionIndex: 0,
                    blockHash: 'block',
                    transactionHash: 'old',
                    blockNumber: 1,
                    status: 1,
                },
            })
        )
        expect(
            reducer(state, removeTransaction({ chainId: ChainId.MAINNET, hash: 'old' }))[ChainId.MAINNET].old.receipt
        ).toBeDefined()
    })
})
