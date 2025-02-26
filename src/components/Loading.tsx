import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import './Loading.scss';

interface LoadingProps {
  message?: string;
  size?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box className="loading-container">
      <CircularProgress size={size} />
      <Typography variant="body1" className="loading-message">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;