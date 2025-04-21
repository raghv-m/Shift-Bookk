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
  Chip
} from '@mui/material';
import { collection, query, where, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { TimeLog, formatTimestamp } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TimeLog: React.FC = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TimeLog | null>(null);
  const [formData, setFormData] = useState<Partial<TimeLog>>({
    clockIn: Timestamp.now(),
    clockOut: Timestamp.now(),
    status: 'in-progress'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'timeLogs'),
      where('employeeId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clockIn: doc.data().clockIn,
        clockOut: doc.data().clockOut,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      })) as TimeLog[];
      setTimeLogs(logs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenDialog = (log?: TimeLog) => {
    if (log) {
      setSelectedLog(log);
      setFormData({
        clockIn: log.clockIn,
        clockOut: log.clockOut,
        status: log.status
      });
    } else {
      setSelectedLog(null);
      setFormData({
        clockIn: Timestamp.now(),
        clockOut: Timestamp.now(),
        status: 'in-progress'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
    setFormData({
      clockIn: Timestamp.now(),
      clockOut: Timestamp.now(),
      status: 'in-progress'
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const logData = {
        ...formData,
        employeeId: user.uid,
        updatedAt: Timestamp.now()
      };

      if (selectedLog) {
        await updateDoc(doc(db, 'timeLogs', selectedLog.id), logData);
      } else {
        const newDocRef = doc(collection(db, 'timeLogs'));
        await updateDoc(newDocRef, {
          ...logData,
          createdAt: Timestamp.now()
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving time log:', error);
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
        <Typography variant="h4">Time Logs</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add Time Log
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Clock In</TableCell>
              <TableCell>Clock Out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatTimestamp(log.clockIn)}</TableCell>
                <TableCell>{log.clockOut ? formatTimestamp(log.clockOut) : 'Not clocked out'}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={log.status === 'completed' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>{formatTimestamp(log.createdAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(log)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedLog ? 'Edit Time Log' : 'Add Time Log'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Clock In"
              type="datetime-local"
              value={formData.clockIn ? new Date(formData.clockIn.toDate()).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, clockIn: Timestamp.fromDate(new Date(e.target.value)) })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Clock Out"
              type="datetime-local"
              value={formData.clockOut ? new Date(formData.clockOut.toDate()).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, clockOut: Timestamp.fromDate(new Date(e.target.value)) })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TimeLog['status'] })}
                label="Status"
              >
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedLog ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeLog; 