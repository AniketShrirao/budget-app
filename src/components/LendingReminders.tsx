import React, { useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react';
import { AppDispatch, RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLendings, deleteLending, updateLending } from '../features/lendingSlice';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Alert, Grid, IconButton, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import './LendingReminder.scss';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface Lending {
  id: string;
  borrower: string;
  amount: number;
  date: string;
  period: string;
  reminderfrequency: string;
}

const LendingReminders = forwardRef((_, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lendings, loading, error } = useSelector((state: RootState) => state.lendings);
  const auth = useAuth();
  const user = auth?.user;

  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ borrower: '', amount: '', date: '', period: '', reminderfrequency: '' });

  useEffect(() => {
    dispatch(fetchLendings());
  }, [dispatch]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleEditClick = (lending: Lending) => {
    setEditRowId(lending.id);
    setEditData({
      borrower: lending.borrower,
      amount: lending.amount.toString(), // Convert number to string for form
      date: lending.date,
      period: lending.period,
      reminderfrequency: lending.reminderfrequency,
    });
  };

  const handleDeleteClick = (lending: Lending) => {
    dispatch(deleteLending(lending.id));
  };

  const handleSaveClick = (id: string) => {
    const updatedLending = { 
      ...editData,
      id,
      amount: parseFloat(editData.amount) // Convert string to number
    };
    dispatch(updateLending(updatedLending));
    setEditRowId(null);
  };

  const handleCancelClick = () => {
    setEditRowId(null);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({ ...prevData, [name]: value }));
  };

  const checkReminders = useCallback(() => {
    const now = new Date();
    lendings.forEach((lending) => {
      const reminderDate = new Date(lending.date);
      const reminderFrequency = lending.reminderfrequency;

      if (reminderFrequency === 'daily') {
        reminderDate.setDate(reminderDate.getDate() + 1);
      } else if (reminderFrequency === 'weekly') {
        reminderDate.setDate(reminderDate.getDate() + 7);
      } else if (reminderFrequency === 'monthly') {
        reminderDate.setMonth(reminderDate.getMonth() + 1);
      } else if (reminderFrequency === 'yearly') {
        reminderDate.setFullYear(reminderDate.getFullYear() + 1);
      }

      if (now >= reminderDate) {
        new Notification('Lending Reminder', {
          body: `Reminder to ask ${lending.borrower} for payback of ₹${lending.amount}`,
        });

        // Send email reminder
        if (user) {
          fetch('/.netlify/functions/sendReminder', {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              borrower: lending.borrower,
              amount: lending.amount,
            }),
          });
        } else {
          console.error('User not logged in');
        }
      }
    });
  }, [lendings, user]);

  useImperativeHandle(ref, () => ({
    checkReminders,
  }));

  useEffect(() => {
    const interval = setInterval(checkReminders, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [checkReminders]);

  if (loading) return <Loading message="Loading lending data..." />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card elevation={0} className="lending-reminders-card">
          <CardContent >
            <Typography variant="h6" align="center" gutterBottom>
              Lending Reminders
            </Typography>
            <Table  className="lending-table">
              <TableHead>
                <TableRow>
                  <TableCell title="Borrower">Borrower</TableCell>
                  <TableCell title="Amount">Amount</TableCell>
                  <TableCell title="Date">Date</TableCell>
                  <TableCell title="Period">Period</TableCell>
                  <TableCell title="Reminder Frequency">Reminder Frequency</TableCell>
                  <TableCell title="Actions">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lendings.map((lending) => (
                  <TableRow key={lending.id}>
                    <TableCell data-label="Borrower">
                      {editRowId === lending.id ? (
                        <TextField
                          name="borrower"
                          value={editData.borrower}
                          onChange={handleTextFieldChange}
                          size="small"
                        />
                      ) : (
                        <span>{lending.borrower}</span>
                      )}
                    </TableCell>
                    <TableCell data-label="Amount">
                      {editRowId === lending.id ? (
                        <TextField
                          name="amount"
                          value={editData.amount}
                          onChange={handleTextFieldChange}
                          fullWidth
                          size="small"
                        />
                      ) : (
                        `₹${lending.amount}`
                      )}
                    </TableCell>
                    <TableCell data-label="Date">
                      {editRowId === lending.id ? (
                        <TextField
                          name="date"
                          type="date"
                          value={editData.date}
                          onChange={handleTextFieldChange}
                          fullWidth
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      ) : (
                        new Date(lending.date).toLocaleDateString()
                      )}
                    </TableCell>
                    <TableCell data-label="Period">
                      {editRowId === lending.id ? (
                        <TextField
                          name="period"
                          type="date"
                          value={editData.period}
                          onChange={handleTextFieldChange}
                          fullWidth
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      ) : (
                        lending.period
                      )}
                    </TableCell>
                    <TableCell data-label="Reminder Frequency">
                      {editRowId === lending.id ? (
                        <Select
                          name="reminderfrequency"
                          value={editData.reminderfrequency}
                          onChange={handleSelectChange}
                          fullWidth
                          size="small"
                        >
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                          <MenuItem value="yearly">Yearly</MenuItem>
                        </Select>
                      ) : (
                        lending.reminderfrequency
                      )}
                    </TableCell>
                    <TableCell>
                      {editRowId === lending.id ? (
                        <>
                          <IconButton onClick={() => handleSaveClick(lending.id)} size="small">
                            <Save />
                          </IconButton>
                          <IconButton onClick={handleCancelClick} size="small">
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => handleEditClick(lending)} size="small">
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(lending)} size="small">
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
});

export default LendingReminders;