import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addType, updateType, deleteType } from '../../features/typeSlice';
import { addTypeToAllSummaries, updateAllSummariesType } from '../../features/summarySlice';


const Types = () => {
  const dispatch = useDispatch<AppDispatch>();
  const types = useSelector((state: RootState) => state.types.types);
  const status = useSelector((state: RootState) => state.types.status);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState('');
  const [formError, setFormError] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: 'success' });

  const validateForm = () => {
    if (!formData.trim()) {
      setFormError('Type name is required');
      return false;
    }
    if (formData.length > 50) {
      setFormError('Type name must be less than 50 characters');
      return false;
    }
    if (!editItem && types.some(t => t.name.toLowerCase() === formData.toLowerCase())) {
      setFormError('Type name already exists');
      return false;
    }
    setFormError('');
    return true;
  };
  // Update handleSubmit
  const handleSubmit = async () => {
    if (!validateForm()) return;
  
    try {
      if (editItem) {
        await dispatch(updateType({
          id: editItem.id,  // Now using UUID
          updates: { name: formData.trim() }
        })).unwrap();
        
        await dispatch(updateAllSummariesType({ 
          oldName: editItem.name, 
          newName: formData.trim() 
        }));
  
        setShowAlert({ show: true, message: 'Type updated successfully!', type: 'success' });
      } else {
        const newType = await dispatch(addType(formData.trim())).unwrap();
        await dispatch(addTypeToAllSummaries(newType.name));
        setShowAlert({ show: true, message: 'Type added successfully!', type: 'success' });
      }
      setOpen(false);
      setFormData('');
      setFormError('');
    } catch (error: any) {
      setShowAlert({
        show: true,
        message: error.message || 'Error processing type. Please try again.',
        type: 'error'
      });
    }
  };
  // Update handleDelete
  const handleDelete = async (type: { id: string; name: string }) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      try {
        await dispatch(deleteType(type.id)).unwrap();
        await dispatch(updateAllSummariesType({ 
          oldName: type.name, 
          newName: '' 
        }));
        setShowAlert({ show: true, message: 'Type deleted successfully!', type: 'success' });
      } catch (error) {
        setShowAlert({
          show: true,
          message: 'Error deleting type. Please try again.',
          type: 'error'
        });
      }
    }
  };
  // Update Add Type button
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => handleOpen({ id: '', name: '' })}
    disabled={status === 'loading'}
  >
    Add Type
  </Button>
  // Remove the floating Button component and fix handleOpen
  const handleOpen = (type?: { id: string; name: string }) => {
    if (type && type.id) {
      setEditItem(type);
      setFormData(type.name);
    } else {
      setEditItem(null);
      setFormData('');
    }
    setOpen(true);
  };
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Manage Transaction Types</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={status === 'loading'}
        >
          Add Type
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {status === 'loading' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : status === 'failed' ? (
          <Alert severity="error">Failed to load transaction types</Alert>
        ) : (
          <List>
            {types.map((type) => (
              <ListItem
                key={type.id}
                sx={{
                  mb: 1,
                  backgroundColor: 'background.paper'
                }}
              >
                <ListItemText primary={type.name} />
                <ListItemSecondaryAction>
                  <IconButton 
                    onClick={() => handleOpen(type)}
                    disabled={status !== 'succeeded'}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete({ id: type.id, name: type.name })}
                    disabled={status !== 'succeeded'}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Edit Type' : 'Add Type'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Type Name"
              fullWidth
              value={formData}
              onChange={(e) => {
                setFormData(e.target.value);
                setFormError('');
              }}
              error={!!formError}
              helperText={formError}
              disabled={status === 'loading'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={status === 'loading'}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={status === 'loading'}
          >
            {editItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert.show}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ ...showAlert, show: false })}
      >
        <Alert 
          severity={showAlert.type as 'success' | 'error'} 
          onClose={() => setShowAlert({ ...showAlert, show: false })}
        >
          {showAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Types;