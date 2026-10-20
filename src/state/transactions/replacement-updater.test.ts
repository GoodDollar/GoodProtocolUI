import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import Updater from './updater'
const mockDispatch = jest.fn(),
    mockPopup = jest.fn()
let mockBlock: number | undefined = 10
const mockProvider = {
    getTransactionReceipt: jest.fn(),
    getTransaction: jest.fn(),
    getTransactionCount: jest.fn(),
    getBlockNumber: jest.fn(),
    getBlockWithTransactions: jest.fn(),
}
const mockTransactions: Record<number, Record<string, any>> = { 1: {} }
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (read: any) => read({ transactions: mockTransactions }),
}))
jest.mock('@gooddollar/web3sdk-v2', () => ({ useWeb3Context: () => ({ web3Provider: mockProvider }) }), {
    virtual: true,
})
jest.mock('@reown/appkit/react', () => ({ useAppKitNetwork: () => ({ chainId: 1 }) }))
jest.mock('../application/hooks', () => ({ useAddPopup: () => mockPopup, useBlockNumber: () => mockBlock }))
jest.mock('@lingui/core', () => ({ i18n: { _: (id: string) => id } }))
const value = (n: number) => ({ toString: () => String(n) })
const receipt = {
    transactionHash: 'new',
    blockHash: 'block8',
    blockNumber: 8,
    status: 1,
    from: 'sender',
    to: 'recipient',
    transactionIndex: 0,
    contractAddress: '',
}
async function renderAndFlush() {
    const root = createRoot(document.createElement('div'))
    flushSync(() => root.render(createElement(Updater)))
    for (let i = 0; i < 80; i++) await Promise.resolve()
    return root
}
beforeEach(() => {
    jest.clearAllMocks()
    mockBlock = 10
    mockTransactions[1] = { old: { hash: 'old', from: 'sender', addedTime: Date.now(), summary: 'Claim reward' } }
})
describe('replacement UI notifications', () => {
    for (const cancelled of [false, true])
        it(`records the real replacement and clears old popup (cancelled=${cancelled})`, async () => {
            const original = { hash: 'old', from: 'sender', nonce: 4, to: 'recipient', data: '0x1234', value: value(7) }
            const candidate = {
                ...original,
                hash: 'new',
                ...(cancelled ? { to: 'sender', data: '0x', value: value(0) } : {}),
            }
            mockProvider.getTransactionReceipt.mockImplementation(async (hash: string) =>
                hash === 'new' ? receipt : null
            )
            mockProvider.getTransaction.mockResolvedValue(original)
            mockProvider.getTransactionCount.mockImplementation(async (_from: string, tag: number | 'latest') =>
                tag === 'latest' || tag >= 8 ? 5 : 4
            )
            mockProvider.getBlockNumber.mockResolvedValue(10)
            mockProvider.getBlockWithTransactions.mockResolvedValue({ transactions: [candidate] })
            const root = await renderAndFlush()
            try {
                expect(mockDispatch).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'transactions/replaceTransaction',
                        payload: expect.objectContaining({
                            hash: 'old',
                            replacementHash: 'new',
                            reason: cancelled ? 'cancelled' : 'repriced',
                            receipt,
                        }),
                    })
                )
                expect(mockDispatch).toHaveBeenCalledWith({ type: 'application/removePopup', payload: { key: 'old' } })
                expect(mockPopup).toHaveBeenCalledTimes(1)
                expect(mockPopup).toHaveBeenCalledWith(
                    {
                        txn: {
                            hash: 'new',
                            success: !cancelled,
                            summary: cancelled ? 'Transaction cancelled' : 'Claim reward',
                        },
                    },
                    'new'
                )
            } finally {
                flushSync(() => root.unmount())
            }
        })
    it('does not duplicate a replacement notification already confirmed in the store', async () => {
        const original = { hash: 'old', from: 'sender', nonce: 4, to: 'recipient', data: '0x', value: value(7) }
        mockTransactions[1].new = { hash: 'new', from: 'sender', addedTime: 0, receipt }
        mockProvider.getTransactionReceipt.mockImplementation(async (hash: string) => (hash === 'new' ? receipt : null))
        mockProvider.getTransaction.mockResolvedValue(original)
        mockProvider.getTransactionCount.mockImplementation(async (_f: string, tag: number | 'latest') =>
            tag === 'latest' || tag >= 8 ? 5 : 4
        )
        mockProvider.getBlockNumber.mockResolvedValue(10)
        mockProvider.getBlockWithTransactions.mockResolvedValue({ transactions: [{ ...original, hash: 'new' }] })
        const root = await renderAndFlush()
        try {
            expect(mockPopup).not.toHaveBeenCalled()
        } finally {
            flushSync(() => root.unmount())
        }
    })
    it('finalizes a normal receipt found by the deadline timer even without blocks', async () => {
        jest.useFakeTimers()
        const clock = jest.spyOn(Date, 'now').mockReturnValue(1800000)
        mockBlock = undefined
        mockTransactions[1].old.addedTime = 0
        mockProvider.getTransactionReceipt.mockResolvedValue({ ...receipt, transactionHash: 'old' })
        const root = await renderAndFlush()
        try {
            jest.advanceTimersByTime(0)
            for (let i = 0; i < 40; i++) await Promise.resolve()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'transactions/finalizeTransaction' })
            )
            expect(mockPopup).toHaveBeenCalledTimes(1)
        } finally {
            flushSync(() => root.unmount())
            clock.mockRestore()
            jest.useRealTimers()
        }
    })
})
