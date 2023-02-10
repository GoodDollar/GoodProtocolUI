import { noop } from "lodash";
import { Box, Button, Modal as NBModal, useColorModeValue, useBreakpointValue } from "native-base";
import React, { FC, ReactNode, useCallback } from "react";

export interface BasicModalProps {
  modalVisible: boolean;
  header?: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  actionText?: string;
  closeText?: string;
  hasCloseButton?: boolean;
  hasTopBorder?: boolean;
  hasBottomBorder?: boolean;
  onClose?: () => void;
  onAction?: () => void;
  _modal?: any;
  _body?: any;
  _footer?: any;
  _header?: any;
}

const BasicModal: FC<BasicModalProps> = ({
  modalVisible,
  header,
  body,
  footer,
  actionText,
  closeText = "Cancel",
  hasCloseButton = !!closeText,
  hasTopBorder = true,
  hasBottomBorder = true,
  onClose = noop,
  onAction = noop,
  _modal = {},
  _header = {},
  _body = {},
  _footer = {}
}) => {
  const onActionButtonPress = useCallback(() => {
    onAction();
    onClose();
  }, [onAction, onClose]);

  const bgContent = useColorModeValue("white", "mainDarkContrast");
  const bgOverlay = useColorModeValue("mainDarkContracts:alpha.40", "white:alpha.40");
  const width = useBreakpointValue({
    base: 288,
    md: "initial"
  });
  const height = useBreakpointValue({
    base: 424,
    md: "initial"
  });

  const actionButton = actionText ? <Button onPress={onActionButtonPress}>{actionText}</Button> : <React.Fragment />;
  return (
    /* height 100vh is required so modal always shows in the middle */
    <NBModal isOpen={modalVisible} onClose={onClose} {..._modal} minH="100vh" bgColor={bgOverlay}>
      <Box bgColor={bgContent} borderRadius="lg" h={height} width={width}>
        <NBModal.Content w={"100%"}>
          {hasCloseButton && <NBModal.CloseButton />}
          {!!header && (
            <NBModal.Header
              style={{
                paddingLeft: 18,
                paddingRight: 18,
                paddingTop: 24
              }}
              borderBottomWidth={hasTopBorder ? "px" : "0"}
              {..._header}
            >
              {header}
            </NBModal.Header>
          )}
          <Box borderWidth="1" borderColor="borderGrey" width="90%" alignSelf="center" />
          <NBModal.Body {..._body}>{body}</NBModal.Body>
          {(!!footer || !!closeText || !!actionText) && (
            <NBModal.Footer borderTopWidth={hasBottomBorder ? "px" : "0"} {..._footer}>
              {footer}
              <Button.Group space={2}>
                {closeText ? (
                  <Button variant="ghost" colorScheme="blueGray" onPress={onClose}>
                    {closeText}
                  </Button>
                ) : (
                  <></>
                )}
                {actionButton}
              </Button.Group>
            </NBModal.Footer>
          )}
        </NBModal.Content>
      </Box>
    </NBModal>
  );
};

export default BasicModal;
