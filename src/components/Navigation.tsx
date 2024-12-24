import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme,
  alpha,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

interface NavigationProps {
  onSectionClick: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onSectionClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSectionClick = (section: string) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    } else {
      onSectionClick(section);
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'background.paper',
        boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Toolbar>
        <IconButton
          color="primary"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button 
            color="primary" 
            onClick={() => handleSectionClick('prayers')}
          >
            Prayers
          </Button>
          <Button 
            color="primary" 
            onClick={() => handleSectionClick('history')}
          >
            History
          </Button>
          <Button 
            color="primary" 
            onClick={() => handleSectionClick('fines')}
          >
            Fines
          </Button>
          <Button 
            color="primary" 
            onClick={() => handleSectionClick('reports')}
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
            About
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
