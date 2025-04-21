import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  InputBase,
  Badge,
  Tooltip,
  Paper,
  AppBar,
  Drawer
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import TimeOffIcon from '@mui/icons-material/EventBusy';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import HelpIcon from '@mui/icons-material/Help';
import SearchIcon from '@mui/icons-material/Search';
import { AccountCircle } from '@mui/icons-material';

import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { PushNotificationService } from '../../services/PushNotificationService';

const drawerWidth = 260;

// Styled components
const GlassAppBar = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  zIndex: theme.zIndex.drawer + 1,
  background: 'rgba(26, 31, 58, 0.8)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(0, 212, 184, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
}));

const GlassDrawer = styled('div')(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  position: 'fixed',
  height: '100vh',
  background: 'rgba(26, 31, 58, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRight: '1px solid rgba(0, 212, 184, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    width: drawerWidth,
    background: 'transparent',
    border: 'none',
  },
}));

const SearchInputWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.08),
  },
  border: '1px solid rgba(0, 212, 184, 0.2)',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: 'all 0.3s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '18ch',
      '&:focus': {
        width: '25ch',
      },
    },
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.6),
      fontStyle: 'italic',
      fontSize: '0.9rem',
    }
  },
}));

const GlowingBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    boxShadow: `0 0 8px ${alpha(theme.palette.primary.main, 0.6)}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.4s infinite ease-in-out',
      border: `2px solid ${theme.palette.primary.main}`,
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.4,
    },
    '100%': {
      transform: 'scale(2.2)',
      opacity: 0,
    },
  },
}));

const GradientDivider = styled(Divider)(({ theme }) => ({
  background: `linear-gradient(90deg, 
    ${alpha(theme.palette.primary.main, 0)}, 
    ${alpha(theme.palette.primary.main, 0.5)}, 
    ${alpha(theme.palette.primary.main, 0)})`,
  margin: theme.spacing(2, 0),
  height: '1px',
}));

const StyledListItemButton = styled(ListItem)(({ theme }) => ({
  margin: theme.spacing(0.5, 0),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['background-color', 'transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateX(4px)',
    background: `linear-gradient(90deg, 
      ${alpha(theme.palette.primary.main, 0.1)}, 
      ${alpha(theme.palette.primary.main, 0.05)})`,
  },
  '&.Mui-selected': {
    background: `linear-gradient(90deg, 
      ${alpha(theme.palette.primary.main, 0.2)}, 
      ${alpha(theme.palette.primary.main, 0.05)})`,
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '20%',
      height: '60%',
      width: '3px',
      background: theme.palette.primary.main,
      boxShadow: `0 0 10px ${theme.palette.primary.main}`,
      borderRadius: '0 4px 4px 0',
    },
    '&:hover': {
      background: `linear-gradient(90deg, 
        ${alpha(theme.palette.primary.main, 0.25)}, 
        ${alpha(theme.palette.primary.main, 0.1)})`,
    }
  },
  button: true,
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.mode === 'dark' 
    ? `radial-gradient(circle at 10% 10%, 
        ${alpha('#121a38', 0.98)}, 
        ${alpha('#0d1327', 0.95)})`
    : alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.1)'
    : '0 8px 32px rgba(37, 43, 77, 0.05)',
  border: theme.palette.mode === 'dark'
    ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
    : `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  overflow: 'hidden',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const StatusBubble = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  fontSize: '0.75rem',
  fontWeight: 500,
  margin: theme.spacing(1, 2),
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    boxShadow: `0 0 6px ${theme.palette.success.main}`,
    marginRight: theme.spacing(1),
    animation: 'pulse 2s infinite',
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 0.6,
      transform: 'scale(0.9)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.1)',
    },
    '100%': {
      opacity: 0.6,
      transform: 'scale(0.9)',
    },
  },
}));

// Define main menu items
const mainMenuItems = [
  { path: '/dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/dashboard/shifts', text: 'Shifts', icon: <ScheduleIcon /> },
  { path: '/dashboard/team', text: 'Team Members', icon: <PeopleIcon /> },
  { path: '/dashboard/calendar', text: 'Calendar', icon: <ScheduleIcon /> },
  { path: '/dashboard/analytics', text: 'Analytics', icon: <AnalyticsIcon /> },
  { path: '/dashboard/notifications', text: 'Notifications', icon: <AnnouncementIcon /> },
  { path: '/dashboard/messages', text: 'Messages', icon: <AnnouncementIcon /> },
];

// Additional menu items based on user role
const adminMenuItems = [
  { path: '/dashboard/admin/employees', text: 'Employee Management', icon: <PeopleIcon /> },
  { path: '/dashboard/admin/shifts', text: 'Shift Management', icon: <ScheduleIcon /> },
];

