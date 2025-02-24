import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Transaction } from '../features/transactionSlice';
import NoDataAvailable from './NoDataAvailable';
import { Card, CardContent, Typography } from '@mui/material';

const COLORS = {
  Allocated: '#4CAF50', // Green for Allocated
  Spent: '#F44336', // Red for Spent
};

interface BudgetSummaryChartProps {
  selectedMonth: string;
}

const BudgetSummaryChart: React.FC<BudgetSummaryChartProps> = ({ selectedMonth }) => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );
  const summaryData = useSelector((state: RootState) => state.summary.data);

  // Filter transactions for the selected month
  const currentMonthTransactions = transactions.filter(
    (tx) => new Date(tx.date).getMonth() + 1 === Number(selectedMonth),
  );

  const categories = Array.from(
    new Set(currentMonthTransactions.map((tx) => tx.type)),
  );

  if (!categories.length) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Budget Summary
          </Typography>
          <NoDataAvailable />
        </CardContent>
      </Card>
    );
  }

  const budget = summaryData[selectedMonth]?.budget ?? 100;
  const categoryPercentages = summaryData[selectedMonth]?.categories ?? [];

  interface ChartData {
    type: string;
    Allocated: number;
    Spent: number;
  }

  const chartData: ChartData[] = categories.map((type) => {
    const spent = currentMonthTransactions
      .filter((tx) => tx.type === type)
      .reduce((total, tx) => total + tx.amount, 0);

    const category = categoryPercentages.find((cat) => cat.name === type);
    const allocated = category ? Math.round((budget * category.percentage) / 100) : 0;

    return {
      type,
      Allocated: Math.round(allocated),
      Spent: Math.round(spent),
    };
  });

  const hasSpentValues = chartData.some((data) => data.Spent > 0);

  if (!hasSpentValues) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Budget Summary
          </Typography>
          <NoDataAvailable />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Budget Summary
        </Typography>
        <div style={{ width: '100%', height: '320px', padding: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={10}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E0E0E0"
              />
              <XAxis dataKey="type" tick={{ fontSize: 14, fontWeight: 500 }} />
              <YAxis tick={{ fontSize: 14, fontWeight: 500 }} />
              <Tooltip
                formatter={(value, name) => [`₹${value}`, name]}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '500' }} />
              <Bar
                dataKey="Allocated"
                stackId="a"
                fill={COLORS.Allocated}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="Spent"
                stackId="a"
                fill={COLORS.Spent}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummaryChart;
