import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import './Loading.scss';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <Box className="loading-container">
      <CircularProgress size={40} />
      <Typography variant="h6" className="loading-text">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;