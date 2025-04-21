import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, Button, TextField, Tab, Tabs, Divider, 
  IconButton, Card, CardContent, Chip, List, ListItem, ListItemText, ListItemIcon, 
  CircularProgress 
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  EventNote as EventNoteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    displayName: currentUser?.displayName || 'Alex Johnson',
    email: currentUser?.email || 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'New York, NY',
    department: 'Operations',
    role: 'Shift Manager',
    bio: 'Experienced shift manager with 5+ years in retail operations. Passionate about team building and improving operational efficiency.'
  });

  // Sample stats data
  const statsData = {
    totalHours: 148,
    shiftsCompleted: 32,
    timeOffRequests: 2,
    upcomingShifts: 5
  };

  // Sample shift history
  const shiftHistory = [
    {
      id: 1,
      date: 'June 20, 2023',
      time: '8:00 AM - 4:00 PM',
      position: 'Shift Manager',
      location: 'Main Store'
    },
    {
      id: 2,
      date: 'June 18, 2023',
      time: '12:00 PM - 8:00 PM',
      position: 'Shift Manager',
      location: 'Downtown Branch'
    },
    {
      id: 3,
      date: 'June 15, 2023',
      time: '8:00 AM - 4:00 PM',
      position: 'Shift Manager',
      location: 'Main Store'
    }
  ];

  // Sample time off requests
  const timeOffRequests = [
    {
      id: 1,
      startDate: 'July 15, 2023',
      endDate: 'July 20, 2023',
      reason: 'Vacation',
      status: 'approved'
    },
    {
      id: 2,
      startDate: 'August 5, 2023',
      endDate: 'August 5, 2023',
      reason: 'Personal',
      status: 'pending'
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    if (editing) {
      // If we were editing and now saving
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setEditing(false);
      }, 800); // Simulate API call
    } else {
      // Start editing
      setEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset form data to original
    setUserData({
      displayName: currentUser?.displayName || 'Alex Johnson',
      email: currentUser?.email || 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      department: 'Operations',
      role: 'Shift Manager',
      bio: 'Experienced shift manager with 5+ years in retail operations. Passionate about team building and improving operational efficiency.'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Profile
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your account information and preferences
          </Typography>
        </Box>
        {!editing ? (
          <Button 
            variant="contained" 
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
          >
            Edit Profile
          </Button>
        ) : (
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<CancelIcon />}
              onClick={handleCancelEdit}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleEditToggle}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Box>

      <Paper
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        {/* Profile Header */}
        <Box 
          sx={{ 
            p: 4, 
            pb: 7,
            position: 'relative',
            background: `linear-gradient(120deg, ${alpha(theme.palette.primary.dark, 0.7)}, ${alpha(theme.palette.primary.main, 0.4)})`,
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            justifyContent: { xs: 'center', sm: 'flex-start' },
            gap: 3
          }}
        >
          <Avatar
            src="/user-avatar.jpg"
            alt={userData.displayName}
            sx={{
              width: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[3],
              mb: { xs: 2, sm: -3 }
            }}
          >
            {userData.displayName.charAt(0)}
          </Avatar>
          
          <Box>
            <Typography variant="h4" fontWeight="bold" color="white">
              {userData.displayName}
            </Typography>
            <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
              {userData.role} • {userData.department}
            </Typography>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ px: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 0,
                px: 3,
                py: 2
              }
            }}
          >
            <Tab label="Overview" />
            <Tab label="Shift History" />
            <Tab label="Time Off" />
            <Tab label="Settings" />
          </Tabs>
        </Box>
        
        <Divider />

        {/* Tab Panels */}
        <Box px={3}>
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              {/* Personal Information */}
              <Grid item xs={12} md={7}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  {editing ? (
                    // Edit mode
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="displayName"
                          value={userData.displayName}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={userData.phone}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="location"
                          value={userData.location}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Department"
                          name="department"
                          value={userData.department}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Position"
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          variant="outlined"
                          multiline
                          rows={4}
                        />
                      </Grid>
                    </>
                  ) : (
                    // View mode
                    <>
                      <Grid item xs={12}>
                        <List disablePadding>
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <EmailIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Email" 
                              secondary={userData.email} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <PhoneIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Phone" 
                              secondary={userData.phone} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <LocationIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Location" 
                              secondary={userData.location} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          
                          <ListItem sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <WorkIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Department & Position" 
                              secondary={`${userData.department} • ${userData.role}`} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                          
                          <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                            <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                              <PersonIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Bio" 
                              secondary={userData.bio} 
                              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                              secondaryTypographyProps={{ variant: 'body1' }}
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              
              {/* Stats and Upcoming */}
              <Grid item xs={12} md={5}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Stats This Month
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ 
                      height: '100%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      '&:hover': { boxShadow: theme.shadows[3] },
                      transition: 'box-shadow 0.3s'
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <AccessTimeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Hours
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {statsData.totalHours}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ 
                      height: '100%',
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                      '&:hover': { boxShadow: theme.shadows[3] },
                      transition: 'box-shadow 0.3s'
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EventNoteIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Shifts Completed
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {statsData.shiftsCompleted}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ 
                      height: '100%',
                      bgcolor: alpha(theme.palette.warning.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                      '&:hover': { boxShadow: theme.shadows[3] },
                      transition: 'box-shadow 0.3s'
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EventBusyIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Time Off Requests
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {statsData.timeOffRequests}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Card sx={{ 
                      height: '100%',
                      bgcolor: alpha(theme.palette.info.main, 0.05),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      '&:hover': { boxShadow: theme.shadows[3] },
                      transition: 'box-shadow 0.3s'
                    }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <EventAvailableIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                          <Typography variant="subtitle2" color="text.secondary">
                            Upcoming Shifts
                          </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">
                          {statsData.upcomingShifts}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Shift History Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Recent Shifts
            </Typography>
            
            <List>
              {shiftHistory.map((shift) => (
                <React.Fragment key={shift.id}>
                  <ListItem
                    sx={{
                      bgcolor: alpha(theme.palette.background.default, 0.3),
                      borderRadius: 2,
                      mb: 2,
                      py: 2
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">
                            {shift.date}
                          </Typography>
                          <Chip 
                            label={shift.position}
                            size="small"
                            sx={{ 
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 'medium'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body1" gutterBottom>
                            {shift.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Location: {shift.location}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            
            <Box textAlign="center" mt={3}>
              <Button variant="outlined">
                View All Shifts
              </Button>
            </Box>
          </TabPanel>

          {/* Time Off Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                Time Off Requests
              </Typography>
              <Button variant="contained" size="small">
                Request Time Off
              </Button>
            </Box>
            
            <List>
              {timeOffRequests.map((request) => (
                <React.Fragment key={request.id}>
                  <ListItem
                    sx={{
                      bgcolor: alpha(theme.palette.background.default, 0.3),
                      borderRadius: 2,
                      mb: 2,
                      py: 2
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">
                            {request.startDate} {request.endDate !== request.startDate && `- ${request.endDate}`}
                          </Typography>
                          <Chip 
                            label={request.status}
                            size="small"
                            sx={{ 
                              bgcolor: request.status === 'approved' 
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                              color: request.status === 'approved' 
                                ? theme.palette.success.main
                                : theme.palette.warning.main,
                              fontWeight: 'medium'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography variant="body1" gutterBottom>
                            Reason: {request.reason}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Account Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Change Password"
                  type="password"
                  variant="outlined"
                  placeholder="Enter new password"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  placeholder="Confirm new password"
                  sx={{ mb: 3 }}
                />
                <Button variant="contained">
                  Update Password
                </Button>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                  Notification Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Configure how you'd like to receive notifications
                </Typography>
                
                {/* Note: We'd typically add checkboxes or switches here */}
                <Button variant="outlined" sx={{ mt: 1 }}>
                  Configure Notifications
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 