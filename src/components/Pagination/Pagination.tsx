import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination = (props: PaginationProps) => {
  const { totalPages, currentPage, onPageChange } = props;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
      breakLabel="..."
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
