import React, { Component, ErrorInfo, ReactNode } from 'react'
import { WALLET_CONFIG } from '../utils/walletConfig'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class WalletErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Wallet Error Boundary caught an error:', error, errorInfo)

        // Log to analytics or error reporting service
        if (typeof window !== 'undefined' && (window as any).gtag) {
            ;(window as any).gtag('event', 'exception', {
                description: `Wallet Error: ${error.message}`,
                fatal: false,
            })
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div
                        style={{
                            padding: '20px',
                            textAlign: 'center',
                            border: '1px solid #ff6b6b',
                            borderRadius: '8px',
                            backgroundColor: '#fff5f5',
                            margin: '20px',
                        }}
                    >
                        <h3 style={{ color: '#d63031', marginBottom: '10px' }}>Wallet Connection Error</h3>
                        <p style={{ color: '#636e72', marginBottom: '15px' }}>
                            {WALLET_CONFIG.ERROR_MESSAGES.CONNECTION_FAILED}
                        </p>
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined })}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#00b894',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )
            )
        }

        return this.props.children
    }
}
