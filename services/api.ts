import { END_POINT } from "@lib/constants";
import axios from "axios";
import {
  CreateNote,
  GetSearchQueryParams,
  GetUserNotesParams,
  LoginResponse,
  LoginState,
  Note,
  RegisterParams,
  ResObject,
  WithPagination,
} from "types";

// create a function axios and return a promise and add token to headers
const client = (token?: string) =>
  axios.create({
    baseURL: END_POINT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

const query = {
  getUserNotes: async (
    params: GetUserNotesParams
  ): Promise<ResObject<WithPagination<Note>>> => {
    const {
      userId,
      completed = false,
      sortBy = "createdAt",
      page = 1,
      size = 5,
      isDescending = true,
      token,
    } = params;
    return client(token)
      .get(
        `/note/user/${userId}?isDescending=${isDescending}&sortBy=${sortBy}&page=${page}&size=${size}&completed=${completed}`
      )
      .then((res) => res.data);
  },
  getSingleNote: async (
    noteId: string,
    token: string
  ): Promise<ResObject<Note>> => {
    return client(token)
      .get(`/note?id=${noteId}`)
      .then((res) => res.data);
  },
  getAllNotes: async (token: string): Promise<ResObject<Note[]>> => {
    return client(token)
      .get(`/note/getAll`)
      .then((res) => res.data);
  },
  searchNote: async (
    variables: GetSearchQueryParams
  ): Promise<ResObject<Note[]>> => {
    return client(variables.token)
      .get(`/note/search?query=${variables.data}&user=${variables.user}`)
      .then((res) => res.data);
  },
};

const mutation = {
  login: async (data: LoginState): Promise<ResObject<LoginResponse>> => {
    return axios.post(`${END_POINT}/auth/login`, data, {
      withCredentials: true,
    });
  },
  register: async ({
    email,
    username,
    password,
  }: RegisterParams): Promise<ResObject<String>> => {
    return axios
      .post(`${END_POINT}/auth/register`, {
        email,
        username,
        password,
      })
      .then((res) => res.data);
  },
  addNote: async (
    data: CreateNote,
    token: string
  ): Promise<ResObject<Note>> => {
    return client(token)
      .post(`/note/create`, data)
      .then((res) => res.data);
  },
  deleteNote: async (
    noteId: string,
    token: string
  ): Promise<ResObject<boolean>> => {
    return client(token)
      .delete(`/note?id=${noteId}`)
      .then((res) => res.data);
  },
  updateNote: async ({
    noteId,
    data,
    token,
  }: {
    noteId: string;
    data: Omit<CreateNote, "userId">;
    token: string;
  }): Promise<ResObject<Note>> => {
    return client(token)
      .put(`/note?id=${noteId}`, data)
      .then((res) => res.data);
  },
  completeNote: async (
    noteId: string,
    token: string
  ): Promise<ResObject<Note>> => {
    return client(token)
      .post(`/note/complete?id=${noteId}`)
      .then((res) => res.data);
  },
  logout: async (): Promise<ResObject<string>> => {
    return axios
      .post(`${END_POINT}/auth/logout`, {}, { withCredentials: true })
      .then((res) => res.data);
  },
};

export const requests = {
  query,
  mutation,
};
