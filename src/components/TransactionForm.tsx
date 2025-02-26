import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { FormData, Transaction } from '../types';
import {
  addTransactionToDB,
  fetchTransactions,
} from '../features/transactionSlice';
import {
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import moment from 'moment';
import './TransactionForm.scss';
import { Categories } from '../data/categories';
import { Types } from '../data/types';
import { categoryTypeMapping } from '../data/categoryTypeMapping';
import { toast } from 'react-toastify';

interface FormChangeEvent {
  target: {
    name?: string;
    value: unknown;
  };
}

const TransactionForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormData>({
    date: moment().format('YYYY-MM-DD'),
    category: 'Other',
    description: '',
    amount: '',
    type: 'Needs',
    important: false,
    recurrence: 'None',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | FormChangeEvent
  ) => {
    const { name, value } = e.target;
    if (name) {
      setForm((prevForm) => {
        const updatedForm: FormData = {
          ...prevForm,
          [name]: value,
        };

        if (name === 'category') {
          const mappedType = categoryTypeMapping[value as string];
          updatedForm.type = mappedType || 'Needs';
        }

        return updatedForm;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const amount = Number(form.amount);
    if (amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    const transaction: Omit<Transaction, 'id' | 'user_id'> = {
      ...form,
      amount,
      status: 'pending',
    };

    try {
      await dispatch(addTransactionToDB({ ...transaction, user_id: '' })).unwrap();
      await dispatch(fetchTransactions()).unwrap();
      toast.success('Transaction added successfully!');

      setForm({
        date: moment().format('YYYY-MM-DD'),
        category: 'Other',
        description: '',
        amount: '',
        type: 'Needs',
        important: false,
        recurrence: 'None',
      });
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
    }
  };

  return (
    <form
      className="transaction-form"
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <TextField
        label="Date"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        required
      />
      <TextField
        label="Category"
        select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        {Categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.title}>
            {cat.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="description"
        label="Description"
        value={form.description}
        onChange={handleChange}
      />
      <TextField
        type="number"
        name="amount"
        label="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <TextField
        label="Type"
        select
        name="type"
        value={form.type}
        onChange={handleChange}
        required
      >
        {Object.values(Types).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={
          <Checkbox
            checked={form.important}
            onChange={() => setForm({ ...form, important: !form.important })}
          />
        }
        label="Important"
      />
      <TextField
        label="Recurrence"
        select
        name="recurrence"
        value={form.recurrence}
        onChange={handleChange}
      >
        {['None', 'Monthly', 'Quarterly', 'Yearly'].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
