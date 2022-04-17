import { Heading, HeadingProps } from "@chakra-ui/react";
import React from "react";

interface Props extends HeadingProps {}

export const FONT_FAMILY = {
  BEBAS_NEUE: "'Bebas Neue', cursive",
  ROBOTO: "'Roboto', sans-serif",
  SHADOWS_INTO_LIGHT: "'Shadows Into Light', cursive",
  INDIE_FLOWER: "'Indie Flower', cursive",
  SECULAR_ONE: "'Secular One', sans-serif",
};

const HeadingWithCustomFont = (props: Props) => {
  return (
    <Heading fontFamily={FONT_FAMILY.BEBAS_NEUE} {...props}>
      {props.children}
    </Heading>
  );
};

export default HeadingWithCustomFont;
