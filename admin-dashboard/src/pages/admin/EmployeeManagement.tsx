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
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { AppUser } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState<Partial<AppUser>>({
    displayName: '',
    email: '',
    department: '',
    role: 'employee',
    status: 'active'
  });

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const employeesData: AppUser[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        employeesData.push({
          id: doc.id,
          uid: doc.id,
          ...data,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as AppUser);
      });
      setEmployees(employeesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenDialog = (employee?: AppUser) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        displayName: employee.displayName,
        email: employee.email,
        department: employee.department,
        role: employee.role,
        status: employee.status
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        displayName: '',
        email: '',
        department: '',
        role: 'employee',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
  };

  const handleSubmit = async () => {
    try {
      const employeeData = {
        ...formData,
        updatedAt: Timestamp.now()
      };

      if (selectedEmployee) {
        await setDoc(doc(db, 'users', selectedEmployee.id), employeeData, { merge: true });
      } else {
        const newDocRef = doc(collection(db, 'users'));
        await setDoc(newDocRef, {
          ...employeeData,
          createdAt: Timestamp.now()
        });
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (employeeId: string) => {
    try {
      await deleteDoc(doc(db, 'users', employeeId));
    } catch (error) {
      console.error('Error deleting employee:', error);
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
        <Typography variant="h4">Employee Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.displayName || 'N/A'}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department || 'N/A'}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status}
                    color={employee.status === 'active' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(employee.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as AppUser['role'] })}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AppUser['status'] })}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedEmployee ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeManagement; 