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
import { Transaction } from '../features/transactionSlice';

const COLORS = {
  Allocated: '#4CAF50', // Green for Allocated
  Spent: '#F44336', // Red for Spent
};

interface BudgetSummaryChartProps {
  selectedMonth: string;
  parentTransactions: Array<{ type: string; amount: number }>;
}

const BudgetSummaryChart: React.FC<BudgetSummaryChartProps> = ({ selectedMonth, parentTransactions }) => {
  const { data } = useSelector((state: any) => state.summary);

  // Merge transactions from Redux store and parentTransactions
  const currentMonthTransactions = [
    ...(data[selectedMonth]?.transactions || []),
    ...parentTransactions,
  ];

  const categories = data[selectedMonth]?.categories || [];
  if (!categories.length) {
    return (
      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        No data available
      </p>
    );
  }

  interface Category {
    name: string;
    percentage: number;
  }

  interface ChartData {
    category: string;
    Allocated: number;
    Spent: number;
  }

  const chartData: ChartData[] = categories.map((category: Category): ChartData => {
    const spent: number = currentMonthTransactions
      .filter((tx: Transaction) => tx.type === category.name)
      .reduce((total: number, tx: Transaction) => total + tx.amount, 0);

    const allocated: number = Math.round(
      (data[selectedMonth]?.budget * category.percentage) / 100,
    );

    return {
      category: category.name,
      Allocated: Math.round(allocated), // Ensure integer values
      Spent: Math.round(spent), // Ensure integer values
    };
  });

  return (
    <div style={{ width: '100%', height: '320px', padding: '10px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={10}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E0E0E0"
          />
          <XAxis dataKey="category" tick={{ fontSize: 14, fontWeight: 500 }} />
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
  );
};

export default BudgetSummaryChart;
