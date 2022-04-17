import {
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { COLORS } from "@lib/constants";
import { getEnumKeyByEnumValue } from "@lib/utilFunctions";
import React from "react";

type Props = {
  onSelect: (color: string) => void;
  color: string;
};

// create an array of colors value
const colors = Object.values(COLORS);

const ColorPickerInput: React.FC<Props> = ({ onSelect, color }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Box>
          <Button
            aria-label={color}
            background={color}
            height="42px"
            width="42px"
            padding={0}
            minWidth="unset"
            borderRadius={3}
          />
          <Text textAlign={"center"} fontSize={"xs"}>
            {getEnumKeyByEnumValue(COLORS, color)}
          </Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow bg={color} />
        <PopoverCloseButton color="white" />
        <PopoverHeader
          height="100px"
          backgroundColor={color}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
          color="white"
        >
          <Center height="100%" flexDirection={"column"}>
            <Text fontWeight={"bold"}>
              {getEnumKeyByEnumValue(COLORS, color)}
            </Text>
            {color}
          </Center>
        </PopoverHeader>
        <PopoverBody height="70px">
          <SimpleGrid columns={4} spacing={3}>
            {colors.map((c) => (
              <Button
                key={c}
                aria-label={c}
                background={c}
                height="22px"
                width="22px"
                padding={0}
                minWidth="unset"
                borderRadius={3}
                _hover={{ background: c }}
                onClick={() => {
                  onSelect(c);
                }}
              ></Button>
            ))}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPickerInput;
