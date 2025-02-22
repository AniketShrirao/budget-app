import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../features/transactionSlice';
import TransactionTable from './TransactionTable';
import MonthTabs from './MonthTabs';
import { RootState, AppDispatch } from '../store';
import './MonthsTabs.scss';

const MonthsTabs = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Start from 1

  const [page, setPage] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [selectedMonth, dispatch]);

  const filteredTransactions = transactions.filter(
    (txn) => new Date(txn.date).getMonth() + 1 === selectedMonth, // Convert getMonth() to 1-based
  );

  return (
    <Box className="months-tabs">
      <MonthTabs
        selectedMonth={selectedMonth.toString()}
        onMonthChange={(newMonth) => setSelectedMonth(Number(newMonth))}
      />
      {filteredTransactions.length > 0 ? (
        <TransactionTable
          filteredTransactions={filteredTransactions}
          page={page}
          setPage={setPage}
        />
      ) : (
        <Typography
          padding={5}
          variant="h6"
          color="textSecondary"
          align="center"
        >
          No transactions for this month.
        </Typography>
      )}
    </Box>
  );
};

export default MonthsTabs;
