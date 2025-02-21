// PaginationComponent.js
import React from 'react';
import { TablePagination } from "@mui/material";

const PaginationComponent = ({ rowsPerPage, setRowsPerPage, page, setPage, totalRows }) => {

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <TablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      count={totalRows}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      labelRowsPerPage=""
    />
  );
};

export default PaginationComponent;
