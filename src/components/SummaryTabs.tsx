import React, { useState } from "react";
import { Box } from "@mui/material";
import MonthTabs from "./MonthTabs";
import BudgetSummaryTable from "./BudgetSummaryTable"; // Assuming this component exists
import "./SummaryTabs.scss";
import BudgetSummaryChart from "./BudgetSummaryChart";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";

const SummaryTabs = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Start from 1

  return (
    <Box className="summary-tabs">
      <MonthTabs className="months-tabs" selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <div className="summary-table-container">
        <BudgetSummaryTable userId={user.id} className="summary-table" selectedMonth={selectedMonth} />
        <BudgetSummaryChart />
      </div>
    </Box>
  );
};

export default SummaryTabs;
