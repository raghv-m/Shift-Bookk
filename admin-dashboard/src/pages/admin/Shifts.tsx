import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Shift } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Shifts: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState<Omit<Shift, 'id'>>({
    title: '',
    employeeId: '',
    startTime: Timestamp.fromDate(new Date()),
    endTime: Timestamp.fromDate(new Date()),
    status: 'scheduled',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });

  useEffect(() => {
    const q = query(collection(db, 'shifts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shiftsData: Shift[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        shiftsData.push({
          id: doc.id,
          ...data,
          startTime: data.startTime,
          endTime: data.endTime,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as Shift);
      });
      setShifts(shiftsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpen = (shift?: Shift) => {
    if (shift) {
      setSelectedShift(shift);
      setFormData({
        title: shift.title,
        employeeId: shift.employeeId,
        startTime: shift.startTime,
        endTime: shift.endTime,
        status: shift.status,
        createdAt: shift.createdAt,
        updatedAt: shift.updatedAt
      });
    } else {
      setSelectedShift(null);
      setFormData({
        title: '',
        employeeId: '',
        startTime: Timestamp.fromDate(new Date()),
        endTime: Timestamp.fromDate(new Date()),
        status: 'scheduled',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShift(null);
  };

  const handleSubmit = async () => {
    try {
      const shiftData = {
        ...formData,
        updatedAt: Timestamp.now()
      };

      if (selectedShift) {
        await setDoc(doc(db, 'shifts', selectedShift.id), shiftData, { merge: true });
      } else {
        const newDocRef = doc(collection(db, 'shifts'));
        await setDoc(newDocRef, {
          ...shiftData,
          createdAt: Timestamp.now()
        });
      }
      handleClose();
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  const handleDelete = async (shiftId: string) => {
    try {
      await deleteDoc(doc(db, 'shifts', shiftId));
    } catch (error) {
      console.error('Error deleting shift:', error);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Shifts</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add Shift
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.title}</TableCell>
                <TableCell>{shift.employeeId}</TableCell>
                <TableCell>{shift.startTime.toDate().toLocaleString()}</TableCell>
                <TableCell>{shift.endTime.toDate().toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={shift.status}
                    color={
                      shift.status === 'approved'
                        ? 'success'
                        : shift.status === 'rejected'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(shift)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(shift.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedShift ? 'Edit Shift' : 'Add Shift'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="Start Time"
                    value={formData.startTime.toDate()}
                    onChange={(newValue) => 
                      setFormData({ 
                        ...formData, 
                        startTime: newValue ? Timestamp.fromDate(newValue) : Timestamp.now() 
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker
                    label="End Time"
                    value={formData.endTime.toDate()}
                    onChange={(newValue) => 
                      setFormData({ 
                        ...formData, 
                        endTime: newValue ? Timestamp.fromDate(newValue) : Timestamp.now() 
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Shift['status'] })}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedShift ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shifts; 