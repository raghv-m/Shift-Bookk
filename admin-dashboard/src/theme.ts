import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Cosmic color palette
const cosmic = {
  50: '#EBF0FF',
  100: '#D6E0FF',
  200: '#ADC2FF',
  300: '#84A3FF',
  400: '#5B85FF',
  500: '#3366FF',
  600: '#2952CC',
  700: '#1F3D99',
  800: '#152966',
  900: '#0A1433',
};

const teal = {
  50: '#E6FFFD',
  100: '#CCFFF9',
  200: '#99FFF3',
  300: '#66FFEC',
  400: '#33FFE6',
  500: '#00FFE0',
  600: '#00CCB3',
  700: '#009986',
  800: '#00665A',
  900: '#00332D',
};

export const createAppTheme = (mode: PaletteMode = 'dark') => {
  const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: {
              main: '#00FFE0',
              light: '#66FFEC',
              dark: '#00CCB3',
              contrastText: cosmic[900],
            },
            secondary: {
              main: '#8A7CFF', // Purple accent color
              light: '#B0A5FF',
              dark: '#6453F7',
              contrastText: '#ffffff',
            },
            background: {
              default: '#F5F7FA',
              paper: '#ffffff',
            },
            text: {
              primary: cosmic[900],
              secondary: cosmic[700],
            },
            divider: cosmic[200],
          }
        : {
            // Dark mode palette
            primary: {
              main: '#00FFE0',
              light: '#66FFEC',
              dark: '#00CCB3',
              contrastText: cosmic[900],
            },
            secondary: {
              main: '#8A7CFF', // Purple accent color
              light: '#B0A5FF',
              dark: '#6453F7',
              contrastText: '#ffffff',
            },
            background: {
              default: '#0A1433', // Deep cosmic blue
              paper: '#152966', // Lighter cosmic blue
            },
            text: {
              primary: '#EBF0FF',
              secondary: '#ADC2FF',
            },
            divider: cosmic[700],
          }),
    },
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.01562em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0em',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.00735em',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0em',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '0.0075em',
      },
      subtitle1: {
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      subtitle2: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: mode === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: mode === 'dark' 
                ? '0 6px 10px rgba(0, 0, 0, 0.4)' 
                : '0 3px 6px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }),
          contained: ({ theme }) => ({
            '&.MuiButton-containedPrimary': {
              background: mode === 'dark' 
                ? `linear-gradient(135deg, ${teal[500]}, ${teal[600]})` 
                : `linear-gradient(135deg, ${teal[500]}, ${teal[600]})`,
            },
            '&.MuiButton-containedSecondary': {
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, #8A7CFF, #6453F7)' 
                : 'linear-gradient(135deg, #8A7CFF, #6453F7)',
            },
          }),
          outlined: ({ theme }) => ({
            borderWidth: '1px',
            '&:hover': {
              borderWidth: '1px',
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            boxShadow: mode === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
              : '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: mode === 'dark' 
              ? `1px solid ${cosmic[700]}` 
              : `1px solid ${cosmic[200]}`,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'dark' 
                ? '0 8px 30px rgba(0, 0, 0, 0.6)' 
                : '0 8px 25px rgba(0, 0, 0, 0.1)',
            },
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: mode === 'dark' ? 'rgba(21, 41, 102, 0.5)' : 'rgba(255, 255, 255, 0.9)',
              '& fieldset': {
                borderColor: mode === 'dark' ? cosmic[700] : cosmic[300],
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? cosmic[500] : cosmic[400],
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === 'dark' ? teal[400] : teal[600],
                borderWidth: '1px',
              },
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderColor: mode === 'dark' ? cosmic[700] : cosmic[200],
          }),
          head: ({ theme }) => ({
            fontWeight: 600,
            backgroundColor: mode === 'dark' ? cosmic[800] : cosmic[100],
          }),
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(21, 41, 102, 0.3)' : 'rgba(173, 194, 255, 0.3)',
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            boxShadow: mode === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.4)' 
              : '0 2px 10px rgba(0, 0, 0, 0.05)',
            backdropFilter: 'blur(10px)',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backdropFilter: 'blur(10px)',
            backgroundColor: mode === 'dark' 
              ? 'rgba(10, 20, 51, 0.8)' 
              : 'rgba(245, 247, 250, 0.8)',
          }),
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundImage: mode === 'dark'
              ? 'linear-gradient(180deg, rgba(10, 20, 51, 0.95), rgba(21, 41, 102, 0.95))'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(0, 255, 224, 0.15)' 
                : 'rgba(0, 255, 224, 0.1)',
              '&:hover': {
                backgroundColor: mode === 'dark' 
                  ? 'rgba(0, 255, 224, 0.25)' 
                  : 'rgba(0, 255, 224, 0.2)',
              }
            },
          }),
        },
      },
    },
  });

  return createTheme(getDesignTokens(mode));
};

const theme = createAppTheme('dark');
export default theme; 