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
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Shift } from '../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftForm from '../components/ShiftForm';

const Shifts: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

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
    } else {
      setSelectedShift(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedShift(null);
  };

  const handleSubmit = async (formData: Partial<Shift>) => {
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
                        : shift.status === 'completed'
                        ? 'primary'
                        : shift.status === 'in-progress'
                        ? 'info'
                        : shift.status === 'cancelled'
                        ? 'secondary'
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
          <ShiftForm 
            initialData={selectedShift || undefined}
            onSubmit={handleSubmit}
            onCancel={handleClose}
            isEditing={!!selectedShift}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Shifts; 