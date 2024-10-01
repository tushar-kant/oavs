// src/components/PaginationComponent.jsx
import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; // Prevent out-of-bound pages
    onPageChange(pageNumber);
  };

  return (
    <Pagination aria-label="Page navigation">
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink
          first
          onClick={() => handlePageChange(1)}
        />
      </PaginationItem>
      <PaginationItem disabled={currentPage === 1}>
        <PaginationLink
          previous
          onClick={() => handlePageChange(currentPage - 1)}
        />
      </PaginationItem>
      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink
          next
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </PaginationItem>
      <PaginationItem disabled={currentPage === totalPages}>
        <PaginationLink
          last
          onClick={() => handlePageChange(totalPages)}
        />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;
