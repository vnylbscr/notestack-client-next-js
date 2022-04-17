export const isServer = typeof window === "undefined";

export const END_POINT =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_LOCAL_ENDPOINT
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export const REGEX = {
  EMAIL:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
};

export enum COLORS {
  RED = "#F56565",
  GREEN = "#48BB78",
  TEAL = "#319795",
  BLUE = "#4299E1",
  YELLOW = "#ECC94B",
  ORANGE = "#ED8936",
  GRAY = "#A0AEC0",
  PINK = "#ED64A6",
}
