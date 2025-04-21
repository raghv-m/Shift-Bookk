import React, { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  useTheme,
  styled,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  TimerOutlined as TimerIcon,
  NotificationsActive as NotificationsIcon,
  BarChart as BarChartIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.primary.contrastText,
  padding: '12px 30px',
  borderRadius: '8px',
  fontWeight: 600,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '16px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(45, 45, 52, 0.7)' 
    : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const FeatureIcon = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  margin: '0 auto 16px',
  boxShadow: theme.shadows[3],
}));

const ScrollFadeSection = styled(Box)<{ visible: boolean }>(({ theme, visible }) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(30px)',
  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
}));

const NavbarLink = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  cursor: 'pointer',
  fontWeight: 500,
  color: theme.palette.text.primary,
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for scrolling to sections
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = React.useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = React.useState(false);

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const featureObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setFeaturesVisible(true);
      }
    }, observerOptions);

    const testimonialObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTestimonialsVisible(true);
      }
    }, observerOptions);

    if (featuresRef.current) {
      featureObserver.observe(featuresRef.current);
    }

    if (testimonialsRef.current) {
      testimonialObserver.observe(testimonialsRef.current);
    }

    return () => {
      featureObserver.disconnect();
      testimonialObserver.disconnect();
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false); // Close drawer after clicking a link
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: 'bold' }}>
        SHIFT-BOOKK
      </Typography>
      <Divider />
      <List>
        <ListItem button onClick={() => scrollToSection(featuresRef)}>
          <ListItemText primary="Features" />
        </ListItem>
        <ListItem button onClick={() => scrollToSection(testimonialsRef)}>
          <ListItemText primary="Testimonials" />
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button 
          variant="outlined" 
          fullWidth
          component={RouterLink}
          to="/login"
        >
          Login
        </Button>
        <Button 
          variant="contained" 
          fullWidth
          component={RouterLink}
          to="/signup"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );

  const ParticleBackground = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    >
      <div id="particles-js" style={{ width: '100%', height: '100%' }}></div>
    </Box>
  );

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Navbar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          boxShadow: 'none',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(37, 42, 53, 0.8)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.contrastText,
              letterSpacing: '0.05em',
            }}
          >
            Shift-Bookk
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex' }}>
                <NavbarLink variant="body1" onClick={() => scrollToSection(featuresRef)}>
                  Features
                </NavbarLink>
                <NavbarLink variant="body1" onClick={() => scrollToSection(testimonialsRef)}>
                  Testimonials
                </NavbarLink>
              </Box>
              <Box sx={{ ml: 4 }}>
                <Button 
                  variant="text" 
                  component={RouterLink}
                  to="/login"
                  sx={{ mr: 2, color: theme.palette.primary.light }}
                >
                  Login
                </Button>
                <Button 
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    color: theme.palette.primary.contrastText,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawer}
      </Drawer>

      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          pt: 15,
          pb: 12,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(150deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(150deg, ${theme.palette.grey[800]} 0%, ${theme.palette.background.default} 100%)`,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/patterns/grid.svg)',
            backgroundSize: 'cover',
            opacity: 0.1,
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: 'fadeIn 1s ease-out' }}>
                <Typography 
                  variant="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    color: theme.palette.mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[900],
                    mb: 3
                  }}
                >
                  Shift Scheduling, <br />
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>Simplified</Box>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : theme.palette.grey[700],
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: '90%'
                  }}
                >
                  Modern employee scheduling made easy. 
                  Save time, reduce errors, and keep your team in sync.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button 
                    component={RouterLink}
                    to="/signup"
                    size="large"
                    variant="contained"
                    endIcon={<EventIcon />}
                    sx={{
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      color: theme.palette.primary.contrastText,
                      padding: '12px 24px',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    Get Started for Free
                  </Button>
                  
                  <Button 
                    component={RouterLink}
                    to="/login"
                    variant="outlined" 
                    color="primary"
                    size="large"
                    sx={{
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Log In
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  position: 'relative',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0px)' },
                  }
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.1)',
                      zIndex: 2
                    }
                  }}
                >
                  <Box 
                    component="img"
                    src="/images/schedule-dashboard.png"
                    alt="Shift-Bookk Dashboard Preview"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </Paper>
                
                {/* Floating elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    animation: 'pulse 4s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' },
                    }
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      background: 'rgba(45, 45, 52, 0.7)',
                      backdropFilter: 'blur(10px)',
                      width: 140
                    }}
                  >
                    <Typography variant="subtitle2" color="primary.light">Today's Shifts</Typography>
                    <Typography variant="h4" fontWeight="bold">12</Typography>
                  </Paper>
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-8%',
                    animation: 'pulse 4.5s ease-in-out infinite 0.5s',
                  }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      borderRadius: 2,
                      p: 2,
                      background: 'rgba(45, 45, 52, 0.7)',
                      backdropFilter: 'blur(10px)',
                      width: 160
                    }}
                  >
                    <Typography variant="subtitle2" color="primary.light">Employees on Shift</Typography>
                    <Typography variant="h4" fontWeight="bold">6 / 8</Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box 
        ref={featuresRef}
        sx={{ 
          py: 12,
          background: theme.palette.background.default
        }}
      >
        <Container maxWidth="lg">
          <ScrollFadeSection visible={featuresVisible}>
            <Box textAlign="center" mb={8}>
              <Typography 
                variant="h2" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.75rem' }
                }}
              >
                Everything you need to manage shifts
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  mb: 3
                }}
              >
                A complete solution designed for teams of all sizes
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  title: 'Schedule Management',
                  description: 'Create, modify, and publish shifts with a user-friendly drag-and-drop interface',
                  icon: <ScheduleIcon fontSize="large" />
                },
                {
                  title: 'Team Collaboration',
                  description: 'Keep everyone on the same page with real-time updates and notifications',
                  icon: <PeopleIcon fontSize="large" />
                },
                {
                  title: 'Time Tracking',
                  description: 'Monitor hours worked, breaks, and overtime with detailed reporting',
                  icon: <TimerIcon fontSize="large" />
                },
                {
                  title: 'Smart Notifications',
                  description: 'Automated alerts for shift changes, time-off requests, and more',
                  icon: <NotificationsIcon fontSize="large" />
                },
                {
                  title: 'Attendance Tracking',
                  description: 'Record and analyze attendance patterns to optimize scheduling',
                  icon: <EventIcon fontSize="large" />
                },
                {
                  title: 'Analytics Dashboard',
                  description: 'Gain insights into labor costs, scheduling efficiency, and trends',
                  icon: <BarChartIcon fontSize="large" />
                }
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FeatureCard>
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <FeatureIcon>{feature.icon}</FeatureIcon>
                      <Typography variant="h5" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </ScrollFadeSection>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box 
        ref={testimonialsRef}
        sx={{ 
          py: 12,
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(0deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(0deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[200]} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <ScrollFadeSection visible={testimonialsVisible}>
            <Box textAlign="center" mb={8}>
              <Typography 
                variant="h2" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.75rem' }
                }}
              >
                Trusted by businesses worldwide
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  maxWidth: 700,
                  mx: 'auto'
                }}
              >
                See why thousands of teams choose Shift-Bookk for scheduling
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  quote: "Shift-Bookk transformed how our restaurant manages staff scheduling. We've reduced time spent on scheduling by 75%.",
                  author: "Sarah Johnson",
                  position: "Restaurant Manager",
                  company: "Bistro Moderne"
                },
                {
                  quote: "The ability to instantly notify staff of schedule changes has dramatically improved our operational efficiency.",
                  author: "David Chen",
                  position: "Operations Director",
                  company: "Metro Hospital"
                },
                {
                  quote: "With Shift-Bookk, our retail staff can easily request time off and swap shifts, increasing overall satisfaction.",
                  author: "Emma Rodriguez",
                  position: "HR Manager",
                  company: "Urban Outfitters"
                }
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(45, 45, 52, 0.7)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        borderRadius: '4px 4px 0 0',
                      }
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 4,
                        fontStyle: 'italic',
                        flex: 1,
                        fontSize: '1.1rem',
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.position}, {testimonial.company}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </ScrollFadeSection>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 12,
          background: theme.palette.background.default,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, rgba(122, 122, 157, 0), rgba(122, 122, 157, 0.5), rgba(122, 122, 157, 0))'
          }
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              background: theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 10%, ${theme.palette.grey[900]} 90%)`
                : `linear-gradient(135deg, ${theme.palette.grey[200]} 10%, ${theme.palette.background.paper} 90%)`,
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                animation: 'pulse 15s infinite'
              }
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              Ready to simplify your scheduling?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 4,
                maxWidth: '80%',
                mx: 'auto'
              }}
            >
              Start with a free 14-day trial. No credit card required.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button 
                component={RouterLink}
                to="/signup"
                size="large"
                variant="contained"
                endIcon={<EventIcon />}
                sx={{ 
                  px: 6, 
                  py: 1.5,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                Get Started for Free
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 6,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.grey[200],
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Shift-Bookk
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modern employee scheduling software that simplifies workforce management.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Product
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {['Features', 'Pricing', 'Integrations', 'Updates'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Resources
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {['Documentation', 'Guides', 'API', 'Support'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Company
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Legal
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box 
            sx={{ 
              mt: 6, 
              pt: 3, 
              borderTop: 1, 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Shift-Bookk. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
              {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                <Typography key={social} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                  {social}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <ParticleBackground />
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            if (typeof particlesJS !== 'undefined') {
              particlesJS('particles-js', {
                "particles": {
                  "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                  "color": { "value": "#00D4B8" },
                  "shape": { "type": "circle" },
                  "opacity": { "value": 0.5, "random": false },
                  "size": { "value": 3, "random": true },
                  "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#00D4B8",
                    "opacity": 0.2,
                    "width": 1
                  },
                  "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                  }
                },
                "interactivity": {
                  "detect_on": "canvas",
                  "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                  }
                },
                "retina_detect": true
              });
            }
          });
        `
      }} />
    </Box>
  );
};

export default LandingPage; 