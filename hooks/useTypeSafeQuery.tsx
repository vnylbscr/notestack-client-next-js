import { requests } from "@services/api";
import { UseQueryOptions, useQuery } from "react-query";
import { Await } from "types";

type QueryKeys = keyof typeof requests["query"];

type PaginatedKey<K extends QueryKeys> = [K, ...(string | number | boolean)[]];

type ParamsOfQuery<K extends QueryKeys> = Parameters<
  typeof requests["query"][K]
>;

export const useTypeSafeQuery = <K extends QueryKeys>(
  key: K | PaginatedKey<K>,
  opts?: UseQueryOptions<
    never,
    unknown,
    Await<ReturnType<typeof requests["query"][K]>>,
    ParamsOfQuery<K>
  > | null,
  ...params: ParamsOfQuery<K>
) =>
  useQuery<Await<ReturnType<typeof requests["query"][K]>>>(
    key,
    () => {
      const fn = requests.query[typeof key === "string" ? key : key[0]] as any;
      return fn(...(params || []));
    },
    opts as any
  );
