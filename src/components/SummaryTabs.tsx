import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MonthTabs from "./MonthTabs";
import BudgetSummaryTable from "./BudgetSummaryTable";
import BudgetSummaryChart from "./BudgetSummaryChart";
import { useAuth } from "../context/AuthContext";
import "./SummaryTabs.scss";
import { useSelector } from "react-redux";

const SummaryTabs = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const transactions = useSelector((state: RootState) => state.transactions.transactions);


  return (
    <Box className="summary-tabs">
      <MonthTabs className="months-tabs" selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <div className="summary-table-container">
        {user ? (
          <BudgetSummaryTable
            userId={user?.id}
            parentTransactions={transactions}
            className="summary-table"
            selectedMonth={selectedMonth}
          />
        ) : (
          <p>Loading user data...</p>
        )}
        <div className="summary-chart">
          <BudgetSummaryChart selectedMonth={selectedMonth} parentTransactions={transactions} />
        </div>
      </div>
    </Box>
  );
};

export default SummaryTabs;
