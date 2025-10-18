import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDebounce } from "use-debounce"; // 1. Импорт useDebounce
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../Services/noteServices";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";
import css from "./App.module.css";
import ReactPaginate from "react-paginate";
import type { Note } from "../../types/note";

const DEBOUNCE_DELAY = 500;

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [debouncedSearch] = useDebounce(query, DEBOUNCE_DELAY);
  const openModal = () => setIsModalOpen(true); // ВОТ ОНА
  const closeModal = () => setIsModalOpen(false);
  // 3. useQuery теперь использует debouncedSearch
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(debouncedSearch, page),
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;
  useEffect(() => {
    // Показываем тост, если:
    // 1. Запрос успешно завершен (isSuccess === true)
    // 2. Есть активный поисковый запрос (query)
    // 3. Результатов нет (notes.length === 0)
    if (isSuccess && query && notes.length === 0) {
      toast.error(`No notes found for your request: "${query}".`);
    }
    // Зависимости: isSuccess (для реакции на завершение), notes.length (для проверки результата), query (для текста тоста)
  }, [isSuccess, notes.length, query]);

  // 8. Обработчик смены страницы для ReactPaginate
  const handlePageClick = ({ selected }: { selected: number }) => {
    // ReactPaginate передает 0-индексированный номер, API ожидает 1-индексированный
    const newPage = selected + 1;
    setPage(newPage);
    // Прокручиваем страницу вверх для лучшего UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSubmit={setQuery} />
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={handlePageClick}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
            breakLabel="..."
            renderOnZeroPageCount={null}
          />
        )}
        <button
          onClick={openModal}
          className={css.button}
          aria-label="Створити нову нотатку"
        >
          + Створити нотатку
        </button>
      </header>
      <NoteList notes={notes} />
      <div>
        {isLoading && <Loader />}

        {isError && (
          <ErrorMessage
            message={
              error?.message || "An unexpected error occurred during search."
            }
          />
        )}
        {/* Успішний рендеринг: показываем, если есть фильмы и нет загрузки/ошибки */}
        {!isLoading && !isError && (
          <>
            {/* Сообщение о количестве найденных заметок */}
            {notes.length > 0 && (
              <div className={css.resultsMessage}>
                <p className={css.resultsText}>
                  Found {notes.length} notes.
                  <span className={css.resultsTextSecondary}>
                    (Сторінка {page} з {totalPages})
                  </span>
                </p>
              </div>
            )}
          </>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>

        <Toaster position="top-right" />
      </div>
    </div>
  );
}
