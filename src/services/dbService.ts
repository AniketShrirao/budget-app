import Dexie, { Table } from 'dexie';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'expense' | 'income';
  user_email: string;
}

interface Lending {
  id: string;
  borrower: string;
  amount: number;
  date: string;
  period: string;
  reminderfrequency: string;
  user_email: string;
}

export class BudgetDB extends Dexie {
  transactions!: Table<Transaction>;
  lendings!: Table<Lending>;

  constructor() {
    super('BudgetDB');
    this.version(1).stores({
      transactions: 'id, user_email, date, type',
      lendings: 'id, user_email, date, borrower'
    });
  }
}

export const db = new BudgetDB();