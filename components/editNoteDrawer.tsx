import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
} from "@chakra-ui/react";
import useStore from "global-store/useStore";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import React from "react";
import { useForm } from "react-hook-form";
import { Note } from "types";
import MyInput from "./my-input";

interface Props {
  onSubmit: (data: IState) => void;
  onClose: () => void;
  isOpen: boolean;
  note?: Note;
}

interface IState {
  text: string;
  title: string;
  id: string;
}

const EditNoteDrawer: React.FC<Props> = ({
  onSubmit,
  note: selectedNote,
  isOpen,
  onClose,
}) => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      title: selectedNote?.title || "",
      text: selectedNote?.text || "",
    },
  });

  const { mutateAsync } = useTypeSafeMutation("updateNote");

  const handleOnSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      id: selectedNote?.id || "",
    });
  });

  console.log("selectedNote text drawer", selectedNote?.text);

  return (
    <Drawer placement={"right"} onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <form onSubmit={handleOnSubmit}>
          <DrawerHeader borderBottomWidth="1px">Edit Note</DrawerHeader>
          <DrawerBody h={"max-content"}>
            <Stack
              h={"full"}
              spacing="5"
              justify={"space-between"}
              direction={"column"}
            >
              <MyInput
                control={control}
                name={"title"}
                renderStyleProps={{
                  height: "40px",
                  width: "full",
                  placeholder: "Enter title",
                  variant: "flushed",
                }}
              />
              <MyInput
                control={control}
                name={"text"}
                renderStyleProps={{
                  height: "40px",
                  placeholder: "Enter note text",
                  width: "full",
                  variant: "flushed",
                }}
              />
            </Stack>
          </DrawerBody>
          <DrawerFooter borderBottomWidth={"1px"}>
            <Stack spacing={2} direction="row">
              <Button colorScheme={"red"} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme={"teal"}>
                Save
              </Button>
            </Stack>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default EditNoteDrawer;
