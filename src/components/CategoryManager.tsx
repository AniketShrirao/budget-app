import { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Button, Dialog } from '@mui/material';
import CategoryList from './CategoryList';
import CategoryTypeList from './CategoryTypeList';
import CategoryForm from './CategoryForm';
import CategoryTypeForm from './CategoryTypeForm';
import { CategoryType } from '../types';

const CategoryManager = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryType | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEdit = (item: CategoryType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Categories" />
        <Tab label="Types" />
      </Tabs>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          {activeTab === 0 ? (
            <>
              <CategoryList onEdit={handleEdit} />
              <Button
                variant="contained"
                onClick={() => setIsFormOpen(true)}
                sx={{ mt: 2 }}
              >
                Add Category
              </Button>
            </>
          ) : (
            <>
              <CategoryTypeList onEdit={handleEdit} />
              <Button
                variant="contained"
                onClick={() => setIsFormOpen(true)}
                sx={{ mt: 2 }}
              >
                Add Type
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onClose={handleClose}>
        {activeTab === 0 ? (
          <CategoryForm 
            onClose={handleClose}
            editingCategory={editingItem as CategoryType}
          />
        ) : (
          <CategoryTypeForm 
            onClose={handleClose}
            editingType={editingItem}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default CategoryManager;