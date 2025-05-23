import { Placement } from '@popperjs/core'
import Portal from '@reach/portal'
import { transparentize } from 'polished'
import React, { useCallback, useState } from 'react'
import { usePopper } from 'react-popper'
import styled from 'styled-components'
import useInterval from '../../hooks/useInterval'

const PopoverContainer = styled.div<{ show: boolean }>`
    z-index: 9999;

    visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
    opacity: ${(props) => (props.show ? 1 : 0)};
    transition: visibility 150ms linear, opacity 150ms linear;

    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.9, theme.shadow1)};
    color: ${({ theme }) => theme.text2};
    background-color: ${({ theme }) => theme.color.main};
    border: 1px solid ${({ theme }) => theme.color.border2};
    border-radius: 8px;
`

const ReferenceElement = styled.div`
    display: inline-block;
`

const Arrow = styled.div`
    width: 8px;
    height: 8px;
    z-index: 9998;

    ::before {
        position: absolute;
        width: 8px;
        height: 8px;
        z-index: 9998;

        content: '';
        transform: rotate(45deg);
        background-color: ${({ theme }) => theme.color.main};
        border: 1px solid ${({ theme }) => theme.color.border2};
    }

    &.arrow-top {
        bottom: -5px;
        ::before {
            border-top: none;
            border-left: none;
        }
    }

    &.arrow-bottom {
        top: -5px;
        ::before {
            border-bottom: none;
            border-right: none;
        }
    }

    &.arrow-left {
        right: -5px;

        ::before {
            border-bottom: none;
            border-left: none;
        }
    }

    &.arrow-right {
        left: -5px;
        ::before {
            border-right: none;
            border-top: none;
        }
    }
`

export interface PopoverProps {
    content: React.ReactNode
    show: boolean
    children: React.ReactNode
    placement?: Placement
    offset?: [number, number]
}

export default function Popover({ content, show, children, placement = 'auto', offset = [8, 8] }: PopoverProps) {
    const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
    const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
    const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
    const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
        placement,
        strategy: 'fixed',
        modifiers: [
            { name: 'offset', options: { offset } },
            { name: 'arrow', options: { element: arrowElement } },
        ],
    })
    const updateCallback = useCallback(() => {
        update && void update()
    }, [update])
    useInterval(updateCallback, show ? 100 : null)

    return (
        <>
            <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
            <Portal>
                <PopoverContainer
                    show={show}
                    ref={setPopperElement as any}
                    style={styles.popper}
                    {...attributes.popper}
                >
                    {content}
                    <Arrow
                        className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
                        ref={setArrowElement as any}
                        style={styles.arrow}
                        {...attributes.arrow}
                    />
                </PopoverContainer>
            </Portal>
        </>
    )
}
