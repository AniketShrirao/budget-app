import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  IconButton,
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { Pencil } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateMonthlySummary, fetchMonthlySummary } from "../features/summarySlice";

const DEFAULT_CATEGORIES = [
  { name: "Needs", percentage: 20 },
  { name: "Wants", percentage: 20 },
  { name: "Investment", percentage: 30 },
  { name: "Marriage", percentage: 30 },
];

const BudgetSummaryTable = ({ className, userId, selectedMonth }) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.summary);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempCategories, setTempCategories] = useState([]);
  const [modifiedCategories, setModifiedCategories] = useState({});
  const [totalError, setTotalError] = useState("");

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

  const budget = data[selectedMonth]?.budget ?? 100;
  const transactions = data[selectedMonth]?.transactions || [];

  const calculateSpent = (categoryName) => {
    return transactions
      ?.filter(
        (transaction) =>
          transaction.type === categoryName &&
          new Date(transaction.date).getMonth() + 1 === selectedMonth
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const handleBudgetChange = (e) => {
    dispatch(updateMonthlySummary({
      userId,
      month: selectedMonth,
      updatedSummary: { ...data[selectedMonth], budget: parseFloat(e.target.value) || 0 },
    }));
  };

  const handlePercentageChange = (name, value) => {
    setTempCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.name === name ? { ...category, percentage: parseInt(value, 10) || 0 } : category
      )
    );
  };

  const handleBlur = (name) => {
    setModifiedCategories((prev) => ({ ...prev, [name]: true }));
  };

  const handleUpdateSummary = () => {
    const totalModified = tempCategories
      .filter((cat) => modifiedCategories[cat.name])
      .reduce((sum, cat) => sum + cat.percentage, 0);
    
    const remainingPercentage = 100 - totalModified;
    const unmodifiedCategories = tempCategories.filter((cat) => !modifiedCategories[cat.name]);

    // Calculate the sum of unmodified categories
    const totalUnmodifiedPercent = unmodifiedCategories.reduce((sum, cat) => sum + cat.percentage, 0);

    let finalCategories = tempCategories.map((category) => {
      if (!modifiedCategories[category.name]) {
        return {
          ...category,
          percentage: (category.percentage / totalUnmodifiedPercent) * remainingPercentage,
        };
      }
      return category;
    });

    const newTotal = finalCategories.reduce((sum, cat) => sum + cat.percentage, 0);

    if (newTotal !== 100) {
      setTotalError("The total percentage must be exactly 100%");
      return;
    }

    setTotalError("");
    setTempCategories(finalCategories);

    dispatch(updateMonthlySummary({
      userId,
      month: selectedMonth,
      updatedSummary: { ...data[selectedMonth], categories: finalCategories },
    }));
  };

  return (
    <Card className={className} sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Budget Summary</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {isEditingBudget ? (
              <TextField
                type="number"
                value={budget}
                onChange={handleBudgetChange}
                onBlur={() => setIsEditingBudget(false)}
                size="small"
                autoFocus
              />
            ) : (
              <Typography variant="h6">₹{budget.toFixed(2)}</Typography>
            )}
            <IconButton size="small" onClick={() => setIsEditingBudget(!isEditingBudget)}>
              <Pencil size={18} />
            </IconButton>
          </Box>
        </Box>

        {tempCategories.map((category) => (
          <Box key={category.name} display="flex" justifyContent="space-between" alignItems="center" borderBottom={1} py={1}>
            <Box>
              <Typography variant="body1" fontWeight="medium">{category.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Allocated: ₹{((budget * category.percentage) / 100).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Spent: ₹{calculateSpent(category.name).toFixed(2)}
              </Typography>
            </Box>
            <TextField
              type="number"
              size="small"
              sx={{
                width: 60,
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              value={category.percentage}
              onChange={(e) => handlePercentageChange(category.name, e.target.value)}
              onBlur={() => handleBlur(category.name)}
            />
          </Box>
        ))}

        {totalError && <Alert severity="error" sx={{ mt: 2 }}>{totalError}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </CardContent>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdateSummary}>
        Update Summary
      </Button>
    </Card>
  );
};

export default BudgetSummaryTable;
