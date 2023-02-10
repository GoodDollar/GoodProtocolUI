import { Text, View, Box } from "native-base";
import React, { FC } from "react";
import { ClaimCardContent, ArrowButton } from "../buttons";
import { Image } from "../images";
import { openLink } from "@gooddollar/web3sdk-v2";
import Title from "./Title";
interface ClaimCardProps {
  bgColor: string;
  title: {
    text: string;
    color: string;
  };
  content?: ClaimCardContent[];
}

const ClaimCard: FC<ClaimCardProps> = ({ content, title, bgColor }) => {
  return (
    <View
      shadow="1"
      w="240"
      h="423"
      bg={bgColor}
      borderRadius={30}
      flex={1}
      justifyContent={content?.length !== 1 ? "space-between" : undefined}
      flexDirection="column"
      alignItems="center"
      px="17"
      py="6"
    >
      <Title fontSize="xl" lineHeight="36" fontWeight="bold" fontFamily="heading" color={title.color}>
        {title.text}
      </Title>

      {content?.map((contentItem, index) => (
        <Box key={index}>
          {!!contentItem.description && (
            <Text
              color={contentItem.description.color}
              fontSize="15"
              fontFamily="subheading"
              fontWeight="normal"
              pt="4"
              pb="30"
            >
              {contentItem.description.text}
            </Text>
          )}

          {!!contentItem.imageUrl && (
            <Image source={{ uri: contentItem.imageUrl }} w="208" h="178" borderRadius={10} alt="GoodDollar" />
          )}

          {!!contentItem.link && (
            <ArrowButton
              text={contentItem.link.linkText}
              onPress={() => contentItem.link && openLink(contentItem.link.linkUrl)}
            />
          )}

          {!!contentItem.list && (
            <View pt="30" textAlign="center">
              {contentItem.list?.map(({ id, key, value }, index, list) => (
                <Text
                  key={id}
                  color="goodGrey.500"
                  bold
                  fontSize="16"
                  fontFamily="subheading"
                  fontWeight="normal"
                  display="flex"
                  justifyContent="center"
                  flexDirection="column"
                  pb={index === list.length - 1 ? "0" : "5"}
                >
                  {key} <Text color="primary">{value}</Text>
                </Text>
              ))}
            </View>
          )}
        </Box>
      ))}
    </View>
  );
};

export default ClaimCard;
