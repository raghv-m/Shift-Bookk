import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
  Chip,
  Paper
} from '@mui/material';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Notification, formatTimestamp } from '../../types';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      })) as Notification[];
      setNotifications(notificationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <InfoIcon color="info" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon />;
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
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Paper>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              secondaryAction={
                !notification.read && (
                  <IconButton
                    edge="end"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                )
              }
              sx={{
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {notification.message}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(notification.createdAt)}
                    </Typography>
                  </>
                }
              />
              {!notification.read && (
                <Chip
                  label="New"
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications; 