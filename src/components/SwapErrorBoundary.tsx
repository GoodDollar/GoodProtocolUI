import React from 'react'
import { Text, Button } from 'native-base'

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
    retryKey: number
}

export class SwapWidgetErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props)
        this.state = { hasError: false, error: null, retryKey: 0 }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error, retryKey: 0 }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('SwapWidget Error Boundary caught an error:', error, errorInfo)
    }

    handleRetry = () => {
        // Force remount by incrementing the key
        this.setState({ hasError: false, error: null, retryKey: this.state.retryKey + 1 })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid #ff6b6b',
                        borderRadius: '8px',
                        backgroundColor: '#fff5f5',
                        margin: '10px 0',
                    }}
                >
                    <Text fontSize="lg" color="red.500" mb={3}>
                        Swap Widget Error
                    </Text>
                    <Text fontSize="md" color="gray.600" mb={4}>
                        The swap widget encountered an error. This might be due to extreme price impact or insufficient
                        liquidity.
                    </Text>
                    <Button colorScheme="blue" size="sm" onPress={this.handleRetry}>
                        Try Again
                    </Button>
                </div>
            )
        }

        // Force remount by using key prop
        return React.cloneElement(this.props.children as React.ReactElement, { key: this.state.retryKey })
    }
}
