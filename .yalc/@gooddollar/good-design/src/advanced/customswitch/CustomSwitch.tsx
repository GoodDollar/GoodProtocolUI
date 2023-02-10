import React, { useState, useCallback } from 'react'
import { Pressable, Icon, View, Box } from 'native-base'
import { first } from 'lodash'
import SelectBox from './SelectBox'
// import SwitchIcon from ' ../../assets/svg/arrow-swap.svg'

const SwitchIcon = () => (
  <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
    <path d="m5 10.0909h14l-5.8396-5.0909" stroke="#B0B4BB"/>
    <path d="m19 13.9091h-14l5.8396 5.0909" stroke="#B0B4BB"/>
  </g>
)

const SelectListItem = (
  {
    chain,
    onPress,
    isListItem,
    isListOpen,
    isLeft,
  }: {
    chain: string | undefined,
    onPress: ((isLeft: boolean) => void) | ((isLeft: boolean, chain: string) => void)
    isListItem: boolean,
    isListOpen: boolean,
    isLeft: boolean,    
  }) => {
  const type = isListItem ? "list" : "button"
  const onItemPress = useCallback(() => onPress(isLeft, chain ?? ''), [chain, onPress]);
  return (
    <SelectBox variant={type} text={chain ?? ''} press={onItemPress} isListItem={isListItem} isListOpen={isListOpen} />
  )
}

//todo: add icon list (optional)
export const CustomSwitch = ({list, switchListCb}:{list:string[], switchListCb: () => void}) => {
  const [showListLeft, setShowListLeft] = useState<any>(false)
  const [showListRight, setShowListRight] = useState<any>(false)

  const [sourceList, setSourceList] = useState<string[]>(list);
  const [targetList, setTargetList] = useState<string[]>(() => list.slice().reverse());

  const toggleList = useCallback((left: boolean) => {
    const side = {
      show: left ? showListLeft : showListRight,
      dispatch: left ? setShowListLeft : setShowListRight
    }
    side.dispatch(!side.show)
  }, [showListLeft, showListRight])

  const switchSelect = () => {
    setSourceList(targetList);
    setTargetList(sourceList);
    switchListCb();
  }

  const selectFromList = (isLeft: boolean, chain: string) => {
    const sides = [sourceList, targetList]
    const selectedSide = isLeft ? sides.splice(0, 1)[0] : sides.splice(1,1)[0]
    const altSide = sides[0]
    const listNumber = selectedSide.indexOf(chain)
    const selected = selectedSide.splice(listNumber, listNumber)[0]
    selectedSide.unshift(selected);
    if (altSide.indexOf(chain) === 0) {
      const altSelected = altSide.splice(listNumber, listNumber)[0]
      altSide.unshift(altSelected)
    }
    toggleList(isLeft);
    switchListCb(); //Todo: refactor to handle list with more then 2 values
  }

  const onUncheckList = useCallback((isLeft) => toggleList(isLeft), [toggleList])
  const onUncheckItem = useCallback((isLeft, chain) => selectFromList(isLeft, chain), [toggleList, selectFromList]) 

  return (
    <View height="16" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-start">
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        {
          sourceList.map((chain, listNumber) => (
            <SelectListItem
              key={chain}
              chain={!listNumber ? first(sourceList) : chain}
              isListOpen={showListLeft}
              isLeft={true}
              onPress={!listNumber ? onUncheckList : onUncheckItem}
              isListItem={listNumber !== 0}
            />
          ))
        }
      </Box>
      <Box w="100px" height="64px" pl="3" pr="3" display="flex" justifyContent={"center"} alignItems="center">
        <Pressable onPress={switchSelect}>
          <Icon
            minWidth="8"
            size="xl"
            w="6"
            h="6"
            display="flex"
            alignSelf="center"
            justifyItems="center"
            pl="1.5"
            fill="none"
            viewBox="0 0 24 24">
              <SwitchIcon />
            </Icon>
        </Pressable>
      </Box>
      <Box display="flex" alignItems="center" justifyContent={"center"} flexDirection="column">
        {
          targetList.map((chain, listNumber) => (
            <SelectListItem
              key={chain}
              chain={!listNumber ? first(targetList) : chain}
              isListOpen={showListRight}
              isLeft={false}
              onPress={!listNumber ? onUncheckList : onUncheckItem}
              isListItem={!!listNumber}
            />
          ))
        }
      </Box>
    </View>
  )
}