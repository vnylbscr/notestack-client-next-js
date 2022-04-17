import { Flex, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import HeadingWithCustomFont from "./headingWithCustomFont";

const FooterText = () => {
  return (
    <Flex
      bgColor={useColorModeValue("blue.200", "blue.800")}
      justify={"center"}
      alignItems={"center"}
      p={4}
      direction="column"
      gap={"1rem"}
      height="100px"
    >
      <HeadingWithCustomFont fontSize="xl">
        Copyright {new Date().getFullYear()} NoteStack.{" "}
      </HeadingWithCustomFont>
      <Stack>
        <Link
          target={"_blank"}
          color={"whiteAlpha.600"}
          href="https://github.com"
        >
          Contribute on Github
        </Link>
      </Stack>
    </Flex>
  );
};

export default FooterText;
