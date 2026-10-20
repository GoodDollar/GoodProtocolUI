import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import Updater from './updater'
import { PENDING_TIMEOUT_MS } from './lifecycle'
const mockDispatch = jest.fn()
const mockProvider = { getTransactionReceipt: jest.fn(), getTransaction: jest.fn(), getTransactionCount: jest.fn() }
const mockTransactions = { 1: { old: { hash: 'old', from: 'sender', addedTime: 0 } } }
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (read: any) => read({ transactions: mockTransactions }),
}))
jest.mock('@gooddollar/web3sdk-v2', () => ({ useWeb3Context: () => ({ web3Provider: mockProvider }) }), {
    virtual: true,
})
jest.mock('@reown/appkit/react', () => ({ useAppKitNetwork: () => ({ chainId: 1 }) }))
jest.mock('../application/hooks', () => ({ useAddPopup: () => jest.fn(), useBlockNumber: () => undefined }))
describe('pending UI expiration without new blocks', () => {
    it('removes pending state and its popup on the wall clock deadline', async () => {
        jest.useFakeTimers()
        const clock = jest.spyOn(Date, 'now').mockReturnValue(PENDING_TIMEOUT_MS - 100)
        mockProvider.getTransactionReceipt.mockResolvedValue(null)
        const container = document.createElement('div')
        const root = createRoot(container)
        try {
            flushSync(() => root.render(createElement(Updater)))
            expect(mockDispatch).not.toHaveBeenCalled()
            clock.mockReturnValue(PENDING_TIMEOUT_MS)
            jest.advanceTimersByTime(100)
            for (let i = 0; i < 12; i++) await Promise.resolve()
            expect(mockDispatch).toHaveBeenCalledWith({
                type: 'transactions/removeTransaction',
                payload: { chainId: 1, hash: 'old' },
            })
            expect(mockDispatch).toHaveBeenCalledWith({ type: 'application/removePopup', payload: { key: 'old' } })
        } finally {
            flushSync(() => root.unmount())
            clock.mockRestore()
            jest.useRealTimers()
        }
    })
})
