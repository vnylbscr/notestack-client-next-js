/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import EditNoteDrawer from "@components/editNoteDrawer";
import InputArea from "@components/inputArea";
import MyModal from "@components/modal";
import NoteItem from "@components/noteItem";
import SkeletonNote from "@components/skeleton";
import WelcomeSection from "@components/welcomeSection";
import AnimationPageLayout from "@layouts/animation-layout";
import AppLayout from "@layouts/appLayout";
import { END_POINT } from "@lib/constants";
import { requests } from "@services/api";
import axios from "axios";
import cookie from "cookie";
import useStore from "global-store/useStore";
import { useTypeSafeMutation } from "hooks/useTypeSafeMutation";
import type { GetServerSidePropsContext } from "next";
import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { Note, User, Mert } from "types";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookies = cookie.parse(context.req.headers.cookie || "");

    console.log("ccokies", cookies);

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

interface IProps {
  user: User;
  token: string;
}

const Home: React.FC<IProps> = ({ token, user }) => {
  const toast = useToast({
    position: "bottom-right",
    isClosable: true,
    variant: "solid",
  });
  const store = useStore();
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "25px 0px",
  });
  const queryClient = useQueryClient();
  console.log("store is", store);

  useEffect(() => {
    store.setToken(token);
    store.setUser(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const {
    data: userNotes,
    error,
    isLoading: userNotesLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "getUserNotes",
    ({ pageParam = 1 }) =>
      requests.query.getUserNotes({
        page: pageParam,
        userId: user.id,
        token,
        completed: store.activeTab === "completed" ? true : false,
      }),
    {
      getNextPageParam: (lastPageData) => {
        if (
          lastPageData.data.hasNext &&
          lastPageData.data.currentPage < lastPageData.data.totalPages
        )
          return lastPageData.data.currentPage + 1;
        return undefined;
      },
    }
  );

  const {
    mutateAsync: addNoteMutation,
    isLoading: addNoteLoading,
    error: addNoteError,
  } = useTypeSafeMutation("addNote", {
    onSuccess: ({ data: response }) => {
      const cachedData: typeof userNotes =
        queryClient.getQueryData("getUserNotes");

      if (cachedData && cachedData?.pages?.length > 0) {
        queryClient.setQueryData("getUserNotes", (data: any) => {
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: [response, ...page.data.items],
              },
            })),
          };
        });
      }
    },
  });

  const {
    mutateAsync: deleteNoteMutation,
    isLoading: isLoadingDeleteNote,
    error: deleteNoteError,
  } = useTypeSafeMutation("deleteNote", {
    onSuccess: ({ data: response }) => {
      const cachedData: typeof userNotes =
        queryClient.getQueryData("getUserNotes");

      if (cachedData && cachedData?.pages?.length > 0) {
        queryClient.setQueryData("getUserNotes", (data: any) => {
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.filter(
                  (item: Note) => item.id !== store.deletedNote
                ),
              },
            })),
          };
        });
      }
    },
  });

  const {
    mutateAsync: completeNoteMutation,
    isLoading: isLoadingCompleteNote,
    error: completeNoteError,
  } = useTypeSafeMutation("completeNote", {
    onSuccess: ({ data: response }) => {
      const cachedData: typeof userNotes =
        queryClient.getQueryData("getUserNotes");

      if (cachedData && cachedData?.pages?.length > 0) {
        queryClient.setQueryData("getUserNotes", (data: any) => {
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: Note) =>
                  item.id === response.id ? response : item
                ),
              },
            })),
          };
        });
      }
    },
  });

  const {
    mutateAsync: updateNoteMutation,
    isLoading: isLoadingUpdateNote,
    error: updateNoteError,
  } = useTypeSafeMutation("updateNote", {
    onSuccess: ({ data: response }) => {
      const cachedData: typeof userNotes =
        queryClient.getQueryData("getUserNotes");

      if (cachedData && cachedData?.pages?.length > 0) {
        queryClient.setQueryData("getUserNotes", (data: any) => {
          return {
            ...data,
            pages: data.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                items: page.data.items.map((item: Note) =>
                  item.id === response.id ? response : item
                ),
              },
            })),
          };
        });
      }
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const isError = Boolean(
    error || addNoteError || completeNoteError || deleteNoteError
  );

  if (isError) {
    toast({
      status: "error",
      description: "An error occured",
    });
  }

  return (
    <AppLayout isLoggedIn={Boolean(user || token)} title={"Home"}>
      <AnimationPageLayout>
        <Box>
          <Flex
            justify={"center"}
            align={"center"}
            bgColor={useColorModeValue("gray.50", "gray.900")}
            p={"4"}
            direction={"column"}
            h={"full"}
          >
            <WelcomeSection username={user.username} />
            <Container maxW={"6xl"}>
              <Flex
                overflowY={"auto"}
                direction={"column"}
                justify={"center"}
                align="center"
              >
                <InputArea
                  onSubmit={(data) => {
                    addNoteMutation([
                      {
                        ...data,
                        userId: user.id,
                      },
                      token,
                    ])
                      .then(({ data }) => {
                        toast({
                          status: "success",
                          description: `Note successfull added.`,
                        });
                      })
                      .catch((err) => {
                        console.log("error is", err);
                        toast({
                          status: "error",
                          description: `Note can't added.`,
                        });
                      });
                  }}
                  isLoading={addNoteLoading}
                />
                <Box w={"full"} h={"full"} mt={1} px="1">
                  <Tabs
                    onChange={(index) => {
                      console.log("index is", index);
                    }}
                    variant="solid-rounded"
                    colorScheme="teal"
                    isFitted={true}
                    py="4"
                    defaultIndex={0}
                  >
                    <TabList>
                      {/* <Tab
                        onClick={() => {
                          store.setActiveTab("active");
                        }}
                        tabIndex={0}
                        fontSize={"xl"}
                      >
                        Todo
                      </Tab> */}
                      {/* <Tab
                        onClick={() => {
                          store.setActiveTab("completed");
                        }}
                        tabIndex={1}
                        fontSize={"xl"}
                      >
                        Completed
                      </Tab> */}
                    </TabList>
                    <TabPanels>
                      <TabPanel id={"tab-panel-active"} p={"0"}>
                        {userNotesLoading ? (
                          <Box
                            padding="6"
                            boxShadow="lg"
                            bg="transparent"
                            width={"full"}
                          >
                            {[1, 2, 3].map((item, index) => {
                              return <SkeletonNote key={index} />;
                            })}
                          </Box>
                        ) : (
                          <Fragment>
                            {userNotes && userNotes?.pages?.length > 0 && (
                              <Box minH={"58vh"}>
                                {userNotes?.pages.map((page, index) => {
                                  return (
                                    <Fragment key={index}>
                                      {page.data.items.map((item, index) => {
                                        return (
                                          <NoteItem
                                            key={item.id}
                                            onCompleted={(id) => {
                                              console.log(
                                                "completed note id",
                                                id
                                              );
                                              completeNoteMutation([id, token])
                                                .then((res) => {
                                                  console.log(
                                                    "completed note",
                                                    res
                                                  );
                                                  toast({
                                                    status: "success",
                                                    description: `Good job 💪 Note completed successfully.`,
                                                  });
                                                })
                                                .catch((err) => {
                                                  console.log("error is", err);
                                                  toast({
                                                    status: "error",
                                                    description: `Note can't completed.`,
                                                  });
                                                });
                                            }}
                                            onDeleted={(id) => {
                                              store.setDeletedNote(id);
                                              store.setIsOpenModal(true);
                                            }}
                                            note={item}
                                            onEdited={(id) => {
                                              const foundNote = userNotes?.pages
                                                .find((page) => {
                                                  return page.data.items.find(
                                                    (item) => {
                                                      return item.id === id;
                                                    }
                                                  );
                                                })
                                                ?.data.items.find((item) => {
                                                  return item.id === id;
                                                });

                                              console.log(
                                                "itemmm on edited",
                                                foundNote
                                              );

                                              if (foundNote) {
                                                store.setEditedNote(foundNote);
                                              }

                                              store.setIsDrawerOpen(true);
                                            }}
                                          />
                                        );
                                      })}
                                      {page.data.items.length === 0 && (
                                        <Flex
                                          direction={"column"}
                                          justify="center"
                                          align={"center"}
                                          height={"60vh"}
                                          gap="2rem"
                                        >
                                          <Text>
                                            You don't have any notes yet.
                                          </Text>
                                          <Button
                                            onClick={() => {}}
                                            colorScheme={"teal"}
                                          >
                                            Add a note.
                                          </Button>
                                        </Flex>
                                      )}
                                    </Fragment>
                                  );
                                })}
                                <div ref={ref} />
                              </Box>
                            )}
                          </Fragment>
                        )}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>

                  {store.isDrawerOpen && (
                    <EditNoteDrawer
                      onSubmit={(data) => {
                        updateNoteMutation([
                          {
                            data,
                            token,
                          },
                        ])
                          .then((res) => {
                            toast({
                              status: "success",
                              description: `Note updated successfully.`,
                            });
                          })
                          .catch((err) => {
                            toast({
                              status: "error",
                              description: `Note can't updated.`,
                            });
                          });
                      }}
                      isOpen={store.isDrawerOpen}
                      onClose={() => {
                        store.setIsDrawerOpen(false);
                      }}
                      note={store.editedNote}
                    />
                  )}

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
                </Box>
              </Flex>
            </Container>
          </Flex>
        </Box>
      </AnimationPageLayout>
    </AppLayout>
  );
};

export default Home;
