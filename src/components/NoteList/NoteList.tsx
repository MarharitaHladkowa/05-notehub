import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteNote } from "../../Services/noteServices"; // Импорт функции удаления
import type { Note } from "../../types/note"; // Импорт типа Note
import css from "./NoteList.module.css"; // Импорт стилей

interface NoteListProps {
  notes: Note[];
}

/// Компонент, отображающий одну заметку (ListItem)
const NoteItem: React.FC<{
  note: Note;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}> = ({ note, onDelete, isDeleting }) => {
  return (
    <li className={css.listItem}>
      <h2 className={css.title}>{note.title}</h2>
      <p className={css.content}>{note.content}</p>

      <div className={css.footer}>
        <span className={css.tag}>{note.tag}</span>
        <button
          className={css.button}
          onClick={() => onDelete(note.id)} // Вызываем переданный обработчик
          disabled={isDeleting} // Отключаем кнопку во время удаления
        >
          {isDeleting ? "Видалення..." : "Видалити"}
        </button>
      </div>
    </li>
  );
};

// Компонент списка нотаток
const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  // Получаем клиент React Query для управления кэшем
  const queryClient = useQueryClient();

  // Настраиваем мутацию для удаления нотатки
  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),

    // Оптимистичное обновление: удаляем элемент из UI до ответа сервера
    onMutate: async (noteIdToDelete: string) => {
      // Отменяем любые текущие запросы, чтобы они не перезаписали оптимистичное обновление
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Сохраняем предыдущее значение кэша на случай ошибки
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Оптимистично обновляем данные (удаляем нотатку из списка)
      queryClient.setQueryData<Note[]>(["notes"], (old) =>
        old ? old.filter((note) => note.id !== noteIdToDelete) : []
      );

      // Возвращаем контекст с предыдущим значением
      return { previousNotes };
    },

    // Если мутация прошла успешно, просто делаем недействительным кэш 'notes'.
    // Это приведет к фоновому повторному получению данных (refetch)
    onSuccess: () => {
      toast.success("Нотатка успішно видалена!");
      // Отмечаем кэш как устаревший (invalidated)
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },

    // Если мутация завершилась с ошибкой, возвращаем предыдущее значение
    onError: (err, _, context) => {
      toast.error(`Помилка видалення: ${err.message}`);
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
  });

  const handleDelete = (id: string) => {
    // Проверяем, что запрос на удаление еще не идет
    if (!deleteMutation.isPending) {
      deleteMutation.mutate(id);
    }
  };

  if (notes.length === 0) {
    return (
      <p className="text-center text-gray-500 p-8">
        Немає нотаток для відображення.
      </p>
    );
  }

  return (
    <>
      <ul className={css.list}>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={handleDelete}
            // Проверяем, удаляется ли именно эта нотатка
            isDeleting={
              deleteMutation.isPending && deleteMutation.variables === note.id
            }
          />
        ))}
      </ul>
    </>
  );
};

export default NoteList;
