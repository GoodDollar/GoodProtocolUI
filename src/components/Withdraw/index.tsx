import React, { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { WithdrawStyled } from 'components/Withdraw/styled'
import Modal from 'components/Modal'
import { ReactComponent as CrossSVG } from 'assets/images/x.svg'
import Title from 'components/gd/Title'
import { ButtonAction } from 'components/gd/Button'
import { ReactComponent as LinkSVG } from 'assets/images/link-blue.svg'
import PercentInputControls from 'components/Withdraw/PercentInputControls'
import Button from 'components/Button'
import { MyStake, withdraw } from '../../sdk/staking'
import useWeb3 from '../../hooks/useWeb3'
import { addTransaction } from '../../state/transactions/actions'
import { useDispatch } from 'react-redux'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { TransactionDetails } from '../../sdk/constants/transactions'
import { getExplorerLink } from '../../utils'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { getSimpleStakingContractAddresses, simpleStakingContract } from 'sdk/contracts/SimpleStakingContract'
import { Currency, CurrencyAmount, Fraction } from '@uniswap/sdk-core'
import Switch from 'components/Switch'
import { TokenMaps } from 'sdk/constants/tokens'
import { getTokenByAddress } from 'sdk/methods/tokenLists'
import { useTokenContract } from 'hooks/useContract'

function formatNumber(value: number) {
    return Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 4 }).format(value)
}

interface WithdrawProps {
    token: string
    protocol: string
    open: boolean
    setOpen: (value: boolean) => void
    onWithdraw: () => void
    stake: MyStake
}

type WithdrawState = 'none' | 'pending' | 'success'

function Withdraw({ token, protocol, open, setOpen, onWithdraw, stake, ...rest }: WithdrawProps) {
    const { i18n } = useLingui()
    const [status, setStatus] = useState<WithdrawState>('none')
    const totalStake = useMemo(() => parseFloat(stake.stake.amount.toExact()), [stake])
    const [withdrawInInterestToken, setWithdrawInInterestToken] = useState(false)
    const web3 = useWeb3()
    const [percentage, setPercentage] = useState<string>('50')
    const [withdrawAmount, setWithdrawAmount] = useState<number>(totalStake * (Number(percentage) / 100))
    const { chainId } = useActiveWeb3React()
    if (web3 && chainId) {
        const c = simpleStakingContract(web3, stake.address)
        // console.log(stake.tokens)
    console.log(c.methods)
        console.log(
            c.methods
                .iToken()
                .call()
                .then((address: string) => {
                    console.log(address)
                    console.log(getTokenByAddress(web3, address))
                })
        )
        console.log(
            c.methods
                .iTokenWorthInToken(1)
                .call()
                .then((value: string) => {
                    console.log(CurrencyAmount.fromRawAmount(TokenMaps.CDAI[chainId], value).toExact(), 'Stas')
                })
        )
        console.log(
            c.methods
                .iTokenWorthInToken(1)
                .call()
                .then((value: string) => {
                    console.log(stake.tokens.B.name?.toUpperCase() as keyof typeof TokenMaps)
                    console.log(
                        CurrencyAmount.fromRawAmount(
                            TokenMaps[stake.tokens.B.symbol?.toUpperCase() as keyof typeof TokenMaps][
                                chainId
                            ] as Currency,
                            value
                        ).toExact()
                    )
                })
        )
    }
    useEffect(() => {
        setWithdrawAmount(totalStake * (Number(percentage) / 100))
    }, [percentage])
    const dispatch = useDispatch()
    const [transactionHash, setTransactionHash] = useState<string>()
    const handleWithdraw = useCallback(async () => {
        if (!web3) return
        try {
            setStatus('pending')
            const transactionDetails = await withdraw(
                web3,
                stake,
                percentage,
                withdrawInInterestToken,
                transactionHash => {
                    setTransactionHash(transactionHash)
                    setStatus('success')
                }
            )
            dispatch(
                addTransaction({
                    chainId: chainId!,
                    hash: transactionDetails.transactionHash,
                    from: transactionDetails.from
                })
            )
            onWithdraw()
        } catch (e) {
            console.error(e)
            setStatus('none')
        }
    }, [setStatus, onWithdraw, percentage])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

    useEffect(() => {
        if (open) setPercentage('50')
        if (open && status !== 'none') {
            setStatus('none')
            setTransactionHash(undefined)
        }
    }, [open])
    console.log(withdrawInInterestToken)
    return (
        <Modal isOpen={open} noPadding onDismiss={handleClose}>
            <WithdrawStyled {...rest}>
                <div className='flex flex-grow justify-end'>
                    <CrossSVG className='cursor-pointer' onClick={handleClose} />
                </div>
                {status === 'none' || status === 'pending' ? (
                    <>
                        <Title className='flex flex-grow justify-center pt-3 pb-3'>{i18n._(t`Withdraw`)}</Title>
                        <div className='details-row flex justify-between'>
                            <div>{i18n._(t`Token`)}</div>
                            <div>{token}</div>
                        </div>
                        <div className='details-row flex justify-between'>
                            <div>{i18n._(t`Protocol`)}</div>
                            <div>{protocol}</div>
                        </div>
                        <div className='details-row flex justify-between'>
                            <div>{i18n._(t`Total stake`)}</div>
                            <div>{`${formatNumber(totalStake)} ${token}`}</div>
                        </div>

                        <div>{String(withdrawInInterestToken)}</div>
                        <div className='horizontal mt-4 mb-2' />
                        <Switch checked={withdrawInInterestToken} onChange={setWithdrawInInterestToken} />
                        <PercentInputControls
                            value={percentage}
                            onPercentChange={setPercentage}
                            disabled={status === 'pending'}
                        />
                        <div className='flex flex-col items-center gap-1 relative mt-7'>
                            <p className='warning text-center mb-2 text-red'>
                                {i18n._(t`Withdrawing your stake will reset your multiplier.`)}
                            </p>
                            <ButtonAction className='withdraw' disabled={status === 'pending'} onClick={handleWithdraw}>
                                {status === 'pending'
                                    ? i18n._(t`PENDING SIGN...`)
                                    : `${i18n._(t`WITHDRAW`)} ${formatNumber(withdrawAmount)} ${token.toUpperCase()}`}
                            </ButtonAction>
                            {status === 'pending' && (
                                <p className='pending-hint'>You need to sign the transaction in your wallet</p>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Title className='flex flex-grow justify-center pt-3'>{i18n._(t`Success!`)}</Title>
                        <div className='flex justify-center items-center gap-2 pt-7 pb-7'>
                            {i18n._(t`Transaction was sent to the blockchain`)}{' '}
                            <a
                                href={
                                    transactionHash &&
                                    chainId &&
                                    getExplorerLink(chainId, transactionHash, 'transaction')
                                }
                                target='_blank'
                                rel='noreferrer'
                            >
                                <LinkSVG className='cursor-pointer' />
                            </a>
                        </div>
                        <div className='flex justify-center'>
                            <Button className='back-to-portfolio' onClick={handleClose}>
                                {i18n._(t`Back to portfolio`)}
                            </Button>
                        </div>
                    </>
                )}
            </WithdrawStyled>
        </Modal>
    )
}

export default memo(Withdraw)
