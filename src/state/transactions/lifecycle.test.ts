import { checkPendingTransaction, PENDING_TIMEOUT_MS } from './lifecycle'

describe('pending transaction lifecycle', () => {
    const provider = () => ({ getTransactionReceipt: jest.fn().mockResolvedValue(null), getTransaction: jest.fn().mockResolvedValue({from:'sender',nonce:4}), getTransactionCount: jest.fn().mockResolvedValue(4) })
    it('keeps an unmined transaction before timeout', async () => { expect(await checkPendingTransaction(provider(),'hash',100,101)).toEqual({pending:true}) })
    it('expires at the exact timeout boundary', async () => { expect(await checkPendingTransaction(provider(),'hash',100,100+PENDING_TIMEOUT_MS)).toEqual({dismissed:'timeout'}) })
    it('keeps a real receipt even after the timeout', async () => { const p=provider();p.getTransactionReceipt.mockResolvedValue({status:1});expect(await checkPendingTransaction(p,'hash',0,PENDING_TIMEOUT_MS)).toEqual({receipt:{status:1}}) })
    it('removes a replaced or cancelled nonce only once mined', async () => { const p=provider();p.getTransactionCount.mockResolvedValue(5);expect(await checkPendingTransaction(p,'hash',0,1)).toEqual({dismissed:'replaced'});expect(p.getTransactionCount).toHaveBeenCalledWith('sender','latest') })
    it('rechecks receipts to avoid racing the original transaction mining', async () => { const p=provider();p.getTransactionCount.mockResolvedValue(5);p.getTransactionReceipt.mockResolvedValueOnce(null).mockResolvedValueOnce({status:1});expect(await checkPendingTransaction(p,'hash',0,1)).toEqual({receipt:{status:1}}) })
    it('does not treat a missing transaction or RPC failure as replacement', async () => { const p=provider();p.getTransaction.mockResolvedValue(null);expect(await checkPendingTransaction(p,'hash',0,1)).toEqual({pending:true});p.getTransactionReceipt.mockRejectedValue(new Error('offline'));await expect(checkPendingTransaction(p,'hash',0,1)).rejects.toThrow('offline');expect(await checkPendingTransaction(p,'hash',0,PENDING_TIMEOUT_MS)).toEqual({dismissed:'timeout'}) })
    it('expires local pending UI even when the receipt RPC hangs', async () => {
        jest.useFakeTimers()
        try {
            const p=provider();p.getTransactionReceipt.mockImplementation(() => new Promise(() => {}))
            const result=checkPendingTransaction(p,'hash',0,PENDING_TIMEOUT_MS)
            jest.advanceTimersByTime(10_000)
            await expect(result).resolves.toEqual({dismissed:'timeout'})
        } finally { jest.useRealTimers() }
    })})

