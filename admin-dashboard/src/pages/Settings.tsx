import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Timestamp } from 'firebase/firestore';

interface Settings {
  organizationName: string;
  timeZone: string;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  defaultShiftDuration: number;
  allowShiftOverlap: boolean;
}

const defaultSettings: Settings = {
  organizationName: '',
  timeZone: 'UTC',
  enableNotifications: true,
  enableEmailAlerts: true,
  defaultShiftDuration: 8,
  allowShiftOverlap: false
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSettings(docSnap.data() as Settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const settingsData = {
        ...settings,
        updatedAt: Timestamp.now()
      };
      await setDoc(doc(db, 'settings', 'general'), settingsData, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Organization Name"
            fullWidth
            value={settings.organizationName}
            onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Time Zone"
            fullWidth
            value={settings.timeZone}
            onChange={(e) => setSettings({ ...settings, timeZone: e.target.value })}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Default Shift Duration (hours)"
            type="number"
            fullWidth
            value={settings.defaultShiftDuration}
            onChange={(e) => setSettings({ ...settings, defaultShiftDuration: Number(e.target.value) })}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
              />
            }
            label="Enable Notifications"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableEmailAlerts}
                onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
              />
            }
            label="Enable Email Alerts"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.allowShiftOverlap}
                onChange={(e) => setSettings({ ...settings, allowShiftOverlap: e.target.checked })}
              />
            }
            label="Allow Shift Overlap"
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          Save Settings
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings; 