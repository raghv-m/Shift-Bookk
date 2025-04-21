import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { AppUser, formatTimestamp } from '../../types';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Partial<AppUser>>({
    displayName: '',
    email: '',
    department: '',
    role: 'employee',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as AppUser;
        setUserData({
          displayName: data.displayName,
          email: data.email,
          department: data.department,
          role: data.role,
          status: data.status
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...userData,
        updatedAt: Timestamp.now()
      });
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (error) {
      setError('Error updating profile');
      setSuccess(null);
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
        My Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Avatar
                sx={{ width: 100, height: 100 }}
                alt={userData.displayName || 'User'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Display Name"
                value={userData.displayName}
                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                value={userData.email}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                value={userData.department}
                onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Role"
                value={userData.role}
                disabled
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Status"
                value={userData.status}
                disabled
                fullWidth
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
            {success && (
              <Grid item xs={12}>
                <Alert severity="success">{success}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 