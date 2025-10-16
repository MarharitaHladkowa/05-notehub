import axios from "axios";
import type { Note } from "../types/note";

const VITE_NOTEHUB_API_KEY = import.meta.env.VITE_NOTEHUB_API_KEY;
const BASE_URL = "https://notehub-public.goit.study/api";

export interface NoteDetails extends Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  completed: boolean;
  createdAt: string;
}
interface NoteResponse {
  page: number;
  results: Note[];
  total_pages: number;
  total_results: number;
}

export const fetchNotes = async (
  searchQuery: string,
  page: number = 1
): Promise<NoteResponse> => {
  let endpoint = "";

  // 1. Если searchQuery пуст (первая загрузка или сброс поиска)
  if (!searchQuery || searchQuery.trim() === "") {
    // Запрашиваем ВСЕ заметки
    endpoint = `${BASE_URL}/notes?page=${page}`;
  } else {
    // 2. Если есть запрос
    // Запрашиваем заметки по поисковому запросу
    endpoint = `${BASE_URL}/notes/search?query=${searchQuery}&page=${page}`;
  }

  const response = await axios.get<NoteResponse>(endpoint, {
    params: {
      query: searchQuery,
      page: page,
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_API_KEY}`,
    },
  });
  return response.data;
};
