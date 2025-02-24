import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { supabase } from '../lib/supabase';
import { fetchLendings } from '../features/lendingSlice';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import './AddLendingForm.scss';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const AddLendingForm: React.FC<{ onAddLending: () => void }> = ({ onAddLending }) => {
  const dispatch: AppDispatch = useDispatch();
  const auth = useAuth();
  const user = auth?.user;
  const [borrower, setBorrower] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [period, setPeriod] = useState('');
  const [reminderfrequency, setReminderFrequency] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User is not authenticated');
      return;
    }
    setIsSubmitting(true);
    const { error } = await supabase.from('lendings').insert([{ borrower, amount, date, period, reminderfrequency, user_email: user.email }]);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      dispatch(fetchLendings());
      setBorrower('');
      setAmount('');
      setDate('');
      setPeriod('');
      setReminderFrequency('');
      onAddLending(); // Call the onAddLending function to trigger the reminder

      // Send acknowledgment email
      if (user) {
        const functionUrl = import.meta.env.MODE === 'development'
          ? 'http://localhost:8888/.netlify/functions/sendReminder'
          : '/.netlify/functions/sendReminder';

        fetch(functionUrl, {
          method: 'POST',
          body: JSON.stringify({
            email: user.email,
            borrower,
            amount,
            type: 'acknowledgment',
          }),
        });
      }

      // Show success toast notification
      toast.success('Lending reminder added successfully!');
    }
    setIsSubmitting(false);
  };

  if (isSubmitting) {
    return <Loading message="Adding lending..." />;
  }

  return (
    <Card className="add-lending-form-card">
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Add Lending
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} className="add-lending-form">
          <TextField
            label="Borrower"
            value={borrower}
            onChange={(e) => setBorrower(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Period"
            type="date"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Reminder Frequency</InputLabel>
            <Select
              value={reminderfrequency}
              onChange={(e) => setReminderFrequency(e.target.value as string)}
              label="Reminder Frequency"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Lending
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLendingForm;