import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, TextField, IconButton, Box, Typography, Button, Alert } from "@mui/material";
import { Pencil } from "lucide-react";
import { Types } from "../data/types";
import { useSelector } from "react-redux"; 

// Function to generate fresh categories for each month
const generateCategories = () => {
  return Object.values(Types).map((type) => ({
    name: type,
    percentage: 100 / Object.keys(Types).length,
    spent: 0,
    isModified: false,
  }));
};

const BudgetSummaryTable = ({ className, selectedMonth }) => {
  const [budgets, setBudgets] = useState<{ [key: number]: number }>({});
  const [categories, setCategories] = useState<{ [key: number]: any[] }>({});
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempPercentages, setTempPercentages] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Fetch transactions from Redux
  const { transactions } = useSelector((state) => state.transactions);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Ensure state exists for the selected month when switching months
  useEffect(() => {
    setBudgets((prev) => ({
      ...prev,
      [selectedMonth]: prev[selectedMonth] ?? 50000, // Default budget if not set
    }));
    
    setCategories((prev) => ({
      ...prev,
      [selectedMonth]: prev[selectedMonth] ?? generateCategories(), // Fresh copy for new months
    }));
  }, [selectedMonth]);

  const calculateSpent = (categoryName) => {
    const categoryTransactions = transactions?.filter((transaction) => {
      const transactionMonth = new Date(transaction.date).getMonth() + 1;
      return transaction.type === categoryName && transactionMonth === selectedMonth;
    });
    return categoryTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseFloat(e.target.value) || 0;
    setBudgets((prev) => ({ ...prev, [selectedMonth]: newBudget }));
  };

  const handlePercentageChange = (name: string, value: string) => {
    if (!value || isNaN(Number(value))) return;

    setTempPercentages((prev) => ({ ...prev, [name]: value }));

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setCategories((prev) => {
        if (!prev[selectedMonth]) return prev;

        const updatedCategories = prev[selectedMonth].map((category) =>
          category.name === name ? { ...category, isModified: true, percentage: parseFloat(value) } : category
        );

        return { ...prev, [selectedMonth]: updatedCategories };
      });
    }, 500);
  };

  const handleUpdatePercentages = () => {
    let modifiedTotal = 0;
    let unmodifiedCategories = [];

    // Calculate modified total and identify unmodified categories
    const updatedCategories = categories[selectedMonth].map((category) => {
      const tempValue = tempPercentages[category.name];
      const newPercentage = tempValue !== undefined ? parseFloat(tempValue) : category.percentage;

      if (category.isModified) {
        modifiedTotal += newPercentage;
        return { ...category, percentage: newPercentage };
      } else {
        unmodifiedCategories.push(category);
        return category;
      }
    });

    const remainingPercentage = 100 - modifiedTotal;
    const unmodifiedCount = unmodifiedCategories.length;

    if (remainingPercentage < 0) {
      setErrorMessage("Total percentage exceeds 100%. Adjust values.");
      return;
    }

    // Distribute remaining percentage to unmodified categories
    if (remainingPercentage > 0 && unmodifiedCount > 0) {
      updatedCategories.forEach((category) => {
        if (!category.isModified) {
          category.percentage = remainingPercentage / unmodifiedCount;
        }
      });
    }

    setCategories((prev) => ({ ...prev, [selectedMonth]: updatedCategories }));
    setTempPercentages({});
    setErrorMessage(null);
  };

  const totalBudget = budgets[selectedMonth] || 0;
  const currentCategories = categories[selectedMonth] || generateCategories();

  return (
    <Card className={className} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Budget Summary</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {isEditingBudget ? (
              <TextField
                type="number"
                value={totalBudget}
                onChange={handleBudgetChange}
                onBlur={() => setIsEditingBudget(false)}
                size="small"
                autoFocus
              />
            ) : (
              <Typography variant="h6">₹{totalBudget.toFixed(2)}</Typography>
            )}
            <IconButton size="small" onClick={() => setIsEditingBudget(!isEditingBudget)}>
              <Pencil size={18} />
            </IconButton>
          </Box>
        </Box>

        {currentCategories.map((category) => {
          const allocated = ((totalBudget * category.percentage) / 100).toFixed(2);
          const spent = calculateSpent(category.name);

          return (
            <Box key={category.name} display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} py={1}>
              <Box>
                <Typography variant="body1" fontWeight="medium">{category.name}</Typography>
                <Typography variant="body2" color="textSecondary">Allocated: ₹{allocated}</Typography>
                <Typography variant="body2" color="textSecondary">Spent: ₹{spent.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <TextField
                  type="number"
                  size="small"
                  sx={{ width: 60 }}
                  value={tempPercentages[category.name] || category.percentage.toFixed(2)}
                  onChange={(e) => handlePercentageChange(category.name, e.target.value)}
                />
              </Box>
            </Box>
          );
        })}

        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}

        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleUpdatePercentages}>
            Update Percentages
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetSummaryTable;
