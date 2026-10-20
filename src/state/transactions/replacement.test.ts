import { checkPendingTransaction } from './lifecycle'
const amount = (n: number) => ({ toString: () => String(n) })
function fixture(reason = 'repriced', mined = 8, head = 10) {
    const original = { hash: 'old', from: '0xAA', nonce: 4, to: '0xBB', data: '0x1234', value: amount(7) }
    const candidate = {
        ...original,
        hash: 'new',
        ...(reason === 'cancelled'
            ? { to: '0xaa', data: '0x', value: amount(0) }
            : reason === 'replaced'
            ? { to: '0xCC' }
            : {}),
    }
    const receipt = { transactionHash: 'new', blockNumber: mined, status: 1 }
    const provider = {
        getTransactionReceipt: jest.fn(async (hash: string) => (hash === 'new' ? receipt : null)),
        getTransaction: jest.fn(async () => original),
        getTransactionCount: jest.fn(async (_from: string, tag: number | 'latest') =>
            tag === 'latest' || tag >= mined ? 5 : 4
        ),
        getBlockNumber: jest.fn(async () => head),
        getBlockWithTransactions: jest.fn(async () => ({ transactions: [{ ...candidate, nonce: 3 }, candidate] })),
    }
    return { provider, receipt }
}
describe('replacement receipt discovery', () => {
    for (const reason of ['repriced', 'cancelled', 'replaced'])
        it(`tracks ${reason} under the real hash`, async () => {
            const { provider, receipt } = fixture(reason)
            expect(await checkPendingTransaction(provider, 'old', 0, 1)).toEqual({
                replacement: { hash: 'new', receipt, reason },
            })
            expect(provider.getBlockWithTransactions).toHaveBeenCalledWith(8)
        })
    it('locates an older nonce transition without assuming a recent block', async () => {
        const { provider } = fixture('repriced', 800, 1024)
        const result = await checkPendingTransaction(provider, 'old', 0, 1)
        expect(result).toHaveProperty('replacement.hash', 'new')
        expect(provider.getBlockWithTransactions).toHaveBeenCalledWith(800)
        expect(provider.getTransactionCount.mock.calls.length).toBeLessThan(25)
    })
    it('keeps an incomplete or reorganized replacement pending', async () => {
        const { provider } = fixture()
        provider.getTransactionReceipt.mockImplementation(async () => null)
        expect(await checkPendingTransaction(provider, 'old', 0, 1)).toEqual({ pending: true })
    })
    it('rejects a receipt from a different block', async () => {
        const { provider } = fixture()
        provider.getTransactionReceipt.mockImplementation(async (hash: string) =>
            hash === 'new' ? { transactionHash: 'new', blockNumber: 9, status: 1 } : null
        )
        expect(await checkPendingTransaction(provider, 'old', 0, 1)).toEqual({ pending: true })
    })
    it('does not accept an unrelated sender or nonce as replacement', async () => {
        const { provider } = fixture()
        provider.getBlockWithTransactions.mockResolvedValue({
            transactions: [{ hash: 'other', from: 'foreign', nonce: 4, to: '', data: '', value: amount(0) }],
        })
        expect(await checkPendingTransaction(provider, 'old', 0, 1)).toEqual({ pending: true })
    })
})
