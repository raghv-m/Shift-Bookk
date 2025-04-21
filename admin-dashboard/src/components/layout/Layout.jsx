import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - 280px)`,
          minHeight: '100vh',
          background: theme.palette.background.default,
        }}
      >
        <Navbar />
        <Box sx={{ mt: 8 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 