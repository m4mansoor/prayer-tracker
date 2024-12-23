import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

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
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
