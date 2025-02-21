import { supabase } from "../supabase";

export const fetchSummary = async (userId: string, month: string) => {
  const { data, error } = await supabase
    .from('summary')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .single(); // Get only one record

  if (error) {
    console.error('Error fetching summary:', error.message);
    return null;
  }

  return data;
};

export const updateSummary = async (
  userId: string,
  month: string,
  updatedSummary: Record<string, any>
) => {
  const { data, error } = await supabase
    .from('summary')
    .upsert([{ user_id: userId, month, ...updatedSummary }], { onConflict: ['user_id', 'month'] });

  if (error) {
    console.error('Error updating summary:', error.message);
    return null;
  }

  return data;
};
