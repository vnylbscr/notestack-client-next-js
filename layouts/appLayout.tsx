import { Box } from "@chakra-ui/react";
import Appbar from "@components/appbar";
import FooterText from "@components/footerText";
import Head from "next/head";
import React from "react";

const AppLayout: React.FC<{
  title?: string;
  isLoggedIn: boolean;
  showFooter?: boolean;
}> = ({ children, title, isLoggedIn, showFooter = true }) => {
  return (
    <Box as="main" pb={1}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Notestack. " />
        <meta name="author" content="NoteStack" />
        <meta
          name="author"
          content="Mert Genç Developer Computer Engineer Programmer Full Stack Developer"
        />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@notestack" />
        <meta name="twitter:creator" content="@notestack" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/card.png" />
        <title>NoteStack. {title} </title>
      </Head>
      {isLoggedIn && <Appbar />}
      {children}
      {showFooter && <FooterText />}
    </Box>
  );
};

export default AppLayout;
