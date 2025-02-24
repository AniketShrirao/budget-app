import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Card, CardContent, Typography } from '@mui/material';
import NoDataAvailable from './NoDataAvailable';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
  '#00E396',
];

interface CategoryBreakdownChartProps {
  selectedMonth: string;
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  selectedMonth,
}) => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.transactions,
  );

  // Filter transactions for the selected month
  const currentMonthTransactions = transactions.filter(
    (tx) => new Date(tx.date).getMonth() + 1 === Number(selectedMonth),
  );

  // Get unique transaction categories
  const transactionCategories = Array.from(
    new Set(currentMonthTransactions.map((tx) => tx.category)),
  );

  const [activeCategories, setActiveCategories] = useState(
    transactionCategories.reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleLegendClick = (data: any) => {
    setActiveCategories((prev) => ({
      ...prev,
      [data.value]: !prev[data.value],
    }));
  };

  const filteredChartData = transactionCategories
    .map((category) => {
      const spent = currentMonthTransactions
        .filter((tx) => tx.category === category)
        .reduce((total, tx) => total + tx.amount, 0);

      return {
        name: category,
        value: spent,
        active: activeCategories[category],
      };
    });

  const hasSpentValues = filteredChartData.some((data) => data.value > 0);

  if (!hasSpentValues) {
    return (
      <Card style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6" align="center" gutterBottom>
            Category-wise Breakdown
          </Typography>
          <NoDataAvailable />
        </CardContent>
      </Card>
    );
  }

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`${filteredChartData[index].name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Category-wise Breakdown
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          This chart shows the breakdown of your spending by category for the
          selected month.
        </Typography>
        <div style={{ width: '100%', height: '320px', padding: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredChartData.filter((data) => data.active)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomLabel}
                paddingAngle={5}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {filteredChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={entry.active ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value}`}
                contentStyle={{
                  backgroundColor: '#333',
                  color: '#fff',
                  borderRadius: '5px',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                onClick={handleLegendClick}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;