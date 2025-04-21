import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
  styled,
  Link,
  Container,
  Avatar,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Rocket as RocketIcon, 
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const GlowingAvatar = styled(Avatar)(({ theme }) => ({
  width: 70,
  height: 70,
  margin: '0 auto',
  backgroundImage: 'linear-gradient(135deg, #C0C0C8, #7A7A9D)',
  boxShadow: '0 0 20px rgba(122, 122, 157, 0.5)',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 30px rgba(122, 122, 157, 0.7)',
  }
}));

const StepperStyled = styled(Stepper)(({ theme }) => ({
  '& .MuiStepIcon-root': {
    color: 'rgba(192, 192, 200, 0.3)',
    '&.Mui-active': {
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      color: theme.palette.primary.main,
    }
  },
  '& .MuiStepConnector-line': {
    borderColor: 'rgba(192, 192, 200, 0.3)',
  }
}));

interface OrganizationForm {
  name: string;
}

interface UserForm {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  department: string;
}

const Signup: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [organizationForm, setOrganizationForm] = useState<OrganizationForm>({
    name: '',
  });
  const [userForm, setUserForm] = useState<UserForm>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!organizationForm.name) {
      setError('Organization name is required');
      return;
    }

    setSuccess("Organization details saved. Let's set up your account now.");
    setTimeout(() => {
      setSuccess(null);
      setActiveStep(1);
    }, 1500);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate form
    if (!userForm.displayName || !userForm.email || !userForm.password || !userForm.department) {
      setError("Please fill in all required fields");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (userForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userForm.email,
        userForm.password
      );
      
      const user = userCredential.user;
      
      // Create organization document
      const orgRef = doc(db, 'organizations', user.uid);
      await setDoc(orgRef, {
        name: organizationForm.name,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        ownerId: user.uid
      });
      
      // Create user document
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: userForm.displayName,
        email: userForm.email,
        department: userForm.department,
        role: 'admin', // First user is always admin
        organizationId: user.uid, // Using the user's UID as org ID for simplicity
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      // Login the user
      await login(userForm.email, userForm.password);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating account:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please login instead.");
      } else {
        setError(error.message || "An error occurred while creating your account");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
    setError(null);
    setSuccess(null);
  };

  const steps = ['Organization', 'Account Details'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        pt: 4, 
        pb: 8
      }}
    >
      <Container maxWidth="sm">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            animation: 'fadeIn 1s ease-out'
          }}
        >
          <GlowingAvatar>
            {activeStep === 0 ? <RocketIcon fontSize="large" /> : <PersonIcon fontSize="large" />}
          </GlowingAvatar>
          
          <Typography variant="h3" gutterBottom fontFamily="'Poppins', sans-serif">
            {activeStep === 0 ? 'Create Organization' : 'Create Account'}
          </Typography>
          
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ 
              mb: 4,
              maxWidth: '80%', 
              mx: 'auto',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {activeStep === 0 
              ? 'Set up your organization to get started with Shift-Bookk' 
              : 'Create your account to manage schedules and shifts'}
          </Typography>
        </Box>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(45, 45, 52, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, rgba(192, 192, 200, 0), rgba(192, 192, 200, 0.8), rgba(192, 192, 200, 0))',
            },
          }}
        >
          <StepperStyled activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </StepperStyled>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                animation: 'fadeIn 0.3s ease-out',
                bgcolor: 'rgba(255, 77, 106, 0.15)',
                color: '#ff4d6a',
                '& .MuiAlert-icon': {
                  color: '#ff4d6a'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                animation: 'fadeIn 0.3s ease-out',
                bgcolor: 'rgba(122, 122, 157, 0.15)',
                color: '#a0a0b0',
                '& .MuiAlert-icon': {
                  color: '#a0a0b0'
                }
              }}
            >
              {success}
            </Alert>
          )}

          {activeStep === 0 ? (
            <form onSubmit={handleOrganizationSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Organization Name"
                    value={organizationForm.name}
                    onChange={(e) =>
                      setOrganizationForm({ ...organizationForm, name: e.target.value })
                    }
                    fullWidth
                    required
                    placeholder="Enter your organization name"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      mt: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'all 0.5s',
                      },
                      '&:hover::after': {
                        left: '100%',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={userForm.displayName}
                    onChange={(e) =>
                      setUserForm({ ...userForm, displayName: e.target.value })
                    }
                    fullWidth
                    required
                    placeholder="Enter your full name"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    fullWidth
                    required
                    placeholder="your.email@example.com"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    fullWidth
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    helperText="Minimum 6 characters"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    value={userForm.confirmPassword}
                    onChange={(e) =>
                      setUserForm({ ...userForm, confirmPassword: e.target.value })
                    }
                    fullWidth
                    required
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Department"
                    value={userForm.department}
                    onChange={(e) =>
                      setUserForm({ ...userForm, department: e.target.value })
                    }
                    fullWidth
                    required
                    placeholder="e.g., HR, IT, Marketing"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ px: 3 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'all 0.5s',
                      },
                      '&:hover::after': {
                        left: '100%',
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="primary" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup; 