import axios from "axios";

const API_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Добавляем проверку, чтобы избежать ошибок, если переменные не найдены
if (!API_TOKEN || !BASE_URL) {
  // Выбрасываем ошибку, чтобы разработчик знал о проблеме с конфигурацией
  console.error(
    "API configuration error: VITE_NOTEHUB_TOKEN or VITE_API_BASE_URL is missing."
  );
}
const notehubInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    // Согласно инструкции, токен передается как "Bearer ваш_токен"
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Тип для одной заметки (может потребоваться уточнение, когда получим данные)
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
}

/**
 * Загружает все заметки из персональной коллекции пользователя (включая 40 тестовых).
 * @returns Promise с массивом заметок.
 */
export async function getNotes(): Promise<Note[]> {
  try {
    // GET-запрос на endpoint для получения всех заметок
    const response = await notehubInstance.get("/notes");

    // Axios автоматически парсит JSON, возвращаем данные заметок
    return response.data;
  } catch (error) {
    console.error("Error fetching notes from NoteHub API:", error);
    // Обработка ошибки, например, при неверном токене
    throw new Error(
      "Failed to load notes. Check your API token or network connection."
    );
  }
}

/**
 * Добавляет новую заметку в коллекцию.
 * @param newNote Объект с данными новой заметки (title, content, tag).
 * @returns Promise с созданной заметкой.
 */
export async function addNote(
  newNote: Omit<Note, "id" | "createdAt">
): Promise<Note> {
  try {
    const response = await notehubInstance.post("/notes", newNote);
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
}
