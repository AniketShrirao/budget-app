interface CategoryData {
  id: number;
  title: string;
  icon?: string;
}

export const Categories: CategoryData[] = [
  { id: 1, title: 'Food', icon: '🍽️' },
  { id: 2, title: 'Transport', icon: '🚗' },
  { id: 3, title: 'Entertainment', icon: '🎮' },
  { id: 4, title: 'Shopping', icon: '🛍️' },
  { id: 5, title: 'Bills', icon: '📄' },
  { id: 6, title: 'Salary', icon: '💰' },
  { id: 7, title: 'Investment', icon: '📈' },
  { id: 8, title: 'Other', icon: '📌' }
];
