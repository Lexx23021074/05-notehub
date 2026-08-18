import ReactPaginatePkg from "react-paginate";
import css from "./Pagination.module.css";

const ReactPaginate =
  (ReactPaginatePkg as unknown as { default: typeof ReactPaginatePkg })
    .default || ReactPaginatePkg;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      forcePage={page - 1}
      pageCount={totalPages}
      onPageChange={(event) => onPageChange(event.selected + 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      previousLabel="<"
      nextLabel=">"
    />
  );
}
