import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Chip, Card, CardContent, CardActions, Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { People as PeopleIcon, Mail as MailIcon, Phone as PhoneIcon } from '@mui/icons-material';

const Team: React.FC = () => {
  const theme = useTheme();
  
  // Dummy team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'Shift Manager',
      department: 'Operations',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567',
      status: 'active',
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Team Lead',
      department: 'Customer Service',
      email: 'sarah.williams@example.com',
      phone: '(555) 234-5678',
      status: 'active',
      avatar: 'S'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Associate',
      department: 'Sales',
      email: 'michael.chen@example.com',
      phone: '(555) 345-6789',
      status: 'on leave',
      avatar: 'M'
    },
    {
      id: 4,
      name: 'Jessica Adams',
      role: 'Associate',
      department: 'Operations',
      email: 'jessica.adams@example.com',
      phone: '(555) 456-7890',
      status: 'active',
      avatar: 'J'
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Team Members
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage your team
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PeopleIcon />}>
          Add Team Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6]
                },
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    sx={{ 
                      width: 56, 
                      height: 56,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
                      fontSize: '1.5rem'
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Box ml={2}>
                    <Typography variant="h6" component="div">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                    <Chip 
                      label={member.status} 
                      size="small" 
                      sx={{ 
                        mt: 0.5,
                        bgcolor: member.status === 'active' 
                          ? alpha(theme.palette.success.main, 0.1) 
                          : alpha(theme.palette.warning.main, 0.1),
                        color: member.status === 'active' 
                          ? theme.palette.success.dark 
                          : theme.palette.warning.dark,
                        fontWeight: 'medium',
                        border: `1px solid ${member.status === 'active' 
                          ? alpha(theme.palette.success.main, 0.3) 
                          : alpha(theme.palette.warning.main, 0.3)}`
                      }}
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={1}>
                  <strong>Department:</strong> {member.department}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <MailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="center">
                  <PhoneIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.phone}
                  </Typography>
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button size="small" variant="outlined">View Profile</Button>
                <Button size="small" variant="contained">Message</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Team; 