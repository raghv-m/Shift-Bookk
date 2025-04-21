import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Define AppUser interface (assumed based on error context)
interface AppUser {
  id: string;
  name: string;
}

interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'sick' | 'personal';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface ShiftSwap {
  id: string;
  originalEmployeeId: string;
  originalEmployeeName: string;
  newEmployeeId: string;
  newEmployeeName: string;
  shiftId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const TimeOff: React.FC = () => {
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [shiftSwaps, setShiftSwaps] = useState<ShiftSwap[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(null);
  const [selectedSwap, setSelectedSwap] = useState<ShiftSwap | null>(null);
  const [openTimeOffDialog, setOpenTimeOffDialog] = useState(false);
  const [openSwapDialog, setOpenSwapDialog] = useState(false);

  useEffect(() => {
    fetchTimeOffRequests();
    fetchShiftSwaps();
  }, []);

  const fetchTimeOffRequests = async () => {
    try {
      const requestsSnapshot = await getDocs(collection(db, 'timeOffRequests'));
      const requestsData = await Promise.all(
        requestsSnapshot.docs.map(async (document) => {
          const data = document.data();
          // Fetch employee data
          const employeeRef = doc(db, 'users', data.employeeId); // Use doc from firebase/firestore
          const employeeDoc = await getDoc(employeeRef);
          const employeeData = employeeDoc.exists() ? (employeeDoc.data() as AppUser) : undefined;
          
          return {
            id: document.id,
            ...data,
            employeeName: employeeData?.name || 'Unknown',
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
          } as TimeOffRequest;
        })
      );
      setTimeOffRequests(requestsData);
    } catch (error) {
      console.error('Error fetching time off requests:', error);
    }
  };

  const fetchShiftSwaps = async () => {
    try {
      const swapsSnapshot = await getDocs(collection(db, 'shiftSwaps'));
      const swapsData = await Promise.all(
        swapsSnapshot.docs.map(async (document) => {
          const data = document.data();
          // Fetch original employee data
          const originalEmployeeRef = doc(db, 'users', data.originalEmployeeId);
          const originalEmployeeDoc = await getDoc(originalEmployeeRef);
          const originalEmployeeData = originalEmployeeDoc.exists()
            ? (originalEmployeeDoc.data() as AppUser)
            : undefined;
          
          // Fetch new employee data
          const newEmployeeRef = doc(db, 'users', data.newEmployeeId);
          const newEmployeeDoc = await getDoc(newEmployeeRef);
          const newEmployeeData = newEmployeeDoc.exists()
            ? (newEmployeeDoc.data() as AppUser)
            : undefined;

          return {
            id: document.id,
            ...data,
            originalEmployeeName: originalEmployeeData?.name || 'Unknown',
            newEmployeeName: newEmployeeData?.name || 'Unknown',
          } as ShiftSwap;
        })
      );
      setShiftSwaps(swapsData);
    } catch (error) {
      console.error('Error fetching shift swaps:', error);
    }
  };

  const handleApproveTimeOff = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'timeOffRequests', requestId), {
        status: 'approved',
      });
      fetchTimeOffRequests();
    } catch (error) {
      console.error('Error approving time off request:', error);
    }
  };

  const handleRejectTimeOff = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'timeOffRequests', requestId), {
        status: 'rejected',
      });
      fetchTimeOffRequests();
    } catch (error) {
      console.error('Error rejecting time off request:', error);
    }
  };

  const handleApproveSwap = async (swapId: string) => {
    try {
      await updateDoc(doc(db, 'shiftSwaps', swapId), {
        status: 'approved',
      });
      fetchShiftSwaps();
    } catch (error) {
      console.error('Error approving shift swap:', error);
    }
  };

  const handleRejectSwap = async (swapId: string) => {
    try {
      await updateDoc(doc(db, 'shiftSwaps', swapId), {
        status: 'rejected',
      });
      fetchShiftSwaps();
    } catch (error) {
      console.error('Error rejecting shift swap:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Time Off Requests
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Dates</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {timeOffRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.employeeName}</TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>
                          {request.startDate.toLocaleDateString()} -{' '}
                          {request.endDate.toLocaleDateString()}
                        </TableCell>
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
                        <TableCell>
                          {request.status === 'pending' && (
                            <>
                              <IconButton
                                color="success"
                                onClick={() => handleApproveTimeOff(request.id)}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleRejectTimeOff(request.id)}
                              >
                                <CloseIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Shift Swaps
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Original Employee</TableCell>
                      <TableCell>New Employee</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shiftSwaps.map((swap) => (
                      <TableRow key={swap.id}>
                        <TableCell>{swap.originalEmployeeName}</TableCell>
                        <TableCell>{swap.newEmployeeName}</TableCell>
                        <TableCell>
                          <Chip
                            label={swap.status}
                            color={
                              swap.status === 'approved'
                                ? 'success'
                                : swap.status === 'rejected'
                                ? 'error'
                                : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {swap.status === 'pending' && (
                            <>
                              <IconButton
                                color="success"
                                onClick={() => handleApproveSwap(swap.id)}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={() => handleRejectSwap(swap.id)}
                              >
                                <CloseIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TimeOff;