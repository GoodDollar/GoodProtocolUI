import React from 'react'
import styled from 'styled-components'

const AppNoticeBanner = styled.div`
    display: flex;
    padding-top: 20px;
    padding-left: 10px;
    padding-bottom: 20px;
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-style: normal;
    text-decoration: none;
    color: #0c263d;
    border-radius: 10px;
    background-color: #00b0ff;
    color: white;
    justify-content: center;

    @media only screen and (max-width: 600px) {
        font-size: 13px;
        padding-left: 0;
        padding-bottom: 10px;
        line-height: 1.2;
        text-align: center;
        white-space: break-spaces;
        a {
            text-align: center;
        }
        div {
            width: 180px;
        }
    }
`

const AppNoticeLink = styled.a`
    color: blue;
`

export type AppNoticeProps = {
    text: any
    bg?: string
    link?: string
    show?: boolean
    onClick?: () => void
}

function AppNotice(props: AppNoticeProps): JSX.Element {
    // const learnMore = isMobile ? <span>{" "}{" "} Learn more here.</span> : ' Learn more here. '
    return (
        <>
            {props.show && (
                <AppNoticeBanner
                    className="mobile"
                    style={{ backgroundColor: props.bg, marginBottom: '12px' }}
                    onClick={props.onClick}
                >
                    <div>
                        <span
                            style={{
                                color: '#42454A',
                            }}
                        >
                            {props.text}
                        </span>
                        {props.link && (
                            <AppNoticeLink href={props.link} target="_blank" rel="noreferrer">
                                {' '}
                                Learn more.
                            </AppNoticeLink>
                        )}
                    </div>
                </AppNoticeBanner>
            )}
        </>
    )
}

export default AppNotice
