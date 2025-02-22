import { supabase } from '../supabase';

interface Category {
  name: string;
  percentage: number;
}

interface SummaryData {
  budget: number;
  categories: Category[];
  transactions: any[];
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Needs', percentage: 50 },
  { name: 'Wants', percentage: 25 },
  { name: 'Investment', percentage: 20 },
  { name: 'Marriage', percentage: 16.67 },
];

export const fetchSummary = async (
  userId: string,
  month: string,
): Promise<SummaryData> => {
  const { data, error } = await supabase
    .from('summary')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .maybeSingle();

  if (error || !data) {
    console.warn('No summary found, returning default values.');
    return { budget: 100, categories: DEFAULT_CATEGORIES, transactions: [] };
  }

  return data;
};

export const updateSummary = async (
  userId: string,
  month: string,
  updatedSummary: Partial<SummaryData>,
): Promise<SummaryData | null> => {
  try {
    // Ensure the summary table exists
    await supabase.rpc('ensure_summary_table');

    console.log('Updating summary for', userId, month, updatedSummary);
    // Merge with default values to prevent missing fields
    const summaryToUpdate: SummaryData = {
      budget: updatedSummary.budget ?? 100,
      categories: updatedSummary.categories?.length
        ? updatedSummary.categories
        : DEFAULT_CATEGORIES,
      transactions: updatedSummary.transactions ?? [],
    };

    const { data, error } = await supabase
      .from('summary')
      .upsert([{ user_id: userId, month, ...summaryToUpdate }], {
        onConflict: 'user_id,month',
      })
      .select('*')
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error('Error updating summary:', (err as Error).message);
    return null;
  }
};
