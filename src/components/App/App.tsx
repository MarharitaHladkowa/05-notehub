import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";
import css from "./App.module.css";
import type { Note } from "../../types/note";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: () => fetchNotes(query, page),
    placeholderData: (previousData) => previousData,
  });
  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setPage(1);
    },
    1000
  );

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess && query && notes.length === 0) {
      toast.error(`No notes found for your request: "${query}".`);
    }
  }, [isSuccess, notes.length, query]);
  const handlePageClick = ({ selected }: { selected: number }) => {
    const newPage = selected + 1;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onSearch={handleChange} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageClick}
          />
        )}
        <button
          onClick={openModal}
          className={css.button}
          aria-label="create note"
        >
          + create note
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
        {!isLoading && !isError && (
          <>
            {notes.length > 0 && (
              <div className={css.resultsMessage}>
                <p className={css.resultsText}>
                  Found {notes.length} notes.
                  <span className={css.resultsTextSecondary}>
                    (Page {page} of {totalPages})
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
