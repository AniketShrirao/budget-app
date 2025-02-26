import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addCategory, editCategory } from '../features/categorySlice';
import { toast } from 'react-toastify';
import { CategoryFormProps, Category } from '../types';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
});

const CategoryForm: React.FC<CategoryFormProps> = ({
  onClose,
  editingCategory,
  isEditing = false,
}) => {
  const dispatch = useDispatch();
  const auth = useAuth();

  const formik = useFormik<Category>({
    initialValues: {
      id: editingCategory?.id ?? '',
      title: editingCategory?.title ?? '',
      icon: editingCategory?.icon ?? '',
      user_id: editingCategory?.user_id?? '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const categoryData = {
          ...values,
          title: values.title // Map title field directly
        };
        
        if (isEditing && editingCategory) {
          await dispatch(editCategory({ 
            id: editingCategory.id,
            category: {
              ...categoryData,
              type: values.title.toString()
            },
            userId: auth?.user?.id ?? ''
          }) as any);
          toast.success('Category updated successfully!');
        } else {
          await dispatch(addCategory({ 
            category: {
              ...categoryData,
              type: categoryData.title.toString()
            },
            userId: auth?.user?.id ?? ''
          }) as any);
          toast.success('Category added successfully!');
        }
        onClose();
      } catch (error) {
        toast.error('Failed to save category');
      }
    },
  });

  return (
    <>
      <DialogTitle>{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formik.values.title}
              onChange={formik.handleChange}
              label="Type"
            >
              {['Needs', 'Wants', 'Savings', 'Marriage'].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            'Update'
          ) : (
            'Add'
          )}
        </Button>
      </DialogActions>
    </>
  );
};

export default CategoryForm;