import { TransactionType } from '../types';

export const categoryTypeMapping: Record<string, TransactionType> = {
  Food: 'Needs',
  Transport: 'Needs',
  Entertainment: 'Wants',
  Shopping: 'Wants',
  Bills: 'Needs',
  Salary: 'Income',
  Investment: 'Savings',
  Other: 'Needs'
};
