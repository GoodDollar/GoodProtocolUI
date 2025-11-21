import { useAppKitAccount } from '@reown/appkit/react'
import Jazzicon from 'jazzicon'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

const StyledIdenticonContainer = styled.div`
    height: 1rem;
    width: 1rem;
    border-radius: 1.125rem;
    background-color: ${({ theme }) => theme.bg4};
`

export default function Identicon() {
    const ref = useRef<HTMLDivElement>()

    const { address } = useAppKitAccount()

    useEffect(() => {
        if (address && ref.current) {
            ref.current.innerHTML = ''
            ref.current.appendChild(Jazzicon(16, parseInt(address.slice(2, 10), 16)))
        }
    }, [address])

    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    return <StyledIdenticonContainer ref={ref as any} />
}
