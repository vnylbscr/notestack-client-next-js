import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  Link as ChakraLink,
  Stack,
} from "@chakra-ui/react";
import HeadingWithCustomFont from "@components/headingWithCustomFont";
import MyInput from "@components/my-input";
import AppLayout from "@layouts/appLayout";
import LoginRegisterLayout from "@layouts/login-register-layout";
import { END_POINT, REGEX } from "@lib/constants";
import axios from "axios";
import cookie from "cookie";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { LoginState } from "types";

const LoginPage = () => {
  const { mutateAsync, isLoading, error, data } = useTypeSafeMutation("login");
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<LoginState>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitForm = handleSubmit(async (data) => {
    mutateAsync([data])
      .then(({ data: { user } }) => {
        localStorage.setItem("user", JSON.stringify(user));
        const returnUrl = (router.query.returnUrl || "/") as string;
        router.push(returnUrl);
      })
      .catch((err) => {
        console.log("error", err.message);
        reset({ email: "", password: "" });
      });
  });

  return (
    <AppLayout title={"Login"} showFooter={false} isLoggedIn={false}>
      <LoginRegisterLayout>
        <Fragment>
          <HeadingWithCustomFont
            mb={4}
            fontSize={"3xl"}
            textAlign={"center"}
            color={"white"}
          >
            Welcome, again.
          </HeadingWithCustomFont>

          <form onSubmit={onSubmitForm}>
            <Stack spacing={3}>
              <MyInput
                control={control}
                name={"email"}
                rules={{
                  required: "This field is required",
                  pattern: {
                    value: REGEX.EMAIL,
                    message: "Please provide a valid e-mail address.",
                  },
                }}
                renderStyleProps={{
                  placeholder: "E-mail",
                  variant: "flushed",
                  type: "text",
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
              <Button
                isLoading={isLoading}
                type={"submit"}
                colorScheme={"teal"}
              >
                Login
              </Button>
              <Heading py={2} textAlign={"center"} fontSize={"sm"}>
                You don&lsquo;t have account?{" "}
                <Link passHref={true} href={"/register"}>
                  <ChakraLink color={"teal"}>Register</ChakraLink>
                </Link>
              </Heading>
            </Stack>
          </form>
          {error && (
            <Alert mt={4} borderRadius={4} color={"#fff"} status="error">
              <AlertIcon />
              Something went wrong. Check your credentials.
            </Alert>
          )}
        </Fragment>
      </LoginRegisterLayout>
    </AppLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookies = cookie.parse(context.req.headers.cookie || "");

    // server side auth
    if (cookies.isLoggedIn === "true" && cookies.token) {
      const res = await axios
        .get(`${END_POINT}/auth/verify`, {
          headers: {
            token: cookies.token,
          },
        })
        .then((res) => res.data);

      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {},
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      context.res.setHeader("Set-Cookie", [
        cookie.serialize("token", "", {
          maxAge: -1,
          path: "/",
        }),
        cookie.serialize("isLoggedIn", "", {
          maxAge: -1,
          path: "/",
        }),
      ]);
      return {
        props: {},
      };
    }
  }
}

export default LoginPage;
