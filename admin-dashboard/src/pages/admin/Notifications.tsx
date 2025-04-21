import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  createdAt: Timestamp;
  read: boolean;
  targetUsers: string[];
  userId: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'error' | 'success'
  });
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
        createdAt: doc.data().createdAt?.toDate()
      })) as Notification[];
      setNotifications(notificationsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpen = (notification?: Notification) => {
    if (notification) {
      setSelectedNotification(notification);
      setFormData({
        title: notification.title,
        message: notification.message,
        type: notification.type
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNotification(null);
    setFormData({
      title: '',
      message: '',
      type: 'info'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (selectedNotification) {
        await updateDoc(doc(db, 'notifications', selectedNotification.id), {
          ...formData,
          updatedAt: new Date()
        });
      } else {
        await addDoc(collection(db, 'notifications'), {
          ...formData,
          userId: user.uid,
          createdAt: Timestamp.fromDate(new Date())
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeColor = (type: Notification['type']): 'info' | 'warning' | 'error' | 'success' | 'primary' => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'primary';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Notifications</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Notification
        </Button>
      </Box>

      <Paper>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              divider
              sx={{
                bgcolor: notification.read ? 'background.paper' : 'action.hover'
              }}
            >
              <ListItemIcon>
                <NotificationsIcon color={getTypeColor(notification.type)} />
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {notification.message}
                    </Typography>
                    <br />
                    {format(notification.createdAt.toDate(), 'MMM d, yyyy HH:mm')}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={notification.type}
                  color={getTypeColor(notification.type)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                {!notification.read && (
                  <IconButton
                    edge="end"
                    onClick={() => handleOpen(notification)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(notification.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedNotification ? 'Edit Notification' : 'Add Notification'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Message"
              fullWidth
              multiline
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'warning' | 'error' | 'success' })}
                label="Type"
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="success">Success</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedNotification ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Notifications; 