import { useState } from 'react';
import { Box } from '@mui/material';
import MonthTabs from './MonthTabs';
import BudgetSummaryTable from './BudgetSummaryTable';
import BudgetSummaryChart from './BudgetSummaryChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import { useAuth } from '../context/AuthContext';
import './SummaryTabs.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SummaryTabs = () => {
  const authContext = useAuth();
  const user = authContext ? authContext.user : null;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );

  return (
    <Box className="summary-tabs">
      <MonthTabs
        className="months-tabs"
        selectedMonth={selectedMonth.toString()}
        onMonthChange={(newMonth: string) => setSelectedMonth(Number(newMonth))}
      />
      <div className="summary-table-container">
        {user ? (
          <BudgetSummaryTable
            userId={user?.id}
            parentTransactions={transactions}
            className="summary-table"
            selectedMonth={selectedMonth.toString()}
          />
        ) : (
          <p>Loading user data...</p>
        )}
        <div className="summary-chart">
          <BudgetSummaryChart
            selectedMonth={selectedMonth.toString()}
          />
        </div>
      </div>
      <div className="category-breakdown-chart">
        <CategoryBreakdownChart
          selectedMonth={selectedMonth.toString()}
        />
      </div>
    </Box>
  );
};

export default SummaryTabs;
