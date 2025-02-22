import { supabase } from '../supabase';

// Add Income
export const addIncome = async (income) => {
  const { data, error } = await supabase.from('income').insert([income]);

  if (error) throw error;
  return data;
};

// Get Total Income
export const getTotalIncome = async () => {
  const { data, error } = await supabase.from('income').select('amount');

  if (error) throw error;
  return data.reduce((acc, entry) => acc + entry.amount, 0);
};
