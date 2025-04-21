import React from 'react';
import { Box, Typography } from '@mui/material';

const Announcements: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>
      <Typography>
        This page will display company announcements and updates.
      </Typography>
    </Box>
  );
};

export default Announcements; 