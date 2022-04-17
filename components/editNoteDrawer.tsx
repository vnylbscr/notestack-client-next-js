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
import ColorPickerInput from "./colorPicker";
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
  color: string;
}

const EditNoteDrawer: React.FC<Props> = ({
  onSubmit,
  note: selectedNote,
  isOpen,
  onClose,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: selectedNote?.title || "",
      text: selectedNote?.text || "",
      color: selectedNote?.color || "",
    },
  });

  const { mutateAsync } = useTypeSafeMutation("updateNote");

  const handleOnSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      id: selectedNote?.id || "",
    });
    onClose();
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

              <ColorPickerInput
                onSelect={(color) => {
                  setValue("color", color);
                }}
                color={watch("color")}
                fullWidth
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
