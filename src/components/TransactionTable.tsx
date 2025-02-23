import React, { useEffect } from 'react';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTransactions,
  removeTransactionFromDB,
} from '../features/transactionSlice';
import { RootState, AppDispatch } from '../store';
import TransactionOverlay from './TransactionOverlay'; // Import TransactionOverlay

import './TransactionTable.scss';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  status: string;
  important: boolean;
  recurrence: string;
}

interface TransactionTableProps {
  filteredTransactions: Transaction[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ filteredTransactions, page, setPage }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTxn, setSelectedTxn] = React.useState<Transaction | null>(null);
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down('md'));

  const transactions = filteredTransactions || useSelector(
    (state: RootState) => state.transactions.transactions,
  );
  const loading = useSelector((state: RootState) => state.transactions.loading);

  interface Column {
    label: string;
    field: string;
    visible: boolean;
    format?: (value: number) => string;
    render?: (txn: Transaction) => JSX.Element;
  }

  const columns: Column[] = [
    { label: 'Date', field: 'date', visible: true },
    { label: 'Description', field: 'description', visible: true },
    {
      label: 'Expense',
      field: 'amount',
      visible: true,
      format: (value: number) => `₹${value.toFixed(2)}`,
    },
    { label: 'Type', field: 'type', visible: true },
    { label: 'Category', field: 'category', visible: !isMobileOrTablet },
    { label: 'Status', field: 'status', visible: !isMobileOrTablet },
    {
      label: 'Actions',
      field: 'actions',
      visible: true,
      render: (txn: Transaction) => (
        <IconButton onClick={() => handleDelete(txn.id)} color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  interface HandleDelete {
    (txnId: string): Promise<void>;
  }

  const handleDelete: HandleDelete = async (txnId) => {
    dispatch(removeTransactionFromDB(txnId));
  };

  const getRowColor = ({ important, recurrence }: { important: boolean; recurrence: string }) => {
    if (important) return '#FFB6B6';
    if (recurrence === 'Quarterly') return '#B0C4DE';
    if (recurrence === 'Monthly') return '#98FB98';
    if (recurrence === 'Yearly') return '#FFD700';
    return 'transparent';
  };

  interface HandleRowClick {
    (txn: Transaction): void;
  }

  const handleRowClick: HandleRowClick = (txn) => {
    setSelectedTxn(txn);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  if (loading) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        Loading...
      </Typography>
    );
  }

  if (transactions.length === 0) {
    return (
      <Typography variant="h6" align="center" color="textSecondary">
        No transactions available.
      </Typography>
    );
  }

  return (
    <>
      <TableContainer component={Paper} className="transaction-table">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) =>
                col.visible ? (
                  <TableCell key={index}>{col.label}</TableCell>
                ) : null,
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((txn) => (
              <TableRow
                key={txn.id}
                onClick={() => handleRowClick(txn)} // Handle row click for overlay
                style={{ backgroundColor: getRowColor(txn), cursor: 'pointer' }}
              >
                {columns.map((col, index) =>
                  col.visible ? (
                    <TableCell key={index} data-label={col.label}>
                      {col.field === 'status'
                        ? txn.important
                          ? 'Important'
                          : txn.recurrence
                        : col.render
                          ? col.render(txn)
                          : txn[col.field as keyof Transaction]}
                    </TableCell>
                  ) : null,
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={isMobileOrTablet ? [] : [10, 25, 50]}
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
