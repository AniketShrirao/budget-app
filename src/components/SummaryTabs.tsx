import React, { useState } from "react";
import { Box } from "@mui/material";
import MonthTabs from "./MonthTabs";
import BudgetSummaryTable from "./BudgetSummaryTable"; // Assuming this component exists
import "./SummaryTabs.scss";
import BudgetSummaryChart from "./BudgetSummaryChart";

const SummaryTabs = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Start from 1

  return (
    <Box className="summary-tabs">
      <MonthTabs className="months-tabs" selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <div className="summary-table-container">
        <BudgetSummaryTable className="summary-table" selectedMonth={selectedMonth} />
        <BudgetSummaryChart />
      </div>
    </Box>
  );
};

export default SummaryTabs;
