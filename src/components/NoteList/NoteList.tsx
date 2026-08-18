import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "../../services/noteService";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./NoteList.module.css";

interface NoteListProps {
  page: number;
  search: string;
  onTotalPagesChange: (total: number) => void;
}

export default function NoteList({
  page,
  search,
  onTotalPagesChange,
}: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
  });

  useEffect(() => {
    if (data?.totalPages !== undefined) {
      onTotalPagesChange(data.totalPages);
    }
  }, [data?.totalPages, onTotalPagesChange]);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;
  if (!data?.notes.length) return null;

  return (
    <ul className={css.list}>
      {data.notes.map((note) => (
        <li
          key={note.id}
          className={css.listItem}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
