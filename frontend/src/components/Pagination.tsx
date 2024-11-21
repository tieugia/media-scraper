import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            onPageChange={onPageChange}
            forcePage={currentPage - 1}
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            containerClassName="pagination-container"
            pageClassName="pagination-page"
            pageLinkClassName="pagination-link"
            previousClassName="pagination-prev"
            nextClassName="pagination-next"
            breakClassName="pagination-break"
            activeClassName="active"
            disabledClassName="disabled"
        />
    );
};

export default Pagination;
