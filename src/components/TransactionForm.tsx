import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
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
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import './TransactionForm.scss';
import { Categories } from '../data/categories';
import { Types } from '../data/types';
import { categoryTypeMapping } from '../data/categoryTypeMapping';
import type { Transaction } from '../features/transactionSlice';
import { toast } from 'react-toastify';

const TransactionForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const [form, setForm] = useState({
    date: '',
    category: 'Other',
    description: '',
    amount: '',
    type: 'Needs',
    important: false,
    recurrence: 'None',
  });

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    setForm((prevForm) => ({ ...prevForm, date: today }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === 'category' && {
        type: categoryTypeMapping[value as keyof typeof categoryTypeMapping] || 'Needs',
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (Number(form.amount) <= 0) {
      toast.error('Amount must be greater than 0', {
        style: { background: '#d32f2f', color: 'white' }
      });
      return;
    }

    const transaction: Transaction = {
      id: uuidv4(),
      ...form,
      amount: Number(form.amount),
      status: 'pending',
    };

    try {
      await dispatch(addTransactionToDB(transaction)).unwrap();
      await dispatch(fetchTransactions()).unwrap();
      
      toast.success('Transaction added successfully!', {
        style: { background: '#4caf50', color: 'white' }
      });

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
      toast.error('Failed to add transaction. Please try again.', {
        style: { background: '#d32f2f', color: 'white' }
      });
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
