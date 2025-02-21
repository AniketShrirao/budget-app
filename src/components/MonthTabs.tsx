import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface TabsProps {
  selectedMonth: number; // 1-based
  onMonthChange: (newMonth: number) => void;
}

const MonthTabs: React.FC<TabsProps> = ({ className, selectedMonth, onMonthChange }) => {
  return (
    <Box className={className}>
      <Tabs
        value={selectedMonth - 1} // Convert 1-based to 0-based for MUI Tabs
        onChange={(event, newValue) => onMonthChange(newValue + 1)} // Convert 0-based to 1-based
        scrollButtons="auto"
        variant="scrollable"
        sx={{ flexGrow: 1 }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <Tab key={index + 1} label={new Date(0, index).toLocaleString('en-US', { month: 'long' })} />
        ))}
      </Tabs>
    </Box>
  );
};

export default MonthTabs;
