import { requests } from "@services/api";
import { useMutation, UseMutationOptions } from "react-query";
import { Await } from "types";

type Keys = keyof typeof requests["mutation"];

export const useTypeSafeMutation = <K extends Keys>(
  key: K,
  opts?: UseMutationOptions<
    Await<ReturnType<typeof requests["mutation"][K]>>,
    any,
    Parameters<typeof requests["mutation"][K]>,
    any
  >
) =>
  useMutation<
    Await<ReturnType<typeof requests["mutation"][K]>>,
    any,
    Parameters<typeof requests["mutation"][K]>
  >(
    (params) =>
      (requests.mutation[typeof key === "string" ? key : key[0]] as any)(
        ...params
      ),
    opts
  );
