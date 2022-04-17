import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  Link as ChakraLink,
  Stack,
} from "@chakra-ui/react";
import HeadingWithCustomFont from "@components/headingWithCustomFont";
import AppLayout from "@layouts/appLayout";
import { REGEX } from "@lib/constants";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MyInput from "../components/my-input";
import LoginRegisterLayout from "../layouts/login-register-layout";
import { RegisterState } from "../types";

const RegisterPage = () => {
  const { mutateAsync, isLoading, error } = useTypeSafeMutation("register");
  const { control, handleSubmit, watch } = useForm<RegisterState>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmitForm = handleSubmit((data) => {
    mutateAsync([data])
      .then((res) => {
        setMessage("Submit successfull. You redirect to the login page.");
        setTimeout(() => {
          router.push({
            pathname: "/login",
          });
        }, 3000);
      })
      .catch((err) => {
        console.log("err", err);
      });
  });

  return (
    <AppLayout isLoggedIn={false} title={"Register"} showFooter={false}>
      <LoginRegisterLayout>
        <HeadingWithCustomFont mb={4} textAlign={"center"} color={"white"}>
          Welcome to Notestack.
        </HeadingWithCustomFont>
        <form onSubmit={onSubmitForm}>
          <Stack spacing={3}>
            <MyInput
              control={control}
              name={"email"}
              rules={{
                required: "This field is required",
                pattern: {
                  message: "Please provide a valid email address.",
                  value: REGEX.EMAIL,
                },
              }}
              renderStyleProps={{
                placeholder: "E-mail",
                variant: "flushed",
              }}
            />
            <MyInput
              control={control}
              name={"username"}
              rules={{
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Your name must be at least 5 characters",
                },
              }}
              renderStyleProps={{
                placeholder: "Username",
                variant: "flushed",
              }}
            />
            <MyInput
              control={control}
              name={"password"}
              rules={{
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Your password must be at least 5 characters",
                },
              }}
              renderStyleProps={{
                placeholder: "Password",
                variant: "flushed",
                type: "password",
              }}
            />
            <MyInput
              control={control}
              name={"passwordConfirm"}
              rules={{
                required: "This field is required",
                validate: (value) => {
                  return (
                    value === watch("password") || "Does not match passwords"
                  );
                },
              }}
              renderStyleProps={{
                placeholder: "Password confirm",
                variant: "flushed",
                type: "password",
              }}
            />

            <Button isLoading={isLoading} type={"submit"} colorScheme={"teal"}>
              Register
            </Button>
            <Heading py={2} textAlign={"center"} fontSize={"sm"}>
              You already have an account?{" "}
              <Link passHref href={"/login"}>
                <ChakraLink color={"teal"}>Login</ChakraLink>
              </Link>
            </Heading>
          </Stack>
          {error && (
            <Alert mt={4} borderRadius={4} color={"black"} status="error">
              <AlertIcon />
              Something went wrong
            </Alert>
          )}
          {message && (
            <Alert mt={4} borderRadius={4} color={"black"} status="success">
              <AlertIcon />
              {message}
            </Alert>
          )}
        </form>
      </LoginRegisterLayout>
    </AppLayout>
  );
};

export default RegisterPage;
