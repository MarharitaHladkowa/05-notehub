// Компонент для отображения списка заметок

import type { Note } from "../../types/note"; // Импорт типа Note
import css from "./NoteList.module.css"; // Импорт стилей

interface NoteListProps {
  notes: Note[];
}
export default function NoteList({ notes }: NoteListProps) {
  // Компонент не рендерится, если массив пуст
  if (notes.length === 0) {
    return null;
  }

  return (
    <ul className={css.noteList}>
      {" "}
      {notes.map((note) => (
        <li key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
  // Функция для удаления заметки
  function handleDelete(id: string) {
    // Логика удаления заметки по ID
    console.log(`Delete note with id: ${id}`);
  }
}
