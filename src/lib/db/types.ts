import { supabase } from '../../lib/supabase';
import { TransactionType } from '../../types/type';

export const typesDB = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('transaction_types')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  async add(type: Omit<TransactionType, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('transaction_types')
      .insert([type])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<TransactionType>) {
    const { data, error } = await supabase
      .from('transaction_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('transaction_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return id;
  }
};