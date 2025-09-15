import React, { useEffect, useState } from 'react'
import { Box, HStack, Circle, Text } from 'native-base'

export type BuyStep = 1 | 2 | 3

interface BuyProgressBarProps {
    currentStep: BuyStep
    isLoading?: boolean
}

const BuyProgressBar: React.FC<BuyProgressBarProps> = ({ currentStep, isLoading = false }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0)

    const steps = [
        { number: 1, label: 'Buy cUSD' },
        { number: 2, label: 'We swap cUSD to G$' },
        { number: 3, label: 'Done' },
    ]

    // Handle animated progress line
    useEffect(() => {
        if (isLoading && currentStep > 1) {
            // Explicitly reset animatedWidth to 0 at the start of a new loading phase
            setAnimatedWidth(0)
            // Animate progress line when loading
            let progress = 0
            const interval = setInterval(() => {
                progress += 2
                if (progress <= 100) {
                    setAnimatedWidth(progress)
                } else {
                    clearInterval(interval)
                }
            }, 50) // 50ms intervals for smooth animation

            return () => clearInterval(interval)
        } else {
            // Set to 100% if not loading (completed state)
            setAnimatedWidth(100)
        }
    }, [isLoading, currentStep])

    const getStepStatus = (stepNumber: number) => {
        // Step 1 should ALWAYS be blue (active when current, completed when past)
        if (stepNumber === 1) {
            if (currentStep === 1) {
                return isLoading ? 'loading' : 'active'
            } else {
                return 'completed' // Step 1 is completed when we're on step 2 or 3
            }
        }
        // Steps 2 and 3 follow normal logic
        if (stepNumber < currentStep) return 'completed'
        if (stepNumber === currentStep) return isLoading ? 'loading' : 'active'
        return 'pending'
    }

    const getCircleProps = (status: string) => {
        const baseProps = {
            size: '12',
            mb: 2,
            justifyContent: 'center',
            alignItems: 'center',
        }

        switch (status) {
            case 'completed':
                return { ...baseProps, bg: 'blue.500' }
            case 'active':
                return { ...baseProps, bg: 'blue.500' }
            case 'loading':
                return {
                    ...baseProps,
                    bg: 'blue.500',
                    borderWidth: 3,
                    borderColor: 'blue.200',
                    animation: 'pulse 2s infinite',
                }
            default:
                return { ...baseProps, bg: 'gray.300' }
        }
    }

    const getLineProps = (stepNumber: number, lineIndex: number) => {
        // Line between step 1 and 2 (lineIndex = 0)
        if (lineIndex === 0) {
            if (currentStep === 1 && isLoading) {
                // Animation state: "1 Blue with progress bar animation"
                return {
                    bg: 'blue.500',
                    width: `${animatedWidth}%`,
                    transition: 'width 0.1s ease-out',
                }
            } else if (currentStep >= 2) {
                // Static line when step 2 or higher
                return {
                    bg: 'blue.500',
                    width: '100%',
                }
            }
        }

        // Line between step 2 and 3 (lineIndex = 1)
        if (lineIndex === 1) {
            if (currentStep === 2 && isLoading) {
                // Animation state: "2 Blue with progress bar animation"
                return {
                    bg: 'blue.500',
                    width: `${animatedWidth}%`,
                    transition: 'width 0.1s ease-out',
                }
            } else if (currentStep >= 3) {
                // Static line when step 3
                return {
                    bg: 'blue.500',
                    width: '100%',
                }
            }
        }

        // Default: gray line (not active)
        return {
            bg: 'gray.300',
            width: '100%',
        }
    }

    const getTextColor = (status: string) => {
        return status === 'pending' ? 'gray.500' : 'black'
    }

    return (
        <Box width="100%" mb={6} mt={4} data-testid="custom-progress-bar">
            <HStack justifyContent="space-between" alignItems="flex-start" position="relative">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.number)

                    return (
                        <React.Fragment key={step.number}>
                            <Box alignItems="center" flex={1} position="relative">
                                <Circle {...getCircleProps(status)}>
                                    <Text color="white" fontWeight="bold" fontSize="md">
                                        {step.number}
                                    </Text>
                                </Circle>
                                <Text
                                    textAlign="center"
                                    fontSize="sm"
                                    color={getTextColor(status)}
                                    fontFamily="subheading"
                                    maxWidth="120px"
                                    lineHeight="tight"
                                >
                                    {step.label}
                                </Text>
                            </Box>

                            {index < steps.length - 1 && (
                                <Box
                                    position="absolute"
                                    top="6"
                                    left={`${33.33 * (index + 1) - 16.67}%`}
                                    right={`${66.67 - 33.33 * (index + 1) + 16.67}%`}
                                    height="2px"
                                    bg="gray.300"
                                    zIndex={-1}
                                >
                                    <Box height="100%" {...getLineProps(step.number + 1, index)} borderRadius="1px" />
                                </Box>
                            )}
                        </React.Fragment>
                    )
                })}
            </HStack>
        </Box>
    )
}

export { BuyProgressBar }
