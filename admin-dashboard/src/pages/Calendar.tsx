import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, IconButton, Chip } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
  EventBusy as EventBusyIcon
} from '@mui/icons-material';

const Calendar: React.FC = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Morning Shift',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      type: 'shift',
      time: '8:00 AM - 12:00 PM'
    },
    {
      id: 2,
      title: 'Team Meeting',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      type: 'meeting',
      time: '2:00 PM - 3:30 PM'
    },
    {
      id: 3,
      title: 'Evening Shift',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      type: 'shift',
      time: '5:00 PM - 10:00 PM'
    },
    {
      id: 4,
      title: 'Time Off Request',
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      type: 'timeoff',
      time: 'All Day'
    }
  ];

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate array of days for the current month view
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!day) return [];
    
    return events.filter(event => 
      event.date.getDate() === day.getDate() &&
      event.date.getMonth() === day.getMonth() &&
      event.date.getFullYear() === day.getFullYear()
    );
  };

  // Format month and year for the header
  const getMonthYearString = () => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Navigation methods
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calendar days
  const calendarDays = generateCalendarDays();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Calendar
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your schedule and events
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<EventIcon />}>
          Add Event
        </Button>
      </Box>

      {/* Calendar Navigation */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 2,
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={goToPreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ mx: 2, fontWeight: 'medium' }}>
            {getMonthYearString()}
          </Typography>
          <IconButton onClick={goToNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Button startIcon={<TodayIcon />} onClick={goToToday}>
          Today
        </Button>
      </Paper>

      {/* Calendar Grid */}
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          background: alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        {/* Weekday Headers */}
        <Grid container>
          {weekdays.map((day, index) => (
            <Grid
              item
              xs={12/7}
              key={index}
              sx={{
                p: 1.5,
                textAlign: 'center',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }}
            >
              <Typography variant="subtitle2" fontWeight="medium">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container sx={{ minHeight: '60vh' }}>
          {calendarDays.map((day, index) => (
            <Grid
              item
              xs={12/7}
              key={index}
              sx={{
                height: '100%',
                p: 1,
                borderRight: index % 7 !== 6 ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.05)
                }
              }}
            >
              {day && (
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: day.getDate() === new Date().getDate() &&
                                   day.getMonth() === new Date().getMonth() &&
                                   day.getFullYear() === new Date().getFullYear()
                                   ? 'bold' : 'normal',
                      color: day.getDate() === new Date().getDate() &&
                             day.getMonth() === new Date().getMonth() &&
                             day.getFullYear() === new Date().getFullYear()
                             ? theme.palette.primary.main : 'inherit',
                      display: 'inline-block',
                      textAlign: 'center',
                      width: 24,
                      height: 24,
                      lineHeight: '24px',
                      borderRadius: '50%',
                      bgcolor: day.getDate() === new Date().getDate() &&
                               day.getMonth() === new Date().getMonth() &&
                               day.getFullYear() === new Date().getFullYear()
                               ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                    }}
                  >
                    {day.getDate()}
                  </Typography>
                  
                  {/* Events for this day */}
                  <Box mt={1}>
                    {getEventsForDay(day).map(event => (
                      <Box
                        key={event.id}
                        sx={{
                          mb: 0.5,
                          p: 0.5,
                          borderRadius: 1,
                          bgcolor: event.type === 'shift'
                            ? alpha(theme.palette.primary.main, 0.1)
                            : event.type === 'meeting'
                              ? alpha(theme.palette.info.main, 0.1)
                              : alpha(theme.palette.warning.main, 0.1),
                          borderLeft: `3px solid ${
                            event.type === 'shift'
                              ? theme.palette.primary.main
                              : event.type === 'meeting'
                                ? theme.palette.info.main
                                : theme.palette.warning.main
                          }`,
                          '&:hover': {
                            bgcolor: event.type === 'shift'
                              ? alpha(theme.palette.primary.main, 0.2)
                              : event.type === 'meeting'
                                ? alpha(theme.palette.info.main, 0.2)
                                : alpha(theme.palette.warning.main, 0.2)
                          }
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" display="block">
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Calendar; 