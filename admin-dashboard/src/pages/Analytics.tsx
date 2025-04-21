import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ShiftData {
  date: string;
  count: number;
  hours: number;
}

interface EmployeeHours {
  name: string;
  hours: number;
}

interface TimeOffStats {
  type: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [employeeHours, setEmployeeHours] = useState<EmployeeHours[]>([]);
  const [timeOffStats, setTimeOffStats] = useState<TimeOffStats[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch shifts data
      const shiftsQuery = query(
        collection(db, 'shifts'),
        where('startTime', '>=', getStartDate(timeRange))
      );
      const shiftsSnapshot = await getDocs(shiftsQuery);
      const shifts = shiftsSnapshot.docs.map(doc => ({
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
      }));

      // Process shift data
      const processedShiftData = processShiftData(shifts);
      setShiftData(processedShiftData);

      // Process employee hours
      const processedEmployeeHours = processEmployeeHours(shifts);
      setEmployeeHours(processedEmployeeHours);

      // Fetch and process time off requests
      const timeOffQuery = query(
        collection(db, 'timeOffRequests'),
        where('startDate', '>=', getStartDate(timeRange))
      );
      const timeOffSnapshot = await getDocs(timeOffQuery);
      const timeOffRequests = timeOffSnapshot.docs.map(doc => doc.data());
      const processedTimeOffStats = processTimeOffStats(timeOffRequests);
      setTimeOffStats(processedTimeOffStats);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  const getStartDate = (range: string) => {
    const now = new Date();
    switch (range) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setDate(now.getDate() - 7));
    }
  };

  const processShiftData = (shifts: any[]): ShiftData[] => {
    // Group shifts by date and calculate hours
    const groupedData = shifts.reduce((acc, shift) => {
      const date = shift.startTime.toLocaleDateString();
      const hours = (shift.endTime - shift.startTime) / (1000 * 60 * 60);
      
      if (!acc[date]) {
        acc[date] = { count: 0, hours: 0 };
      }
      acc[date].count++;
      acc[date].hours += hours;
      
      return acc;
    }, {});

    return Object.entries(groupedData).map(([date, data]: [string, any]) => ({
      date,
      count: data.count,
      hours: Math.round(data.hours * 10) / 10,
    }));
  };

  const processEmployeeHours = (shifts: any[]): EmployeeHours[] => {
    const groupedData = shifts.reduce((acc: { [key: string]: EmployeeHours }, shift) => {
      const hours = (shift.endTime.toDate().getTime() - shift.startTime.toDate().getTime()) / (1000 * 60 * 60);
      
      if (!acc[shift.assignedEmployee]) {
        acc[shift.assignedEmployee] = {
          name: shift.assignedEmployeeName || 'Unknown',
          hours: 0
        };
      }
      
      acc[shift.assignedEmployee].hours += hours;
      return acc;
    }, {});

    return Object.values(groupedData)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  };

  const processTimeOffStats = (requests: any[]): TimeOffStats[] => {
    const groupedData = requests.reduce((acc: { [key: string]: TimeOffStats }, request) => {
      if (!acc[request.type]) {
        acc[request.type] = {
          type: request.type || 'Unknown',
          count: 0
        };
      }
      
      acc[request.type].count++;
      return acc;
    }, {});

    return Object.values(groupedData)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last 7 Days</MenuItem>
            <MenuItem value="month">Last 30 Days</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shifts Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={shiftData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Number of Shifts" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="hours" name="Total Hours" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Employees by Hours
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Hours Worked" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Time Off Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeOffStats}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {timeOffStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics; 