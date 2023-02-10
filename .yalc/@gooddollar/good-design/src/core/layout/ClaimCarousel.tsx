import { FlatList, View, Box, useBreakpointValue } from "native-base";
import React, { FC, memo, useCallback, useState, useMemo } from "react";
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { IClaimCard } from "../buttons";
import ClaimCard from "./ClaimCard";

interface ClaimCarouselProps {
  cards: Array<IClaimCard>;
  claimed?: boolean;
}

interface SlideMarkProps {
  isActive: boolean;
  isLast: boolean;
}

const SlideMark: FC<SlideMarkProps> = memo(({ isActive, isLast }) => (
  <View h="1" w="5" bg={isActive ? "main" : "grey"} mr={isLast ? "0" : "2"} borderRadius={2} />
));

const ClaimCardItem: FC<{ item: IClaimCard; index: number }> = ({ item, index }) => {
  return <ClaimCard key={index} {...item} />;
};

const SlidesComponent = memo(
  ({ activeSlide, slidesNumber, data }: { activeSlide: number; slidesNumber: number; data: IClaimCard[] }) => (
    <>
      {Array(slidesNumber)
        .fill(0)
        .map((_, index, arr) => (
          <SlideMark key={data[index]?.id} isActive={index === activeSlide} isLast={index === arr.length - 1} />
        ))}
    </>
  )
);

const getItemLayout = (_: IClaimCard[] | null | undefined, index: number) => ({
  index,
  length: 275,
  offset: (275 + 20) * index
});

const Separator = () => <View w="5" />;

const ClaimCarousel: FC<ClaimCarouselProps> = ({ cards, claimed }) => {
  const [slidesNumber, setSlidesNumber] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const activeCards = useMemo(() => cards.filter(card => !card.hide), [cards, claimed]);
  const containerWidth = useBreakpointValue({
    base: "350px",
    xl: "500px"
  });
  const listWidth = useBreakpointValue({
    base: "auto",
    xl: claimed ? "auto" : activeCards.length * 275
  });

  const onFlatListLayoutChange = useCallback(
    (event: LayoutChangeEvent) => {
      const contentWidth = activeCards.length * 275 + (activeCards.length - 1) * 20;

      if (event.nativeEvent.layout.width >= contentWidth) {
        setSlidesNumber(0);
        return;
      }

      setSlidesNumber(Math.ceil((contentWidth - event.nativeEvent.layout.width + 36) / (275 + 20)));
    },
    [activeCards, setSlidesNumber]
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offSetX = event.nativeEvent.contentOffset.x;
      const currentSlide = Math.floor(offSetX / (275 + (offSetX === 0 ? 20 : -20)));

      if (activeSlide === currentSlide) return;

      setActiveSlide(currentSlide);
    },
    [activeSlide, setActiveSlide]
  );

  return (
    <Box w={containerWidth}>
      <FlatList
        data={activeCards}
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={16}
        ml={5}
        h="425"
        w={listWidth}
        showsHorizontalScrollIndicator={false}
        onLayout={onFlatListLayoutChange}
        getItemLayout={getItemLayout}
        renderItem={ClaimCardItem}
        ItemSeparatorComponent={Separator}
        pagingEnabled
      />

      <View flexDirection="row" w="full" pt="5" justifyContent="center">
        <SlidesComponent data={activeCards} activeSlide={activeSlide} slidesNumber={slidesNumber} />
      </View>
    </Box>
  );
};

export default ClaimCarousel;
