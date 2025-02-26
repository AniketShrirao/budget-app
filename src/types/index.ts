import { ThunkAction, Action } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Basic type definitions
export type TransactionType = 'Needs' | 'Wants' | 'Savings' | 'Income';
export type RecurrenceType = 'None' | 'Monthly' | 'Quarterly' | 'Yearly';
export type TransactionStatus = 'pending' | 'completed';
export type ReminderFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Category related types
export interface Category {
  id: string;
  title: string;
  icon?: string;
  user_id: string;
}

export interface CategoryType {
  id: string;
  name: string;
  percentage: number;
  user_id: string;
}

export interface CategoryFormData {
  title: string;
  icon?: string;
  type: string;
}

export interface CategoryTypeFormData {
  name: string;
  percentage: number;
}

export interface CategoryBudget {
  name: string;
  percentage: number;
  active?: boolean;
}

export interface CategoryFormProps {
  onClose: () => void;
  editingCategory?: Category | null;
  isEditing?: boolean;
}

export interface CategoryValidation {
  name: string;
  type: CategoryType;
}

// Transaction related types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  important: boolean;
  recurrence: RecurrenceType;
  user_id: string;
}

export interface FormData {
  date: string;
  category: string;
  description: string;
  amount: string;
  type: TransactionType;
  important: boolean;
  recurrence: RecurrenceType;
}

// Lending related types
export interface LendingFormData {
  borrower: string;
  amount: string;
  date: string;
  time: string;
  period: string;
  reminderfrequency: ReminderFrequency;
}

// Chart related types
export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface CategoryTotal {
  [key: string]: {
    total: number;
    color?: string;
  };
}

export interface ChartData {
  type: string;
  Allocated: number;
  Spent: number;
}

export interface CategoryChartData {
  name: string;
  value: number;
  active: boolean;
}

// Component props types
export interface NoDataAvailableProps {
  message?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export interface BudgetSummaryChartProps {
  selectedMonth: string;
}

export interface CategoryBreakdownChartProps {
  selectedMonth: string;
}

export interface BudgetSummaryTableProps {
  className?: string;
  userId: string;
  selectedMonth: string;
  parentTransactions?: Transaction[];
}

export interface TransactionTableProps {
  filteredTransactions: Transaction[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface TransactionOverlayProps {
  txn: Transaction | null;
  setSelectedTxn: (txn: Transaction | null) => void;
}

export interface EditableCellProps {
  value: number;
  isEditing: boolean;
  onChange: (value: number) => void;
  onEditComplete: () => void;
}

// Table related types
export interface Column {
  label: string;
  field: keyof Transaction | 'actions';
  visible: boolean;
  format?: (value: number) => string;
  render?: (txn: Transaction) => JSX.Element;
}

export interface RowColorProps {
  important?: boolean;
  recurrence?: string;
}

// State interfaces
export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthError {
  message: string;
}

export interface SummaryState {
  data: Record<string, MonthlySummary>;
  error: string | null;
  loading: boolean;
}

export interface MonthlySummary {
  budget: number;
  categories: Category[];
  transactions: Transaction[];
}

export interface SummaryData {
  budget: number;
  categories: CategoryBudget[];
}

// Utility types
export type CategoryUpdatePayload = Partial<Category> & { id: string };
export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  RootState,
  unknown,
  Action<string>
>;

export type RowChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;