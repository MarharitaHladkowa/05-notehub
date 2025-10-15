import axios from "axios";
import type { Note } from "../types/note";

// Используйте VITE_NOTEHUB_API_KEY из переменных окружения
const VITE_NOTEHUB_API_KEY = import.meta.env.VITE_NOTEHUB_API_KEY;

// Использование жестко закодированного базового URL для исключения проблем с VITE_API_BASE_URL
const BASE_URL = "https://notehub-public.goit.study/api";

// Проверяем, что BASE_URL существует, иначе используем заглушку или кидаем ошибку
// Теперь эта проверка всегда должна проходить
if (!BASE_URL) {
  console.error("BASE_URL is missing! Check VITE_API_BASE_URL in .env file.");
  // В случае отсутствия, мы не можем работать.
  // Оставим эту проверку, чтобы избежать ошибок.
}

export const deleteNote = async (noteId: string): Promise<void> => {
  // *ОБРАТИТЕ ВНИМАНИЕ: ЗДЕСЬ ТОЖЕ НУЖНА ПРОВЕРКА КЛЮЧА*
  if (!VITE_NOTEHUB_API_KEY || !BASE_URL) {
    console.error("API Key or Base URL is missing for deletion.");
    throw new Error("API Key and Base URL are required for this operation.");
  }
  await axios.delete(`${BASE_URL}/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${VITE_NOTEHUB_API_KEY}`,
    },
  });
};

export interface NoteDetails extends Note {
  createdAt: string;
  updatedAt: string;
}

export interface NoteResponse {
  page: number;
  results: Note[];
  total_pages: number;
  total_results: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchNotes(
  searchQuery: string,
  page: number = 1
): Promise<NoteResponse> {
  // ДОБАВЛЕНЫ ЛОГИ ДЛЯ ОТЛАДКИ ПЕРЕМЕННЫХ ОКРУЖЕНИЯ
  console.log("Debug check: BASE_URL is:", !!BASE_URL); // Должен быть true
  console.log("Debug check: API_KEY is:", !!VITE_NOTEHUB_API_KEY);

  // 🛑 КРИТИЧЕСКАЯ ПРОВЕРКА: Если ключ или URL отсутствует, не отправлять запрос.
  if (!VITE_NOTEHUB_API_KEY || !BASE_URL) {
    console.error(
      "--- fetchNotes ERROR: VITE_NOTEHUB_API_KEY is missing! (Base URL is hardcoded) ---"
    );
    // Возвращаем пустые данные, чтобы избежать ошибки в useQuery
    return { results: [], page: 1, total_pages: 1, total_results: 0 };
  }

  // 1. Динамическое определение URL и параметров
  let url;
  const params: Record<string, string | number> = {
    page: page,
    language: "en-US",
  };

  if (searchQuery.trim() === "") {
    // Если поиск пуст (при старте), используем эндпоинт для всех заметок
    url = `${BASE_URL}/notes`;
    console.log("--- fetchNotes: Using /notes for all data. ---");
  } else {
    // Если есть запрос, используем эндпоинт поиска
    url = `${BASE_URL}/search/notes`;
    params.query = searchQuery;
    console.log(
      `--- fetchNotes: Using /search/notes for query: ${searchQuery}. ---`
    );
  }

  try {
    const response = await axios.get<NoteResponse>(url, {
      params: params, // Отправляем только нужные параметры
      headers: {
        Authorization: `Bearer ${VITE_NOTEHUB_API_KEY}`,
      },
    });

    // *Важно:* Эндпоинт /notes может возвращать просто массив, а не объект с results.
    // Если url - /notes, мы должны убедиться, что ответ соответствует интерфейсу NoteResponse.

    // Проверяем, если это /notes и ответ - это просто массив (наиболее частая проблема)
    if (url.endsWith("/notes") && Array.isArray(response.data)) {
      // Если API вернул просто массив, мы его оборачиваем в нужный формат:
      return {
        page: page,
        results: response.data as Note[],
        total_pages: 1, // Или другую логику, если API не дает пагинации для /notes
        total_results: (response.data as Note[]).length,
      };
    }

    // В противном случае, возвращаем данные как есть (для /search/notes)
    return response.data;
  } catch (error) {
    // Если ошибка произошла на сетевом уровне (401, 500 и т.д.)
    console.error("--- fetchNotes ERROR ---", error);
    throw error;
  }
}
