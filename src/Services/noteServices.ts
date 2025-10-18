import axios from "axios";
import type { Note, NewNote } from "../types/note";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

axios.defaults.headers.common.Authorization = `Bearer ${
  import.meta.env.VITE_NOTEHUB_API_KEY
}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (searchText: string, page: number) => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      ...(searchText !== "" && { search: searchText }),
      page,
      perPage: 12,
    },
  });
  return response.data;
};
export const createNote = async (newNote: NewNote) => {
  const response = await axios.post<Note>("/notes", newNote);
  return response.data;
};
