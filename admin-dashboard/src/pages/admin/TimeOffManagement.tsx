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
import { collection, query, onSnapshot, doc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { TimeOffRequest, AppUser, formatTimestamp } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TimeOffManagement: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimeOffRequests = async () => {
      try {
        const q = query(collection(db, 'timeOff'));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const requests = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data();
              const employeeRef = doc(db, 'users', data.employeeId);
              const employeeDoc = await getDoc(employeeRef);
              const employeeData = employeeDoc?.data() as AppUser | undefined;
              
              return {
                id: docSnapshot.id,
                ...data,
                employeeName: employeeData?.displayName || 'Unknown',
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
                startDate: data.startDate?.toDate(),
                endDate: data.endDate?.toDate(),
              } as TimeOffRequest;
            })
          );
          setTimeOffRequests(requests);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching time off requests:', error);
        setLoading(false);
      }
    };

    fetchTimeOffRequests();
  }, []);

  const handleOpenDialog = (request?: TimeOffRequest) => {
    if (request) {
      setSelectedRequest(request);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'timeOffRequests', requestId), {
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating time off request:', error);
    }
  };

  const filteredRequests = timeOffRequests.filter(request => 
    filter === 'all' || request.status === filter
  );

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
        <Typography variant="h4">Time Off Management</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            label="Filter"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employeeName}</TableCell>
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
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusChange(request.id, 'approved')}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleStatusChange(request.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Time Off Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">Employee: {selectedRequest.employeeName}</Typography>
              <Typography variant="subtitle1">Start Date: {formatTimestamp(selectedRequest.startDate)}</Typography>
              <Typography variant="subtitle1">End Date: {formatTimestamp(selectedRequest.endDate)}</Typography>
              <Typography variant="subtitle1">Reason: {selectedRequest.reason}</Typography>
              <Typography variant="subtitle1">Status: {selectedRequest.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeOffManagement; 