import { isServer } from "@lib/constants";
import create from "zustand";
import { combine } from "zustand/middleware";

const useSearchStore = create(
  combine(
    {
      searchValue: "" as string,
      searchHistory: [] as string[],
    },
    (set) => ({
      setSearchValue: (value: string) => set({ searchValue: value }),
      addSearchHistory: (value: string) =>
        set((state) => {
          const searchHistory = [...state.searchHistory];
          if (!searchHistory.includes(value)) {
            searchHistory.unshift(value);
          }
          try {
            if (!isServer) {
              localStorage.setItem(
                "searchHistory",
                JSON.stringify(searchHistory)
              );
            }
          } catch {}
          return { searchHistory };
        }),
    })
  )
);

export default useSearchStore;
