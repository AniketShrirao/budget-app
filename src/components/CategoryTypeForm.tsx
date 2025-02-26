import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { addCategoryType, editCategoryType } from '../features/categorySlice';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import { Category } from '../types';

interface CategoryTypeFormProps {
  onClose: () => void;
  editingType?: Category | null;
}

const CategoryTypeForm = ({ onClose, editingType }: CategoryTypeFormProps) => {
  const [formData, setFormData] = useState({
    name: editingType?.name || '',
    percentage: editingType?.percentage || 0,
  });
  const dispatch = useDispatch();
  const auth = useAuth();
  const userId = auth?.user?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      if (editingType && '_id' in editingType && typeof editingType._id === 'string') {
        await dispatch(editCategoryType({
          id: editingType._id,
          type: formData,
          userId
        }) as any).unwrap();
        toast.success('Category type updated successfully');
      } else {
        await dispatch(addCategoryType({
          type: formData,
          userId
        }) as any).unwrap();
        toast.success('Category type added successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save category type');
    }
  };

  return (
    <>
      <DialogTitle>
        {editingType ? 'Edit Category Type' : 'Add Category Type'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Percentage"
            type="number"
            value={formData.percentage}
            onChange={(e) => setFormData(prev => ({ ...prev, percentage: Number(e.target.value) }))}
            margin="normal"
            required
            inputProps={{ min: 0, max: 100 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingType ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </>
  );
};

export default CategoryTypeForm;