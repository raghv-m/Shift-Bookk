import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { Shift } from '../../types';
import { calculateHoursBetweenTimestamps } from '../../utils/timeHelpers';

const Analytics: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchShifts = async () => {
      setLoading(true);
      try {
        const shiftsRef = collection(db, 'shifts');
        const q = query(shiftsRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedShifts: Shift[] = [];
        querySnapshot.forEach((doc) => {
          fetchedShifts.push({
            id: doc.id,
            ...doc.data()
          } as Shift);
        });
        
        setShifts(fetchedShifts);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [user]);

  const getTimeRangeData = () => {
    const now = new Date();
    let startDate: Date;

    if (timeRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }

    return shifts.filter(shift => {
      if (!shift.startTime) return false;
      const shiftDate = shift.startTime.toDate();
      return shiftDate >= startDate && shiftDate <= now;
    });
  };

  const getEmployeeHoursData = () => {
    const filteredShifts = getTimeRangeData();
    const employeeHours = new Map<string, number>();
    
    filteredShifts.forEach(shift => {
      const hours = calculateHoursBetweenTimestamps(shift.startTime, shift.endTime);
      const currentHours = employeeHours.get(shift.employeeId) || 0;
      employeeHours.set(shift.employeeId, currentHours + hours);
    });
    
    return Array.from(employeeHours.entries()).map(([employeeId, hours]) => ({
      name: `Employee ${employeeId.substring(0, 5)}...`,
      hours
    }));
  };

  const getShiftStatusData = () => {
    const filteredShifts = getTimeRangeData();
    const statusCounts = filteredShifts.reduce((counts, shift) => {
      counts[shift.status] = (counts[shift.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };

  const getTotalStats = () => {
    const filteredShifts = getTimeRangeData();
    
    const totalHours = filteredShifts.reduce((total, shift) => {
      return total + calculateHoursBetweenTimestamps(shift.startTime, shift.endTime);
    }, 0);
    
    const uniqueEmployees = new Set(filteredShifts.map(shift => shift.employeeId)).size;
    
    return {
      totalShifts: filteredShifts.length,
      totalHours: Math.round(totalHours * 10) / 10,
      averageShiftLength: filteredShifts.length > 0 ? Math.round((totalHours / filteredShifts.length) * 10) / 10 : 0,
      uniqueEmployees
    };
  };
  
  const stats = getTotalStats();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A64AEE', '#FF6B6B'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View insights and stats for your team's shifts
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => setTimeRange('week')} 
            variant={timeRange === 'week' ? 'contained' : 'outlined'}
          >
            Last Week
          </Button>
          <Button 
            onClick={() => setTimeRange('month')} 
            variant={timeRange === 'month' ? 'contained' : 'outlined'}
          >
            Last Month
          </Button>
          <Button 
            onClick={() => setTimeRange('year')} 
            variant={timeRange === 'year' ? 'contained' : 'outlined'}
          >
            Last Year
          </Button>
        </ButtonGroup>
      </Box>
      
      <Grid container spacing={3}>
        {/* Summary Statistics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Shifts</Typography>
              <Typography variant="h3">{stats.totalShifts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Hours</Typography>
              <Typography variant="h3">{stats.totalHours}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Avg Shift Length</Typography>
              <Typography variant="h3">{stats.averageShiftLength} hrs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Employees Scheduled</Typography>
              <Typography variant="h3">{stats.uniqueEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Employee Hours Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Employee Hours</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={getEmployeeHoursData()}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Shift Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>Shift Status Distribution</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={getShiftStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getShiftStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics; 