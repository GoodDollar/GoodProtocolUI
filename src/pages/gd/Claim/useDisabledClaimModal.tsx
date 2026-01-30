import React, { useCallback, useMemo, useState } from 'react'
import { Image, Title } from '@gooddollar/good-design'
import { Box, Text, View } from 'native-base'

import Maintance from 'assets/images/claim/maintance.png'

const DialogHeader = () => (
    <Box>
        <Title color="main" fontSize="l" lineHeight={36}>
            Claiming Unavailable
        </Title>
    </Box>
)

const DialogBody = ({ message }: { message: string }) => (
    <View>
        <Image resizeMode="contain" source={{ uri: Maintance }} w="auto" h={120} mb={4} />
        <Text fontFamily="subheading" lineHeight="20px">
            {message}
        </Text>
    </View>
)

export const useDisabledClaimingModal = (message: string) => {
    const [open, setOpen] = useState(false)

    const showModal = useCallback(() => setOpen(true), [])

    const Dialog = useMemo(() => {
        const DisabledClaimOverlay = () => {
            if (!open) return null

            return (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    zIndex={50}
                    pointerEvents="auto"
                    bg="black:alpha.40"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={4}
                >
                    <Box bg="white" borderRadius={16} padding={5} maxW={'343px'} width="100%" shadow={9}>
                        <DialogHeader />
                        <Box mt={4}>
                            <DialogBody message={message} />
                        </Box>
                    </Box>
                </Box>
            )
        }

        return DisabledClaimOverlay
    }, [open, message])

    return { Dialog, showModal }
}
