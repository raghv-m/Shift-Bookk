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
import { TimeOffRequest, formatTimestamp } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TimeOff: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [formData, setFormData] = useState<Partial<TimeOffRequest>>({
    startDate: Timestamp.now(),
    endDate: Timestamp.now(),
    reason: '',
    status: 'pending'
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'timeOffRequests'),
      where('employeeId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate,
        endDate: doc.data().endDate,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt
      })) as TimeOffRequest[];
      setTimeOffRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleOpenDialog = (request?: TimeOffRequest) => {
    if (request) {
      setSelectedRequest(request);
      setFormData({
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
        status: request.status
      });
    } else {
      setSelectedRequest(null);
      setFormData({
        startDate: Timestamp.now(),
        endDate: Timestamp.now(),
        reason: '',
        status: 'pending'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
    setFormData({
      startDate: Timestamp.now(),
      endDate: Timestamp.now(),
      reason: '',
      status: 'pending'
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const requestData = {
        ...formData,
        employeeId: user.uid,
        employeeName: user.displayName || 'Unknown',
        updatedAt: Timestamp.now()
      };

      if (selectedRequest) {
        await updateDoc(doc(db, 'timeOffRequests', selectedRequest.id), requestData);
      } else {
        const newDocRef = doc(collection(db, 'timeOffRequests'));
        await updateDoc(newDocRef, {
          ...requestData,
          createdAt: Timestamp.now()
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving time off request:', error);
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
        <Typography variant="h4">Time Off Requests</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Request Time Off
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeOffRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{formatTimestamp(request.startDate)}</TableCell>
                <TableCell>{formatTimestamp(request.endDate)}</TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={
                      request.status === 'approved'
                        ? 'success'
                        : request.status === 'rejected'
                        ? 'error'
                        : 'warning'
                    }
                  />
                </TableCell>
                <TableCell>{formatTimestamp(request.createdAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(request)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedRequest ? 'Edit Time Off Request' : 'Request Time Off'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              value={formData.startDate ? new Date(formData.startDate.toDate()).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, startDate: Timestamp.fromDate(new Date(e.target.value)) })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={formData.endDate ? new Date(formData.endDate.toDate()).toISOString().split('T')[0] : ''}
              onChange={(e) => setFormData({ ...formData, endDate: Timestamp.fromDate(new Date(e.target.value)) })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TimeOffRequest['status'] })}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedRequest ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeOff; 