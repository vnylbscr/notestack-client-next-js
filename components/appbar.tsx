import { MoonIcon, SearchIcon, SunIcon } from "@assets/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import useSearchStore from "global-store/useSearchStore";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useQueryClient } from "react-query";
import { FONT_FAMILY } from "./headingWithCustomFont";
const iconSettings = {
  width: 20,
  height: 20,
};

const Appbar: React.FC = ({}) => {
  const { toggleColorMode } = useColorMode();
  const { setSearchValue, addSearchHistory, searchHistory, searchValue } =
    useSearchStore();
  // const debouncedValue = useDebounce(searchValue.trim(), 1000);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { mutateAsync } = useTypeSafeMutation("logout");
  const client = useQueryClient();

  useEffect(() => {
    const cmdK = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
      }
      if (e.metaKey && e.key === "Backspace" && searchValue.length === 0) {
        router.back();
      }
      if (e.metaKey && e.key === ",") {
        router.push("/shortcuts");
      }
      if (e.metaKey && e.key === "b") {
        toggleColorMode();
      }
    };

    document.addEventListener("keydown", cmdK);

    return () => {
      document.removeEventListener("keydown", cmdK);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleLogout = () => {
    mutateAsync([], {}).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      client.clear();
    });
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      width="100%"
      zIndex={100}
      padding={4}
      bgColor={useColorModeValue("blue.200", "blue.800")}
      position="sticky"
      top={"0"}
    >
      <Flex align="center" mr={5}>
        <Link passHref={true} href="/">
          <Button
            variant={"outline"}
            fontSize={"xl"}
            fontFamily={FONT_FAMILY.BEBAS_NEUE}
          >
            {" "}
            Notestack.{" "}
          </Button>
        </Link>
      </Flex>

      <Flex width={"4xl"}>
        <InputGroup size={"md"}>
          <Input
            placeholder="Search your notes ⌘ + K"
            onChange={handleSearch}
            variant="filled"
            size="lg"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchValue.trim().length > 0) {
                addSearchHistory(searchValue);
                router.push({
                  pathname: "/search",
                  query: { q: searchValue.trim() },
                });
                setSearchValue("");
              }
            }}
          />

          <AnimatePresence>
            {searchValue.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <InputRightElement
                  display={"flex"}
                  justifyContent="center"
                  alignItems={"center"}
                  width="10rem"
                >
                  <Button
                    colorScheme={"gray"}
                    variant="solid"
                    h="2rem"
                    w="8rem"
                    size="md"
                    mt={2}
                    mr="4"
                    px="2"
                    leftIcon={<SearchIcon width={25} height={25} />}
                    onClick={() => {
                      router.push({
                        pathname: "/search",
                        query: { q: searchValue.trim() },
                      });
                      addSearchHistory(searchValue);
                      setSearchValue("");
                    }}
                  >
                    Search
                  </Button>
                </InputRightElement>
              </motion.div>
            )}
          </AnimatePresence>
        </InputGroup>
      </Flex>

      <Box>
        <Stack direction={"row"}>
          <IconButton
            aria-label="Toggle theme"
            colorScheme={useColorModeValue("purple", "yellow")}
            icon={useColorModeValue(
              <MoonIcon {...iconSettings} />,
              <SunIcon {...iconSettings} />
            )}
            onClick={toggleColorMode}
          />

          <Link href={"/shortcuts"} passHref>
            <Button colorScheme={"teal"}>Shortcuts</Button>
          </Link>

          <Button onClick={handleLogout} colorScheme={"red"}>
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Logout button */}
    </Flex>
  );
};

export default Appbar;
