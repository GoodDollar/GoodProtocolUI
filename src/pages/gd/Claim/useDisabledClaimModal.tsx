import React, { useCallback } from 'react'
import { Image, Title, useModal } from '@gooddollar/good-design'
import { Box, Text, View } from 'native-base'
import { noop } from 'lodash'

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
    const { Modal, showModal } = useModal()

    const Dialog = useCallback(
        () => (
            <React.Fragment>
                <Modal
                    _modalContainer={{ paddingLeft: 18, paddingRight: 18, paddingBottom: 18 }}
                    header={<DialogHeader />}
                    body={<DialogBody message={message} />}
                    onClose={noop}
                    closeText="x"
                />
            </React.Fragment>
        ),
        [Modal]
    )

    return { Dialog, showModal }
}
