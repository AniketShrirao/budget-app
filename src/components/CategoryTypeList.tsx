import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { deleteCategoryType } from '../features/categorySlice';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CategoryType } from '../types';

interface CategoryTypeListProps {
  onEdit?: (type: CategoryType) => void;
}

const CategoryTypeList = ({ onEdit }: CategoryTypeListProps) => {
  const types = useSelector((state: RootState) => state.categories.types);
  const dispatch = useDispatch();
  const auth = useAuth();
  const userId = auth?.user?.id;

  const handleDelete = async (id: string) => {
    if (!userId) return;

    try {
      await dispatch(deleteCategoryType({ id, userId }) as any).unwrap();
      toast.success('Category type deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete category type');
    }
  };

  if (!types.length) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No category types found. Add your first type!
      </Typography>
    );
  }

  return (
    <List>
      {types.map((type) => (
        <ListItem key={type.id}>
          <ListItemText 
            primary={type.name}
            secondary={`Percentage: ${type.percentage}%`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={() => onEdit?.(type)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(type.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryTypeList;