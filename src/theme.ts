import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F4B3F',
      light: '#2E7D32',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#C3935B',
      light: '#D4AF37',
      dark: '#B8860B',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#34495E',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
