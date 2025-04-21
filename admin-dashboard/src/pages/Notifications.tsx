import React, { useState } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Divider, IconButton, Chip, Menu, MenuItem, Button, CircularProgress
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  DoneAll as DoneAllIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Event as EventIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@mui/icons-material';
import { useNotifications } from '../context/NotificationContext';
import { formatTimestamp } from '../types';

const Notifications: React.FC = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, requestPushPermission } = useNotifications();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleMarkAsRead = async () => {
    if (selectedId) {
      await markAsRead(selectedId);
      handleMenuClose();
    }
  };

  const handleDelete = async () => {
    if (selectedId) {
      await deleteNotification(selectedId);
      handleMenuClose();
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };
  
  const handleRequestPushPermission = async () => {
    await requestPushPermission();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'warning':
        return <WarningIcon sx={{ color: theme.palette.warning.main }} />;
      case 'info':
        return <InfoIcon sx={{ color: theme.palette.info.main }} />;
      case 'error':
        return <InfoIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <NotificationsIcon sx={{ color: theme.palette.primary.main }} />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Stay updated on important events and messages
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Button 
            startIcon={<NotificationsActiveIcon />} 
            onClick={handleRequestPushPermission}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Enable Push Notifications
          </Button>
          {unreadCount > 0 && (
            <Button 
              startIcon={<DoneAllIcon />} 
              onClick={handleMarkAllAsRead}
              sx={{ mr: 2 }}
            >
              Mark All as Read
            </Button>
          )}
          <Chip 
            label={`${unreadCount} unread`}
            color="primary"
            variant={unreadCount > 0 ? "filled" : "outlined"}
          />
        </Box>
      </Box>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <List sx={{ padding: 0 }}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 3,
                    py: 2,
                    transition: 'background-color 0.2s',
                    bgcolor: !notification.read ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, notification.read ? 0.02 : 0.07)
                    }
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, notification.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: alpha(
                          notification.type === 'success'
                            ? theme.palette.success.main
                            : notification.type === 'warning'
                              ? theme.palette.warning.main
                              : notification.type === 'info'
                                ? theme.palette.info.main
                                : theme.palette.error.main,
                          0.1
                        ),
                        color: notification.type === 'success'
                          ? theme.palette.success.main
                          : notification.type === 'warning'
                            ? theme.palette.warning.main
                            : notification.type === 'info'
                              ? theme.palette.info.main
                              : theme.palette.error.main
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={notification.read ? 'regular' : 'medium'}>
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              bgcolor: theme.palette.primary.main,
                              borderRadius: '50%',
                              ml: 1
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatTimestamp(notification.createdAt)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          ) : (
            <Box p={4} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.2), mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up!
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {selectedId && notifications.find(n => n.id === selectedId)?.read === false && (
          <MenuItem onClick={handleMarkAsRead}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Notifications; 