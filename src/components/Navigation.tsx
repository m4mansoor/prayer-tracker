import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface NavigationProps {
  onSectionClick: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSectionClick }) => {
  const theme = useTheme();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'background.paper',
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button 
            color="primary" 
            onClick={() => onSectionClick('prayers')}
          >
            Prayers
          </Button>
          <Button 
            color="primary" 
            onClick={() => onSectionClick('history')}
          >
            History
          </Button>
          <Button 
            color="primary" 
            onClick={() => onSectionClick('fines')}
          >
            Fines
          </Button>
          <Button 
            color="primary" 
            onClick={() => onSectionClick('reports')}
          >
            Reports
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="primary" 
            component={Link} 
            to="/about"
          >
            About Us
          </Button>
          <Button 
            color="primary" 
            component={Link} 
            to="/contact"
          >
            Contact
          </Button>
          <Button 
            color="primary" 
            component={Link} 
            to="/legal"
          >
            Legal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
