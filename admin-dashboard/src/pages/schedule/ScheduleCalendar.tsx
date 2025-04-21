import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { collection, getDocs, query, doc, addDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShiftForm from '../../components/forms/ShiftForm';
import { Shift } from '../../types';
import { formatTimestamp } from '../../utils/timeHelpers';

// Extended Shift interface from ShiftForm
interface ExtendedShift extends Shift {
  description?: string;
  location?: string;
}

const statusColors = {
  pending: '#FFC107',
  approved: '#4CAF50',
  rejected: '#F44336',
  completed: '#2196F3',
  'in-progress': '#9C27B0',
  cancelled: '#607D8B',
  scheduled: '#FF9800'
};

const ScheduleCalendar: React.FC = () => {
  const [shifts, setShifts] = useState<ExtendedShift[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openShiftDialog, setOpenShiftDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Partial<ExtendedShift> | null>(null);
  const [isNewShift, setIsNewShift] = useState(true);
  const { currentUser } = useAuth();
  
  // Group shifts by date for easier display
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const dateKey = shift.startTime.toDate().toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(shift);
    return acc;
  }, {} as Record<string, ExtendedShift[]>);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchEmployees = async () => {
      try {
        const employeesRef = collection(db, 'employees');
        const employeeSnapshot = await getDocs(employeesRef);
        const employeesList = employeeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    
    const fetchShifts = async () => {
      try {
        const shiftsRef = collection(db, 'shifts');
        const shiftsSnapshot = await getDocs(shiftsRef);
        const shiftsData: ExtendedShift[] = [];
        
        shiftsSnapshot.forEach((doc) => {
          const data = doc.data() as ExtendedShift;
          const { id: _, ...rest } = data; // Exclude any existing id from data
          shiftsData.push({
            id: doc.id,
            ...rest,
            startTime: data.startTime,
            endTime: data.endTime,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          } as ExtendedShift);
        });
        
        // Sort shifts by start time
        shiftsData.sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());
        
        setShifts(shiftsData);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
    fetchShifts();
  }, [currentUser]);
  
  const handleOpenShiftDialog = (shift?: ExtendedShift) => {
    if (shift) {
      setSelectedShift(shift);
      setIsNewShift(false);
    } else {
      setSelectedShift(null);
      setIsNewShift(true);
    }
    setOpenShiftDialog(true);
  };
  
  const handleCloseShiftDialog = () => {
    setOpenShiftDialog(false);
    setSelectedShift(null);
  };
  
  const handleSaveShift = async (formData: Partial<ExtendedShift>) => {
    try {
      if (isNewShift) {
        const shiftData = {
          ...formData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        const docRef = await addDoc(collection(db, 'shifts'), shiftData);
        
        // Add the new shift to the local state
        if (formData.startTime && formData.endTime) {
          const newShift: ExtendedShift = {
            id: docRef.id,
            title: formData.title || 'Untitled Shift',
            employeeId: formData.employeeId || '',
            startTime: formData.startTime,
            endTime: formData.endTime,
            status: formData.status as 'pending' | 'approved' | 'rejected' | 'completed' | 'in-progress' | 'cancelled' | 'scheduled',
            description: formData.description,
            location: formData.location,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          
          setShifts([...shifts, newShift]);
        }
      } else if (selectedShift?.id) {
        await updateDoc(doc(db, 'shifts', selectedShift.id), {
          ...formData,
          updatedAt: Timestamp.now()
        });
        
        // Update the shift in local state
        const updatedShifts = shifts.map(shift => {
          if (shift.id === selectedShift.id) {
            return {
              ...shift,
              ...formData,
              updatedAt: Timestamp.now()
            };
          }
          return shift;
        });
        
        setShifts(updatedShifts);
      }
      
      handleCloseShiftDialog();
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };
  
  const handleDeleteShift = async () => {
    if (selectedShift?.id) {
      try {
        await deleteDoc(doc(db, 'shifts', selectedShift.id));
        setShifts(shifts.filter(shift => shift.id !== selectedShift.id));
        handleCloseShiftDialog();
      } catch (error) {
        console.error('Error deleting shift:', error);
      }
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Schedule Calendar</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenShiftDialog()}
        >
          Add Shift
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        {Object.keys(shiftsByDate).length > 0 ? (
          <Grid container spacing={2}>
            {Object.entries(shiftsByDate).map(([date, dateShifts]) => (
              <Grid item xs={12} key={date}>
                <Typography variant="h6" gutterBottom>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
                
                <TableContainer component={Paper} elevation={1}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dateShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>{shift.title}</TableCell>
                          <TableCell>
                            {shift.startTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                            {shift.endTime.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={shift.status}
                              sx={{
                                bgcolor: `${statusColors[shift.status]}20`,
                                color: statusColors[shift.status],
                                fontWeight: 'medium'
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{shift.location || '-'}</TableCell>
                          <TableCell>
                            <IconButton size="small" onClick={() => handleOpenShiftDialog(shift)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error" 
                              onClick={async () => {
                                setSelectedShift(shift);
                                await handleDeleteShift();
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={5}>
            <Typography variant="h6" color="text.secondary">
              No shifts scheduled
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Click the "Add Shift" button to create a new shift
            </Typography>
          </Box>
        )}
      </Paper>
      
      <Dialog open={openShiftDialog} onClose={handleCloseShiftDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isNewShift ? 'Add New Shift' : 'Edit Shift'}</DialogTitle>
        <DialogContent>
          <ShiftForm 
            initialData={selectedShift || undefined}
            onSubmit={handleSaveShift}
            onCancel={handleCloseShiftDialog}
            isEditing={!isNewShift}
            onDelete={handleDeleteShift}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ScheduleCalendar; 