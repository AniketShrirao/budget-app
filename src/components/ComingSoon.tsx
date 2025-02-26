import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import './ComingSoon.scss';

const ComingSoon: React.FC = () => {
  return (
    <Paper elevation={3} className="coming-soon">
      <Box p={4} textAlign="center">
        <Typography variant="h4" component="h2" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="textSecondary">
          This feature is currently under development. Stay tuned for updates!
        </Typography>
      </Box>
    </Paper>
  );
};

export default ComingSoon;
