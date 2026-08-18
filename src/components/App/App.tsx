import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes, createNote } from "../../services/noteService";
import type { NewNote } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: keepPreviousData, // Запобігає мерехтінню інтерфейсу при зміні сторінки
  });

  const addNoteMutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onChange={handleSearchChange}
        />

        {/* 1. Умовний рендер пагінації */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        <button
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && <NoteList notes={notes} />}
      </main>

      {/* 2. Умовний рендер модального вікна */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <NoteForm
            onSubmit={(values) => addNoteMutation.mutate(values)}
            onCancel={() => setIsModalOpen(false)}
            isSubmitting={addNoteMutation.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
