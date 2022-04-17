import {
  Button,
  Container,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import AnimationPageLayout from "@layouts/animation-layout";
import AppLayout from "@layouts/appLayout";
import Link from "next/link";
import React from "react";

type Props = {};

const ShortcutsPage = (props: Props) => {
  return (
    <AppLayout isLoggedIn title={"Shortcuts"}>
      <AnimationPageLayout>
        <Container maxW={"container.xl"} h="100vh">
          <Stack justify={"center"} mt="14" align="center">
            <Table variant="simple">
              <TableCaption>Shortcuts for App</TableCaption>
              <Thead>
                <Tr>
                  <Th>DESCRIPTION</Th>
                  <Th>SHORTCUT</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Search notes</Td>
                  <Td>⌘ + K</Td>
                </Tr>
                <Tr>
                  <Td>Go Back </Td>
                  <Td>⌘ + ⌫</Td>
                </Tr>
                <Tr>
                  <Td>Add new Note (only homepage) </Td>
                  <Td>⌘ + Enter</Td>
                </Tr>
                <Tr>
                  <Td>Go to shortcuts page</Td>
                  <Td>⌘ + ,</Td>
                </Tr>
                <Tr>
                  <Td>Toggle theme</Td>
                  <Td>⌘ + B</Td>
                </Tr>
              </Tbody>
            </Table>
            <Button colorScheme={"messenger"}>
              <Link href={"/"} passHref>
                Go Back
              </Link>
            </Button>
          </Stack>
        </Container>
      </AnimationPageLayout>{" "}
    </AppLayout>
  );
};

export default ShortcutsPage;
