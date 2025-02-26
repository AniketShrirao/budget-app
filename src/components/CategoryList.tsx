import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { deleteCategory } from '../features/categorySlice';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Category } from '../types';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
}

const CategoryList = ({ onEdit }: CategoryListProps) => {
  const categories = useSelector((state: RootState) => state.categories.categories);
  const dispatch = useDispatch<AppDispatch>();
  const auth = useAuth();
  const userId = auth?.user?.id;

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      await dispatch(deleteCategory({ id, userId })).unwrap();
      toast.success('Category deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { message?: string })?.message || 'Failed to delete category';
      toast.error(errorMessage);
    }
  };

  if (!categories.length) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No categories found. Add your first category!
      </Typography>
    );
  }

  return (
    <List>
      {categories.map((category) => (
        <ListItem key={category.id}>
          <ListItemText 
            primary={category.title}
            secondary={`Type: ${category.title}`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={() => onEdit?.({ ...category, title: category.title})}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(category.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryList;