import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  CameraAlt as CameraIcon
} from '@mui/icons-material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface UserProfile {
  displayName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  photoURL: string;
  bio: string;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phoneNumber: '',
    department: '',
    position: '',
    photoURL: '',
    bio: '',
    preferences: {
      emailNotifications: true,
      darkMode: false,
      language: 'en'
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfile(data as UserProfile);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: keyof UserProfile['preferences'], value: boolean | string) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      setProfile(prev => ({ ...prev, photoURL }));
    } catch (err) {
      setError('Failed to upload photo');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date()
      });
      setSuccess(true);
      setEditing(false);
    } catch (err) {
      setError('Failed to save profile');
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
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box position="relative">
                <Avatar
                  src={profile.photoURL}
                  sx={{ width: 150, height: 150, mb: 2 }}
                />
                {editing && (
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper'
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    <CameraIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6">{profile.displayName}</Typography>
              <Typography color="textSecondary">{profile.position}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Personal Information</Typography>
              <Button
                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={saving}
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={profile.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Position"
                  value={profile.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={profile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  multiline
                  rows={4}
                  disabled={!editing}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Preferences
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Language"
                  value={profile.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  disabled={!editing}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Profile updated successfully!
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

export default Profile; 