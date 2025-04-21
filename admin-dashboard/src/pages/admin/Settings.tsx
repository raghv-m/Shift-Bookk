import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface Settings {
  companyName: string;
  timeZone: string;
  workHoursStart: string;
  workHoursEnd: string;
  overtimeEnabled: boolean;
  overtimeThreshold: number;
  overtimeRate: number;
  timeOffApprovalRequired: boolean;
  maxTimeOffDays: number;
  notificationEnabled: boolean;
  notificationEmail: string;
}

const defaultSettings: Settings = {
  companyName: '',
  timeZone: 'UTC',
  workHoursStart: '09:00',
  workHoursEnd: '17:00',
  overtimeEnabled: false,
  overtimeThreshold: 40,
  overtimeRate: 1.5,
  timeOffApprovalRequired: true,
  maxTimeOffDays: 20,
  notificationEnabled: false,
  notificationEmail: ''
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!user) return;

        const settingsDoc = await getDoc(doc(db, 'settings', user.uid));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSettings(data.settings || settings);
        }
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handleChange = (field: keyof Settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'settings', user.uid), {
        settings: settings,
        updatedAt: new Date()
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
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
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={settings.companyName}
                  onChange={handleChange('companyName')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Time Zone"
                  value={settings.timeZone}
                  onChange={handleChange('timeZone')}
                  select
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="PST">Pacific Time</option>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Work Hours Start"
                  type="time"
                  value={settings.workHoursStart}
                  onChange={handleChange('workHoursStart')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Work Hours End"
                  type="time"
                  value={settings.workHoursEnd}
                  onChange={handleChange('workHoursEnd')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notificationEnabled}
                      onChange={handleChange('notificationEnabled')}
                    />
                  }
                  label="Enable Email Notifications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.overtimeEnabled}
                      onChange={handleChange('overtimeEnabled')}
                    />
                  }
                  label="Enable Overtime"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.timeOffApprovalRequired}
                      onChange={handleChange('timeOffApprovalRequired')}
                    />
                  }
                  label="Require Time Off Approval"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Maximum Time Off Days"
                  type="number"
                  value={settings.maxTimeOffDays}
                  onChange={handleChange('maxTimeOffDays')}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 