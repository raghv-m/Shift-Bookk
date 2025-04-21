import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Link,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  styled,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';

// Styled components
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

// Messages for gray-themed interface
const wittyMessages = {
  loginError: "Hmm, we don't recognize these credentials. Please check and try again.",
  networkError: "Connection issues detected. Please check your network and try again.",
  unauthorizedError: "You don't have permission to access this area. Please contact your administrator.",
  successLogin: "Success! Redirecting to your dashboard...",
};

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      setSuccess("Login successful! Redirecting to dashboard...");
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
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
            <LockOutlinedIcon fontSize="large" />
          </GlowingAvatar>
          
          <Typography variant="h3" gutterBottom fontFamily="'Poppins', sans-serif">
            Sign In
          </Typography>
          
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              mb: 2,
              maxWidth: '80%',
              mx: 'auto',
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Enter your credentials to access your account
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
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="Enter your email"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme => theme.palette.primary.main,
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme => theme.palette.primary.main,
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link 
                  component={RouterLink} 
                  to="/forgot-password"
                  color="primary"
                  underline="hover"
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mt: 1,
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/signup" color="primary" underline="hover">
              Create an account
            </Link>
          </Typography>
        </Box>
      </Container>

      {/* Global styles moved to theme or CSS file */}
    </Box>
  );
};

export default Login;