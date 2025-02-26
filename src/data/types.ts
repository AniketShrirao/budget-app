import { TransactionType } from '../types';

export const Types: Record<TransactionType, TransactionType> = {
  Needs: 'Needs',
  Wants: 'Wants',
  Savings: 'Savings',
  Income: 'Income'
};
