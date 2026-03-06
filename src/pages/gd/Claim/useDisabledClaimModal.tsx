import { useCallback, useState } from 'react'
import { Title } from '@gooddollar/good-design'
import { Box, Text } from 'native-base'

import Maintance from 'assets/images/claim/maintance.png'

export const useDisabledClaimingModal = (message: string) => {
    const [isVisible, setIsVisible] = useState(false)

    const showModal = useCallback(() => setIsVisible(true), [])

    const Dialog = useCallback(() => {
        if (!isVisible) return null

        return (
            <Box
                position="absolute"
                top={0}
                bottom={0}
                left={0}
                right={0}
                zIndex={50}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="2xl"
            >
                <Box bg="white" p={6} borderRadius="xl" alignItems="center" shadow={3} w="90%" maxW="320px">
                    <Title color="main" fontSize="l" lineHeight={36} mb={2}>
                        Claiming Unavailable
                    </Title>
                    <img
                        src={Maintance}
                        alt="Maintenance"
                        style={{ height: '120px', objectFit: 'contain', marginBottom: '16px' }}
                    />
                    <Text fontFamily="subheading" lineHeight="20px" textAlign="center" color="gray.600">
                        {message || 'Claiming is temporarily disabled.'}
                    </Text>
                </Box>
            </Box>
        )
    }, [isVisible, message])

    return { Dialog, showModal }
}
