import axios from "axios";
import type { Note, NewNote, UpdatedNote } from "../types/note";
import { Search } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

axios.defaults.headers.common.Authorization = `Bearer ${
  import.meta.env.VITE_NOTEHUB_API_KEY
}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (query: string, page: number) => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      Search: query,
      Page: page,
      PageSize: 10,
    },
  });
  return response.data;
};
export const createNote = async (newNote: NewNote) => {
  const response = await axios.post<Note>("/notes", newNote);
  return response.data;
};
export const deleteNote = async (noteId: string) => {
  const response = await axios.delete<Note>(`/notes/${noteId}`);
  return response.data;
};
