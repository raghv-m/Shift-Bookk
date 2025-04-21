import React, { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 280px)`,
        ml: '280px',
        background: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Avatar
              src={user?.photoURL}
              alt={user?.displayName}
              sx={{ width: 32, height: 32, mr: 2 }}
            />
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {user?.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={signOut}>
            <LogoutIcon sx={{ mr: 2 }} />
            Sign Out
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 300,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          <MenuItem onClick={handleNotificationsClose}>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 