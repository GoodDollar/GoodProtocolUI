import React, { FC } from 'react'
import { withTheme } from '../../theme'
import {Pressable, ChevronDownIcon, Text} from 'native-base'
import FuseIcon from '../../assets/svg/fuse.svg'
import CeloIcon from '../../assets/svg/celo.svg'

type SelectBoxProps = {
  text: string,
  press: () => void,
  isListItem: boolean,
  isListOpen: boolean,
  variant?: string,
}
// TODO: make imports from .svg work
const IconList: { [key: string]: string; } = {
  "Fuse": FuseIcon,
  "Celo": CeloIcon
}

const SelectBox: FC<SelectBoxProps> = withTheme({ name: "SelectBox" })
  (({ text, press, isListItem, ...props }) => (
      <Pressable onPress={press} {...props}>
      {/* Temp workaround for loading the network svg icons */}
      <img src={IconList[text]} style={{
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: "30px",
        height: '48px',
        paddingLeft: '10px'
      }} />
      <Text
        textAlign="center"
        fontSize="lg"
        ml="0" w="105%"
        alignSelf="center"
        display="flex"
        pl="2"
        fontWeight="thin"
        fontFamily="subheading"
        selectable={false}>
          {text}
      </Text>
      {!isListItem && (
        <ChevronDownIcon
          mr="0"
          ml="5"
          size="xl"
          display="flex"
          alignSelf="center"
          justifySelf="flex-end"
          marginRight="0" />
    )}
    </Pressable>
  ))

  export default SelectBox