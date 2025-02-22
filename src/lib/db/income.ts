import { supabase } from '../supabase';

// Add Income
interface Income {
  amount: number;
  description?: string;
  date?: string;
}

export const addIncome = async (income: Income): Promise<Income[]> => {
  const { data, error } = await supabase.from('income').insert([income]);

  if (error) throw error;
  return data || [];
};

// Get Total Income
export const getTotalIncome = async () => {
  const { data, error } = await supabase.from('income').select('amount');

  if (error) throw error;
  return data.reduce((acc, entry) => acc + entry.amount, 0);
};