// Fun cosmic status messages
const statusMessages = [
  "Navigating the cosmic timestream",
  "Calculating quantum shift variables",
  "Syncing with orbital timekeeper",
  "Analyzing stellar shift patterns",
  "Parsing temporal anomalies",
  "Stabilizing chronometric particles",
  "Aligning interdimensional schedules",
  "Monitoring galactic workforce",
  "Generating hyperspace predictions",
  "Compiling interstellar statistics"
];

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [statusMessage, setStatusMessage] = useState(statusMessages[0]);
  const { currentUser, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { unreadCount } = useNotifications();

  // Initialize push notifications when component mounts and user is authenticated
  useEffect(() => {
    if (currentUser) {
      const initializePushNotifications = async () => {
        try {
          await PushNotificationService.initialize();
          console.log('Push notifications initialized');
        } catch (error) {
          console.error('Error initializing push notifications:', error);
        }
      };
      
      initializePushNotifications();
    }
  }, [currentUser]);

  // Select a random status message on mount and change it every 8 seconds
  useEffect(() => {
    const randomMessage = () => {
      const randomIndex = Math.floor(Math.random() * statusMessages.length);
      setStatusMessage(statusMessages[randomIndex]);
    };
    
    randomMessage();
    const interval = setInterval(randomMessage, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isSelected = (path: string) => {
    // For /employee/team special case
    if (path === '/dashboard/team' && location.pathname === '/employee/team') {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawer = (
    <Box sx={{ 
      overflow: 'auto', 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(180deg, rgba(18, 26, 56, 0.95), rgba(13, 19, 39, 0.95))'
        : undefined,
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: "'Orbitron', sans-serif", 
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00d4b8, #80e9ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 212, 184, 0.5)',
            letterSpacing: '0.05em',
          }}
        >
          SHIFT-BOOKK
        </Typography>
      </Box>
      
      <GradientDivider />
      
      <StatusBubble>{statusMessage}</StatusBubble>
      
      <List sx={{ flexGrow: 1, px: 1 }}>
        {mainMenuItems.map((item) => (
          <StyledListItemButton 
            key={item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) {
                setMobileOpen(false);
              }
            }}
            selected={isSelected(item.path)}
          >
            <ListItemIcon sx={{ 
              color: isSelected(item.path) ? theme.palette.primary.main : 'inherit',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: isSelected(item.path) ? 600 : 400,
                sx: { 
                  transition: 'all 0.2s',
                  color: isSelected(item.path) 
                    ? theme.palette.primary.main 
                    : theme.palette.text.primary
                }
              }}
            />
          </StyledListItemButton>
        ))}
        
        {userRole === 'admin' && (
          <>
            <GradientDivider />
            <Typography 
              variant="overline" 
              sx={{ 
                pl: 2, 
                opacity: 0.7,
                color: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.7) : undefined
              }}
            >
              Admin Controls
            </Typography>
            
            {adminMenuItems.map((item) => (
              <StyledListItemButton
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setMobileOpen(false);
                  }
                }}
                selected={isSelected(item.path)}
              >
                <ListItemIcon sx={{ 
                  color: isSelected(item.path) ? theme.palette.primary.main : 'inherit',
                  minWidth: 40,
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: isSelected(item.path) ? 600 : 400,
                    sx: { 
                      color: isSelected(item.path) 
                        ? theme.palette.primary.main 
                        : theme.palette.text.primary
                    }
                  }}
                />
              </StyledListItemButton>
            ))}
          </>
        )}
      </List>
      
      <Box sx={{ p: 2 }}>
        <GradientDivider />
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 1, 
          borderRadius: theme.shape.borderRadius,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
            }}
          >
            {currentUser?.displayName?.[0] || 'U'}
          </Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {currentUser?.displayName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {userRole || 'Employee'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundImage: theme.palette.mode === 'dark' 
        ? 'radial-gradient(circle at 50% 50%, rgba(42, 54, 104, 0.2) 0%, rgba(26, 31, 58, 0) 70%), radial-gradient(circle at 100% 0%, rgba(0, 212, 184, 0.1) 0%, rgba(26, 31, 58, 0) 50%), radial-gradient(circle at 0% 100%, rgba(138, 124, 255, 0.1) 0%, rgba(26, 31, 58, 0) 50%)'
        : 'radial-gradient(circle at 50% 50%, rgba(227, 242, 253, 0.5) 0%, rgba(245, 247, 250, 0) 70%), radial-gradient(circle at 100% 0%, rgba(0, 212, 184, 0.05) 0%, rgba(245, 247, 250, 0) 50%), radial-gradient(circle at 0% 100%, rgba(103, 58, 183, 0.05) 0%, rgba(245, 247, 250, 0) 50%)',
      backgroundColor: theme.palette.background.default,
      backgroundSize: '100% 100%',
      backgroundAttachment: 'fixed',
    }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: '240px' },
          background: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(8px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha(theme.palette.divider, theme.palette.mode === 'dark' ? 0.1 : 0.05)}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              maxWidth: '100%',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(5px)',
              borderRadius: 20,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: 'none',
              mr: 2,
              '&:hover': {
                boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <StyledInputBase
              placeholder="Search the cosmos…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Paper>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show new notifications"
                color="inherit"
                onClick={() => navigate('/notifications')}
              >
                <GlowingBadge badgeContent={unreadCount} color="primary" invisible={unreadCount === 0}>
                  <NotificationsIcon />
                </GlowingBadge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                minWidth: 180,
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 8px 24px rgba(0, 0, 0, 0.2)'
                  : '0 8px 24px rgba(37, 43, 77, 0.08)',
                border: theme.palette.mode === 'dark'
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  : `1px solid ${alpha(theme.palette.divider, 0.05)}`,
              }
            }}
          >
            <MenuItem onClick={() => {
              navigate('/profile');
              handleClose();
            }}>
              <ListItemIcon>
                <AccountCircle fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body1">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => {
              navigate('/settings');
              handleClose();
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body1">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body1">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: 240 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 240, 
              boxSizing: 'border-box',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: 240, 
              boxSizing: 'border-box',
              borderRight: 'none',
              background: 'transparent',
              boxShadow: 'none'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 240px)` },
          mt: { xs: 8, sm: 9 },
          pb: 3,
        }}
      >
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 