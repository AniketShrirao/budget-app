import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Button } from '@mui/material';
import { CSVLink } from 'react-csv';
import { toast } from 'react-toastify';
import { Transaction } from '../types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface DownloadTransactionsProps {
  selectedMonth: string;
}

interface CSVData {
  Date: string;
  Description: string;
  Amount: string;
  Type: string;
  Category: string;
  Status: string;
  Recurrence: string;
  Important: string;
}

const DownloadTransactions: React.FC<DownloadTransactionsProps> = ({ selectedMonth }) => {
  const transactions = useSelector((state: RootState) => state.transactions.transactions);

  const csvData = useMemo(() => {
    const currentMonthTransactions = transactions.filter(
      (tx) => new Date(tx.date).getMonth() + 1 === Number(selectedMonth)
    );

    if (currentMonthTransactions.length === 0) {
      toast.info('No transactions available for download');
      return [];
    }

    return currentMonthTransactions.map((tx: Transaction): CSVData => ({
      Date: new Date(tx.date).toLocaleDateString(),
      Description: tx.description,
      Amount: `₹${tx.amount.toFixed(2)}`,
      Type: tx.type,
      Category: tx.category,
      Status: tx.status,
      Recurrence: tx.recurrence,
      Important: tx.important ? 'Yes' : 'No'
    }));
  }, [transactions, selectedMonth]);

  const filename = `transactions-${selectedMonth}-${new Date().getFullYear()}.csv`;

  return (
    <Button
      variant="outlined"
      color="primary"
      disabled={csvData.length === 0}
      startIcon={<FileDownloadIcon />}
      component={CSVLink}
      data={csvData}
      filename={filename}
      target="_blank"
    >
      Download Transactions
    </Button>
  );
};

export default DownloadTransactions;