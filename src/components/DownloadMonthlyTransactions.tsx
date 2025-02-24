import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';

const DownloadTransactions: React.FC<{ selectedMonth: string }> = ({ selectedMonth }) => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const currentMonthTransactions = transactions.filter(
    (tx) => new Date(tx.date).getMonth() + 1 === Number(selectedMonth),
  );

  const csvData = currentMonthTransactions.map((tx) => ({
    Date: tx.date,
    Category: tx.category,
    Description: tx.description,
    Amount: tx.amount,
    Type: tx.type,
  }));

  return (
    <Button variant="contained" color="primary">
      <CSVLink data={csvData} filename={`transactions-${selectedMonth}.csv`} style={{ color: '#fff', textDecoration: 'none' }}>
        Download Transactions
      </CSVLink>
    </Button>
  );
};

export default DownloadTransactions;