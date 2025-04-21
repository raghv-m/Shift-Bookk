import React from 'react';
import { Box, Typography } from '@mui/material';

const FileManagement: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        File Management
      </Typography>
      <Typography>
        This page will handle file uploads and management.
      </Typography>
    </Box>
  );
};

export default FileManagement; 