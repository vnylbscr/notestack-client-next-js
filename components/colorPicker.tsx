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
  useDisclosure,
} from "@chakra-ui/react";
import { COLORS } from "@lib/constants";
import { getEnumKeyByEnumValue } from "@lib/utilFunctions";
import React from "react";

type Props = {
  onSelect: (color: string) => void;
  color: string;
  fullWidth?: boolean;
};

// create an array of colors value
const colors = Object.values(COLORS);

const ColorPickerInput: React.FC<Props> = ({ onSelect, color, fullWidth }) => {
  const { isOpen, onToggle, onClose } = useDisclosure({
    defaultIsOpen: false,
  });
  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger>
        <Box>
          <Button
            aria-label={color}
            background={color}
            height="42px"
            width={fullWidth ? "100%" : "42px"}
            padding={0}
            minWidth="unset"
            borderRadius={3}
            onClick={onToggle}
            _hover={{
              bg: color,
              opacity: 0.8,
            }}
          />
          <Text textAlign={"center"} fontSize={"xs"} mt={fullWidth ? "4" : "0"}>
            {getEnumKeyByEnumValue(COLORS, color)}
          </Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow bg={color} />
        <PopoverCloseButton onClick={onClose} color="white" />
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
                  onToggle();
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
