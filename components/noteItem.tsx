import { CheckIcon, DeleteIcon, EditIcon } from "@assets/icons";
import {
  Button,
  Flex,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import React, { useCallback } from "react";
import TimeAgo from "timeago-react";
import { Note } from "types";
type NoteFunc = (id: string) => void;

type Props = {
  note: Note;
  onDeleted?: NoteFunc;
  onCompleted?: NoteFunc;
  onEdited?: NoteFunc;
  isOpen?: boolean;
  showEditButton?: boolean;
};

const NoteItem: React.FC<Props> = ({
  note,
  onCompleted,
  onDeleted,
  onEdited,
  showEditButton = true,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  const iconSettings = {
    width: 20,
    height: 20,
  };

  const handleOnDelete = useCallback(() => {
    onDeleted?.(note.id);
  }, [note.id, onDeleted]);

  const handleOnEdit = useCallback(() => {
    onEdited?.(note.id);
  }, [note.id, onEdited]);

  const handleOnComplete = useCallback(() => {
    onCompleted?.(note.id);
  }, [note.id, onCompleted]);

  return (
    <AnimateSharedLayout>
      <Stack
        borderColor={"#aaa"}
        border={"1px"}
        p={4}
        direction={"column"}
        my={4}
        borderRadius={4}
        w={"100%"}
        onClick={() => {
          onToggle();
        }}
        maxHeight={"100%"}
        cursor="pointer"
        _hover={{
          boxShadow: `0px 0px 3px ${useColorModeValue("#000", "#fff")}`,
        }}
        bgColor={note.color}
        color="#fff"
      >
        <Flex align={"center"} gap={isOpen ? "10px" : undefined}>
          <Flex align={"center"} width={"100%"} justify="space-between">
            <Text
              isTruncated={isOpen ? false : true}
              fontWeight={"bold"}
              fontSize={"lg"}
              textDecoration={note.completed ? "line-through" : "none"}
            >
              {note?.title || "Untitled Note"}
            </Text>
            <Tooltip
              placement={"top"}
              label={new Date(note.createdAt).toString()}
              openDelay={500}
            >
              <Text fontSize={"sm"} colorScheme="gray">
                <TimeAgo datetime={note.createdAt} locale="en" />
              </Text>
            </Tooltip>
          </Flex>
          <AnimatePresence>
            {isOpen && showEditButton && (
              <motion.section
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: {
                    opacity: 1,
                    marginLeft: "0px",
                  },
                  collapsed: {
                    opacity: 0,
                    marginLeft: "-10%",
                  },
                }}
                transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <Tooltip
                  openDelay={500}
                  placement={"top"}
                  colorScheme="cyan"
                  label={"Edit"}
                >
                  <IconButton
                    icon={<EditIcon width={15} height={15} />}
                    aria-label="Edit"
                    size={"xs"}
                    colorScheme="teal"
                    onClick={handleOnEdit}
                  />
                </Tooltip>
              </motion.section>
            )}
          </AnimatePresence>
        </Flex>
        <Text
          textDecoration={note.completed ? "line-through" : "none"}
          noOfLines={isOpen ? undefined : 3}
          fontSize={"md"}
        >
          {note.text}
        </Text>
        <AnimatePresence>
          {isOpen && (
            <motion.section
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.2,
                },
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <Flex
                gap={"12px"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                mt="4"
              >
                {!note.completed && (
                  <Button
                    onClick={handleOnComplete}
                    leftIcon={<CheckIcon {...iconSettings} />}
                    isFullWidth={true}
                    colorScheme={"telegram"}
                  >
                    Complete
                  </Button>
                )}

                <Button
                  onClick={handleOnDelete}
                  isFullWidth={true}
                  colorScheme={"red"}
                  leftIcon={<DeleteIcon {...iconSettings} />}
                >
                  Delete
                </Button>
              </Flex>
            </motion.section>
          )}
        </AnimatePresence>
      </Stack>
    </AnimateSharedLayout>
  );
};

export default NoteItem;
