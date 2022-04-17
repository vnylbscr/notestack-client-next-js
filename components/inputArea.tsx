import {
  Button,
  Collapse,
  InputGroup,
  InputRightElement,
  Spinner,
  Textarea,
  useOutsideClick,
} from "@chakra-ui/react";
import { COLORS } from "@lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ColorPickerInput from "./colorPicker";
import MyInput from "./my-input";

interface IState {
  text: string;
  title: string;
  color: string;
}

type Props = {
  onSubmit: (data: IState) => void;
  isLoading?: boolean;
};

const InputArea: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, reset, setValue, watch } = useForm<IState>({
    defaultValues: {
      title: "",
      text: "",
      color: "#A0AEC0",
    },
  });
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useOutsideClick({
    ref: inputRef,
    handler: () => setFocused(false),
  });

  const onSubmitForm = handleSubmit(async (data) => {
    onSubmit(data);
    reset({
      text: "",
      title: "",
      color: COLORS.BLUE,
    });
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        onSubmitForm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmitForm]);

  if (isLoading) {
    return <Spinner size={"lg"} />;
  }

  return (
    <div ref={inputRef} style={{ width: "100%" }}>
      <form onSubmit={onSubmitForm} style={{ width: "100%" }}>
        {
          <Collapse in={focused} animateOpacity={true}>
            <MyInput
              control={control}
              name={"title"}
              renderStyleProps={{
                width: "full",
                height: "40px",
                fontSize: 20,
                placeholder: "Enter title",
                variant: "flushed",
                onFocus: () => setFocused(true),
                maxLength: 40,
              }}
              showWarningText={false}
            />
          </Collapse>
        }

        <Controller
          control={control}
          name={"text"}
          rules={{
            required: true,
            validate: (value) => {
              return !!value.trim();
            },
          }}
          render={({ field }) => {
            return (
              <InputGroup mt={2}>
                <Textarea
                  width={"full"}
                  fontSize={28}
                  size="md"
                  placeholder="What needs to be done?"
                  variant="flushed"
                  onFocus={() => setFocused(true)}
                  resize="none"
                  maxW={watch("text").trim().length > 0 ? "92%" : "100%"}
                  style={{
                    transition: "max-width 0.2s ease-in-out",
                  }}
                  {...field}
                />
                <AnimatePresence>
                  {watch("text").trim().length > 0 && (
                    <motion.section
                      initial={{
                        opacity: 0,
                        y: -100,
                        marginLeft: "auto",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -100,
                      }}
                    >
                      <InputRightElement h="full" mr={"6"} mt="2">
                        <ColorPickerInput
                          color={watch("color")}
                          onSelect={(color) => {
                            setValue("color", color, { shouldValidate: true });
                          }}
                        ></ColorPickerInput>
                      </InputRightElement>
                    </motion.section>
                  )}
                </AnimatePresence>
              </InputGroup>
            );
          }}
        />

        <Button
          fontSize={"xl"}
          my={4}
          type={"submit"}
          colorScheme="teal"
          isFullWidth
        >
          Add
        </Button>
      </form>
    </div>
  );
};

export default InputArea;
