export type ReturnAwait<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : T;

export type Await<T> = T extends Promise<infer U> ? U : T;

export interface LoginState {
  email: string;
  password: string;
}

export interface RegisterState extends LoginState {
  username: string;
  passwordConfirm: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  text: string;
  color: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface CreateNote {
  title: string;
  text: string;
  userId: string;
  color?: string;
}

export interface UpdateNoteDto {
  id: string;
  title: string;
  text: string;
  color: string;
}

export type ResObject<T> = {
  data: T;
  status: number;
  message: string;
  errors: string[];
};

export type WithPagination<T> = {
  items: T[];
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
  currentPage: number;
};

export type GetUserNotesParams = {
  userId: string;
  token: string;
  completed?: boolean;
  isDescending?: boolean;
  sortBy?: string;
  page?: number;
  size?: number;
};

export interface LoginResponse {
  token: string;
  user: User;
}

export type RegisterParams = Omit<RegisterState, "passwordConfirm">;

export type GetSearchQueryParams = {
  data: string;
  user?: string;
  token: string;
};

export type Mert<T> = <K extends keyof T>(key: K) => T[K];
