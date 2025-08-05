import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Text, Button, Box } from 'native-base'
import { classifySwapError } from '../utils/swapErrors'

function SwapErrorFallback({ resetErrorBoundary, error }: { error: Error; resetErrorBoundary: () => void }) {
    const { message } = classifySwapError(error?.message || 'Unknown error')
    return (
        <Box
            padding="20px"
            textAlign="center"
            borderWidth="1px"
            borderColor="#ff6b6b"
            borderRadius="8px"
            backgroundColor="#fff5f5"
            margin="10px 0"
        >
            <Text fontSize="lg" color="red.500" mb={3}>
                Swap Widget Error
            </Text>
            <Text fontSize="md" color="gray.600" mb={4}>
                The swap widget encountered an error. This might be due to extreme price impact or insufficient
                liquidity.
            </Text>
            <Text fontSize="sm" color="red.400" mb={4}>
                {message}
            </Text>
            <Button colorScheme="blue" size="sm" onPress={resetErrorBoundary}>
                Try Again
            </Button>
        </Box>
    )
}

export function SwapWidgetErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary
            FallbackComponent={SwapErrorFallback}
            onError={(error, errorInfo) => {
                console.error('SwapWidget Error Boundary caught an error:', error, errorInfo)
            }}
        >
            {children}
        </ErrorBoundary>
    )
}
