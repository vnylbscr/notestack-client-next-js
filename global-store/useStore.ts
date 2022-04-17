import { Note, User } from "types";
import create from "zustand";
import { combine } from "zustand/middleware";

type TabType = "active" | "completed";

const useStore = create(
  combine(
    {
      selectedNote: undefined as unknown as Note | undefined,
      notes: [] as Note[],
      isDrawerOpen: false,
      activeTab: "active" as TabType,
      isOpenModal: false,
      deletedNote: null as unknown as string,
      editedNote: undefined as unknown as Note | undefined,
      token: undefined as unknown as string,
      user: undefined as unknown as User | undefined,
    },
    (set) => ({
      setSelectedNote: (note: Note) =>
        set({
          selectedNote: note,
        }),
      setNotes: (notes: Note[]) =>
        set({
          notes,
        }),
      setIsDrawerOpen: (isOpen: boolean) =>
        set({
          isDrawerOpen: isOpen,
        }),
      setActiveTab: (tab: TabType) =>
        set({
          activeTab: tab,
        }),
      setIsOpenModal: (isOpen: boolean) =>
        set({
          isOpenModal: isOpen,
        }),
      setDeletedNote: (note: string) =>
        set({
          deletedNote: note,
        }),
      setEditedNote: (note: Note) =>
        set({
          editedNote: note,
        }),
      setToken: (token: string) =>
        set({
          token,
        }),
      setUser: (user: User) =>
        set({
          user,
        }),
    })
  )
);

export default useStore;
