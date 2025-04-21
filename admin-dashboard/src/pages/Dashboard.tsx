import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  EventBusy as EventBusyIcon,
  AssignmentTurnedIn as AssignmentIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  
  // Sample data for the charts
  const weeklyHoursData = [
    { name: 'Mon', hours: 40 },
    { name: 'Tue', hours: 45 },
    { name: 'Wed', hours: 38 },
    { name: 'Thu', hours: 42 },
    { name: 'Fri', hours: 35 },
    { name: 'Sat', hours: 20 },
    { name: 'Sun', hours: 15 },
  ];

  const departmentData = [
    { name: 'Operations', employees: 12 },
    { name: 'Sales', employees: 8 },
    { name: 'IT', employees: 4 },
    { name: 'HR', employees: 2 },
  ];

  const shiftStatusData = [
    { name: 'Completed', value: 58 },
    { name: 'Upcoming', value: 27 },
    { name: 'In Progress', value: 15 },
  ];

  const COLORS = [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Overview of your organization's scheduling metrics
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<DateRangeIcon />}
          sx={{ borderRadius: 2 }}
        >
          Schedule Report
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: alpha(theme.palette.primary.main, 0.07),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                    mr: 2
                  }}
                >
                  <PeopleIcon />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  Total Employees
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ ml: 8, fontWeight: 'bold' }}>
                24
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: alpha(theme.palette.success.main, 0.07),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.success.main, 0.15),
                    color: theme.palette.success.main,
                    mr: 2
                  }}
                >
                  <AssignmentIcon />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  Active Shifts
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ ml: 8, fontWeight: 'bold' }}>
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: alpha(theme.palette.warning.main, 0.07),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.warning.main, 0.15),
                    color: theme.palette.warning.main,
                    mr: 2
                  }}
                >
                  <EventBusyIcon />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  Pending Time Off
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ ml: 8, fontWeight: 'bold' }}>
                3
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 2,
            background: alpha(theme.palette.info.main, 0.07),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[4]
            }
          }}>
            <CardContent sx={{ py: 3 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.info.main, 0.15),
                    color: theme.palette.info.main,
                    mr: 2
                  }}
                >
                  <AccessTimeIcon />
                </Box>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  Total Hours This Week
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ ml: 8, fontWeight: 'bold' }}>
                235
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 2, 
            height: '100%',
            background: alpha(theme.palette.background.paper, 0.7),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Weekly Hours Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
                    />
                    <YAxis 
                      tick={{ fill: theme.palette.text.secondary }}
                      axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: alpha(theme.palette.background.paper, 0.9),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 8
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke={theme.palette.primary.main} 
                      strokeWidth={3}
                      dot={{ r: 4, fill: theme.palette.primary.main }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Employees by Department
                  </Typography>
                  <Box sx={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.2)} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
                        />
                        <YAxis 
                          tick={{ fill: theme.palette.text.secondary }}
                          axisLine={{ stroke: alpha(theme.palette.divider, 0.2) }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 8
                          }}
                        />
                        <Bar 
                          dataKey="employees" 
                          fill={theme.palette.primary.main}
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: 2,
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Shift Status
                  </Typography>
                  <Box sx={{ height: 220, display: 'flex', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={shiftStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {shiftStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            borderRadius: 8
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 