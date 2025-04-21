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
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { doc, onSnapshot, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { SystemSettings } from '../../types';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Partial<SystemSettings>>({
    organizationName: '',
    timeZone: 'UTC',
    workWeekStart: 'Monday',
    workWeekEnd: 'Friday',
    allowShiftOverlap: false,
    maxShiftDuration: 8,
    minShiftDuration: 4,
    requireShiftApproval: true,
    allowTimeOffRequests: true,
    maxTimeOffDays: 20,
    requireTimeOffApproval: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, 'systemSettings', 'settings'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SystemSettings;
        setSettings(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'systemSettings', 'settings'), {
        ...settings,
        updatedAt: Timestamp.now()
      });
      setSuccess('Settings updated successfully');
      setError(null);
    } catch (error) {
      setError('Error updating settings');
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
        System Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Organization Name"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  value={settings.timeZone}
                  onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
                  label="Time Zone"
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="EST">Eastern Time</MenuItem>
                  <MenuItem value="CST">Central Time</MenuItem>
                  <MenuItem value="MST">Mountain Time</MenuItem>
                  <MenuItem value="PST">Pacific Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Work Week Start</InputLabel>
                <Select
                  value={settings.workWeekStart}
                  onChange={(e) => setSettings({ ...settings, workWeekStart: e.target.value })}
                  label="Work Week Start"
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Work Week End</InputLabel>
                <Select
                  value={settings.workWeekEnd}
                  onChange={(e) => setSettings({ ...settings, workWeekEnd: e.target.value })}
                  label="Work Week End"
                >
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Shift Duration (hours)"
                type="number"
                value={settings.maxShiftDuration}
                onChange={(e) => setSettings({ ...settings, maxShiftDuration: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Minimum Shift Duration (hours)"
                type="number"
                value={settings.minShiftDuration}
                onChange={(e) => setSettings({ ...settings, minShiftDuration: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Time Off Days"
                type="number"
                value={settings.maxTimeOffDays}
                onChange={(e) => setSettings({ ...settings, maxTimeOffDays: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowShiftOverlap}
                    onChange={(e) => setSettings({ ...settings, allowShiftOverlap: e.target.checked })}
                  />
                }
                label="Allow Shift Overlap"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireShiftApproval}
                    onChange={(e) => setSettings({ ...settings, requireShiftApproval: e.target.checked })}
                  />
                }
                label="Require Shift Approval"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowTimeOffRequests}
                    onChange={(e) => setSettings({ ...settings, allowTimeOffRequests: e.target.checked })}
                  />
                }
                label="Allow Time Off Requests"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireTimeOffApproval}
                    onChange={(e) => setSettings({ ...settings, requireTimeOffApproval: e.target.checked })}
                  />
                }
                label="Require Time Off Approval"
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
                Update Settings
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default SystemSettingsPage; 