/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import MyModal from "@components/modal";
import NoteItem from "@components/noteItem";
import SkeletonNote from "@components/skeleton";
import AnimationPageLayout from "@layouts/animation-layout";
import AppLayout from "@layouts/appLayout";
import { END_POINT } from "@lib/constants";
import axios from "axios";
import cookie from "cookie";
import useStore from "global-store/useStore";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "hooks/useTypeSafeQuery";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import { User, Note, ResObject } from "types";

type Props = {
  user: User;
  token: string;
};

const SearchPage: React.FC<Props> = ({ user, token }) => {
  const router = useRouter();
  const searchValue = router.query.q as string;
  const store = useStore();
  const queryClient = useQueryClient();

  const toast = useToast({
    position: "bottom-right",
    isClosable: true,
    variant: "solid",
  });

  const {
    data: foundItems,
    error,
    isLoading,
    refetch,
    isRefetching,
  } = useTypeSafeQuery(
    "searchNote",
    {
      enabled: Boolean(searchValue),
    },
    {
      token: token,
      user: user.id,
      data: searchValue,
    }
  );

  const {
    mutateAsync: deleteNoteMutation,
    isLoading: deleteNoteMutationLoading,
    isError: deleteMutationisError,
  } = useTypeSafeMutation("deleteNote", {
    onSuccess: ({ data }) => {
      // delete from cache
      const deletedId = store.deletedNote;
      const cachedData = queryClient.getQueryData("searchNote") as
        | ResObject<Note[]>
        | undefined;

      if (deletedId && cachedData) {
        const newData = cachedData.data.filter((item) => item.id !== deletedId);
        queryClient.setQueryData("searchNote", (existData) => {
          return {
            ...cachedData,
            data: newData,
          };
        }) as ResObject<Note[]> | undefined;
      }
    },
  });

  const {
    mutateAsync: updateNoteMutation,
    isLoading: updateNoteMutationLoading,
    isError: updateMutationisError,
  } = useTypeSafeMutation("updateNote");

  useEffect(() => {
    if (!router.isReady) return;
    if (searchValue) {
      refetch();
    }
  }, [refetch, router.isReady, searchValue]);

  if (isLoading || isRefetching) {
    return (
      <AppLayout title={"Search"} isLoggedIn>
        <Box padding="6" boxShadow="lg" bg="transparent" width={"full"}>
          {[1, 2, 3].map((item, index) => {
            return <SkeletonNote key={index} />;
          })}
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={"Search found"} isLoggedIn>
      <AnimationPageLayout>
        <Stack width={"full"} minHeight={"100vh"} padding={8}>
          {foundItems?.data.length === 0 ? (
            <Flex direction={"column"} justify="center" align={"center"}>
              <Text align={"center"} fontSize={"2xl"}>
                No results found for: "{searchValue}"{" "}
              </Text>
              <Button onClick={() => router.push("/")}>Go back</Button>
            </Flex>
          ) : (
            <Flex direction={"column"}>
              <Text textAlign={"center"} fontSize="3xl" fontWeight={"bold"}>
                Found {foundItems?.data.length} results for: "{searchValue}"
              </Text>
              {foundItems?.data.map((note) => (
                <Flex direction={"column"} w="full" key={note.id}>
                  <NoteItem
                    onDeleted={(id) => {
                      store.setDeletedNote(id);
                      store.setIsOpenModal(true);
                    }}
                    note={note}
                  />
                </Flex>
              ))}
            </Flex>
          )}

          {/* Modal */}
          <MyModal
            isOpen={store.isOpenModal}
            onClose={() => {
              store.setIsOpenModal(false);
            }}
            body={
              <Box>
                <Heading fontSize={"xl"}>
                  Are you sure you want to delete this note?
                </Heading>
              </Box>
            }
            footer={
              <Flex gap={5} direction={"row"}>
                <Button
                  onClick={() => {
                    deleteNoteMutation([store.deletedNote, token])
                      .then((res) => {
                        toast({
                          status: "success",
                          description: `Note deleted successfully.`,
                        });
                        store.setIsOpenModal(false);
                      })
                      .catch((err) => {
                        toast({
                          status: "error",
                          description: `Note can't deleted.`,
                        });
                        store.setIsOpenModal(false);
                      });
                  }}
                  colorScheme={"red"}
                  isFullWidth
                >
                  Confirm
                </Button>
                <Button
                  colorScheme={"gray"}
                  isFullWidth
                  onClick={() => {
                    store.setIsOpenModal(false);
                    store.setIsDrawerOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </Flex>
            }
            title="Confirm delete"
          />
        </Stack>
      </AnimationPageLayout>
    </AppLayout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookies = cookie.parse(context.req.headers.cookie || "");

    if (cookies.isLoggedIn === "true" && cookies.token) {
      const res = await axios
        .get(`${END_POINT}/auth/verify`, {
          headers: {
            token: cookies.token,
          },
        })
        .then((res) => res.data);

      if (!context.query.q) {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      }

      return {
        props: {
          user: res.data,
          token: cookies.token,
        },
      };
    }
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  } catch (error: any) {
    if (error.response.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  }
}

export default SearchPage;
