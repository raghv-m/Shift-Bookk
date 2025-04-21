import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  SelectChangeEvent
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Timestamp } from 'firebase/firestore';
import { Shift } from '../types';

interface ShiftFormProps {
  initialData?: Partial<Shift>;
  onSubmit: (formData: Partial<Shift>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ShiftForm: React.FC<ShiftFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Shift>>({
    title: '',
    employeeId: '',
    startTime: Timestamp.now(),
    endTime: Timestamp.now(),
    status: 'pending',
    isRecurring: false,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: '',
        employeeId: '',
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        status: 'pending',
        isRecurring: false,
        ...initialData
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStartTimeChange = (newValue: Date | null) => {
    setFormData(prev => ({
      ...prev,
      startTime: newValue ? Timestamp.fromDate(newValue) : Timestamp.now()
    }));
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    setFormData(prev => ({
      ...prev,
      endTime: newValue ? Timestamp.fromDate(newValue) : Timestamp.now()
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.employeeId?.trim()) {
      newErrors.employeeId = 'Employee ID is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.startTime && formData.endTime &&
               formData.endTime.toMillis() <= formData.startTime.toMillis()) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2}>
        {isEditing ? 'Edit Shift' : 'Add New Shift'}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Shift Title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId || ''}
            onChange={handleChange}
            error={!!errors.employeeId}
            helperText={errors.employeeId}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Start Time"
              value={formData.startTime?.toDate() || null}
              onChange={handleStartTimeChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.startTime,
                  helperText: errors.startTime
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="End Time"
              value={formData.endTime?.toDate() || null}
              onChange={handleEndTimeChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !!errors.endTime,
                  helperText: errors.endTime
                }
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status || 'pending'}
              onChange={handleSelectChange}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isRecurring || false}
                onChange={handleSwitchChange}
                name="isRecurring"
                color="primary"
              />
            }
            label="Recurring Shift"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update' : 'Create'} Shift
        </Button>
      </Box>
    </Box>
  );
};

export default ShiftForm; 