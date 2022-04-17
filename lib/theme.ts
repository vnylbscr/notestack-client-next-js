import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { FONT_FAMILY } from "@components/headingWithCustomFont";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  // fonts: {
  //   heading: FONT_FAMILY.SECULAR_ONE,
  //   body: FONT_FAMILY.SECULAR_ONE,
  // },
});

export default theme;
