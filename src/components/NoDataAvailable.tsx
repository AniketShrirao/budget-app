import React from 'react';
import { Box, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { NoDataAvailableProps } from '../types';

const NoDataAvailable: React.FC<NoDataAvailableProps> = ({
  message = 'No data available',
  icon = <SentimentDissatisfied sx={{ fontSize: 48 }} />,
  className
}) => {
  return (
    <Box
      className={`no-data-container ${className || ''}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        color: 'text.secondary'
      }}
    >
      {icon}
      <Typography variant="h6" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default NoDataAvailable;