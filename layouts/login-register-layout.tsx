import { BackgroundProps, Container, Flex, Text } from "@chakra-ui/react";
import HeadingWithCustomFont from "@components/headingWithCustomFont";
import React from "react";

const LoginRegisterLayout: React.FC<{
  bgColor?: Pick<BackgroundProps, "background">;
}> = ({ children }) => {
  return (
    <Flex
      h={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      color={"white"}
      backgroundSize={"cover"}
      bgImage={"https://wallpapercave.com/wp/wp9160786.jpg"}
      direction="column"
      gap={"16px"}
    >
      <Container
        borderRadius={"md"}
        maxW={"lg"}
        p={"12"}
        backdropFilter="blur(20px)"
        style={{
          borderImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.1) 100%) 1 1",
          borderStyle: "solid",
          borderWidth: "3px",
        }}
      >
        {children}
      </Container>
      <HeadingWithCustomFont fontWeight={"bold"} textAlign="center">
        Notestack. {new Date().getFullYear()}
      </HeadingWithCustomFont>
    </Flex>
  );
};

export default LoginRegisterLayout;
