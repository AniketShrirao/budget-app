import React, { useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  TableContainer,
  Paper,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, removeTransactionFromDB } from "../features/transactionSlice";
import { RootState } from "../store";
import TransactionOverlay from "./TransactionOverlay"; // Import TransactionOverlay

import "./TransactionTable.scss";

export const TransactionTable = ({ page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTxn, setSelectedTxn] = React.useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();

  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  const transactions = useSelector((state: RootState) => state.transactions.transactions);
  const loading = useSelector((state: RootState) => state.transactions.loading);

  const columns = [
    { label: "Date", field: "date", visible: true },
    { label: "Description", field: "description", visible: !isMobileOrTablet },
    { label: "Expense", field: "amount", visible: true, format: (value) => `₹${value.toFixed(2)}` },
    { label: "Type", field: "type", visible: true },
    { label: "Category", field: "category", visible: !isMobileOrTablet },
    { label: "Status", field: "status", visible: !isMobileOrTablet },
    { label: "Actions", field: "actions", visible: true, render: (txn) => (
        <IconButton onClick={() => handleDelete(txn.id)} color="error">
          <DeleteIcon />
        </IconButton>
      )},
  ];

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (txnId) => {
    dispatch(removeTransactionFromDB(txnId));
  };

  const getRowColor = ({ important, recurrence }) => {
    if (important) return "#FFB6B6";
    if (recurrence === "Quarterly") return "#B0C4DE";
    if (recurrence === "Monthly") return "#98FB98";
    if (recurrence === "Yearly") return "#FFD700";
    return "transparent";
  };

  const handleRowClick = (txn) => {
    setSelectedTxn(txn);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <Typography variant="h6" align="center" color="textSecondary">Loading...</Typography>;
  }

  if (transactions.length === 0) {
    return <Typography variant="h6" align="center" color="textSecondary">No transactions available.</Typography>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) =>
                col.visible ? (
                  <TableCell key={index}>{col.label}</TableCell>
                ) : null
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((txn) => (
              <TableRow
                key={txn.id}
                onClick={() => handleRowClick(txn)} // Handle row click for overlay
                style={{ backgroundColor: getRowColor(txn), cursor: "pointer" }}
              >
{columns.map((col, index) =>
  col.visible ? (
    <TableCell key={index}>
      {col.field === "status"
        ? txn.important ? "Important"  : txn.recurrence
        : col.render
        ? col.render(txn)
        : txn[col.field]}
    </TableCell>
  ) : null
)}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* TransactionOverlay Component to show detailed info */}
      <TransactionOverlay txn={selectedTxn} setSelectedTxn={setSelectedTxn} />
    </>
  );
};

export default TransactionTable;
