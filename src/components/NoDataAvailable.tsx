import React from 'react';
import { Typography } from '@mui/material';

const NoDataAvailable: React.FC = () => {
  return (
    <Typography
      variant="h6"
      align="center"
      color="textSecondary"
      style={{ marginTop: '20px' }}
    >
      No data available
    </Typography>
  );
};

export default NoDataAvailable;