import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { Pencil } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateMonthlySummary,
  fetchMonthlySummary,
} from '../features/summarySlice';
import { store } from '../store';
import { Transaction } from '../features/transactionSlice';

const DEFAULT_CATEGORIES = [
  { name: 'Needs', percentage: 20 },
  { name: 'Wants', percentage: 20 },
  { name: 'Investment', percentage: 30 },
  { name: 'Marriage', percentage: 30 },
];

interface BudgetSummaryTableProps {
  className?: string;
  userId: string;
  selectedMonth: string;
  parentTransactions: any[];
}

const BudgetSummaryTable: React.FC<BudgetSummaryTableProps> = ({
  className,
  userId,
  selectedMonth,
  parentTransactions,
}) => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const { data, error } = useSelector((state: { summary: any }) => state.summary);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempCategories, setTempCategories] = useState<{ name: string; percentage: number }[]>([]);
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<any[]>([]);
  const [modifiedCategories, setModifiedCategories] = useState<{ [key: string]: boolean }>({});
  const [totalError, setTotalError] = useState('');

  useEffect(() => {
    dispatch(fetchMonthlySummary({ userId, month: selectedMonth }));
  }, [dispatch, userId, selectedMonth]);

  useEffect(() => {
    if (data[selectedMonth]?.categories?.length) {
      setTempCategories(data[selectedMonth]?.categories);
    } else {
      setTempCategories(DEFAULT_CATEGORIES);
    }
  }, [data, selectedMonth]);

  useEffect(() => {
    setCurrentMonthTransactions(
      parentTransactions?.length
        ? parentTransactions
        : data[selectedMonth]?.transactions || [],
    );
  }, [parentTransactions, data, selectedMonth]);

  const budget = data[selectedMonth]?.budget ?? 100;

  const calculateSpent = (categoryName: string): number => {
    return currentMonthTransactions
      ?.filter(
        (transaction: Transaction) =>
          transaction.type === categoryName &&
          new Date(transaction.date).getMonth() + 1 === Number(selectedMonth),
      )
      .reduce((total: number, transaction: Transaction) => total + transaction.amount, 0);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateMonthlySummary({
        userId,
        month: selectedMonth,
        updatedSummary: {
          ...data[selectedMonth],
          budget: parseFloat(e.target.value) || 0,
        },
      }),
    );
  };

  interface Category {
    name: string;
    percentage: number;
  }

  const handlePercentageChange = (name: string, value: string) => {
    setTempCategories((prevCategories: Category[]) =>
      prevCategories.map((category: Category) =>
        category.name === name ? { ...category, percentage: parseInt(value, 10) || 0 } : category,
      ),
    );
  };

  const handleBlur = (name: string) => {
    setModifiedCategories((prev: { [key: string]: boolean }) => ({ ...prev, [name]: true }));
  };

  const handleUpdateSummary = () => {
    const totalModified = tempCategories
      .filter((cat) => modifiedCategories[cat.name])
      .reduce((sum, cat) => sum + cat.percentage, 0);

    const remainingPercentage = 100 - totalModified;
    const unmodifiedCategories = tempCategories.filter(
      (cat) => !modifiedCategories[cat.name],
    );

    const totalUnmodifiedPercent = unmodifiedCategories.reduce(
      (sum, cat) => sum + cat.percentage,
      0,
    );

    let finalCategories = tempCategories.map((category) => {
      if (!modifiedCategories[category.name]) {
        return {
          ...category,
          percentage:
            (category.percentage / totalUnmodifiedPercent) *
            remainingPercentage,
        };
      }
      return category;
    });

    const newTotal = finalCategories.reduce(
      (sum, cat) => sum + cat.percentage,
      0,
    );

    if (newTotal !== 100) {
      setTotalError('The total percentage must be exactly 100%');
      return;
    }

    setTotalError('');
    setTempCategories(finalCategories);

    dispatch(
      updateMonthlySummary({
        userId,
        month: selectedMonth,
        updatedSummary: {
          ...data[selectedMonth],
          categories: finalCategories,
          transactions: currentMonthTransactions,
        },
      }),
    );
  };

  return (
    <Card className={className} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{
            gap: '20px',
            minHeight: '40px',
          }}
        >
          <Typography variant="h6">Monthly Salary</Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ minWidth: '120px' }}
          >
            {isEditingBudget ? (
              <TextField
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                onBlur={() => setIsEditingBudget(false)}
                size="small"
                autoFocus
                sx={{ width: 80 }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{ minWidth: '80px', textAlign: 'right' }}
              >
                ₹{budget.toFixed()}
              </Typography>
            )}
            <IconButton
              size="small"
              onClick={() => setIsEditingBudget(!isEditingBudget)}
            >
              <Pencil size={18} />
            </IconButton>
          </Box>
        </Box>

        <Box>
          {tempCategories.map((category) => (
            <Box
              key={category.name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={1}
              py={1}
            >
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {category.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Allocated: ₹{((budget * category.percentage) / 100).toFixed()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Spent: ₹{calculateSpent(category.name).toFixed()}
                </Typography>
              </Box>
              <TextField
                type="number"
                size="small"
                sx={{ width: 60 }}
                value={category.percentage.toFixed()}
                onChange={(e) =>
                  handlePercentageChange(category.name, e.target.value)
                }
                onBlur={() => handleBlur(category.name)}
              />
            </Box>
          ))}
        </Box>

        {totalError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {totalError}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: '100%' }}
        onClick={handleUpdateSummary}
      >
        Update Summary
      </Button>
    </Card>
  );
};

export default BudgetSummaryTable;
