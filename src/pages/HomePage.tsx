import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import { Prayer, PrayerHistory } from '../types';
import PrayerHistoryComponent from '../components/PrayerHistory';
import { getTodaysPrayers, updatePrayerStatus } from '../utils/prayerUtils';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [todaysPrayers, setTodaysPrayers] = useState<Prayer[]>([]);
  const [prayerHistory, setPrayerHistory] = useState<PrayerHistory>({});
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('prayerHistory');
    if (storedHistory) {
      setPrayerHistory(JSON.parse(storedHistory));
    }
    setTodaysPrayers(getTodaysPrayers());
  }, []);

  const handlePrayerToggle = (prayerName: string) => {
    const { updatedHistory } = updatePrayerStatus(prayerHistory, prayerName);
    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
    setTodaysPrayers(getTodaysPrayers());
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            Qunoot
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary'
            }}
          >
            Track your daily prayers
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 3
            }}
          >
            Prayer History
          </Button>
        </Box>

        <Grid container spacing={2}>
          {todaysPrayers.map((prayer) => (
            <Grid item xs={12} key={prayer.name}>
              <Card 
                sx={{ 
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: 1,
                  borderColor: prayer.completed ? 'success.main' : 'divider',
                  bgcolor: prayer.completed ? 'success.light' : 'background.paper',
                  transition: 'all 0.2s ease'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="h6"
                        sx={{ 
                          fontWeight: 'medium',
                          color: prayer.completed ? 'success.dark' : 'text.primary'
                        }}
                      >
                        {prayer.name}
                      </Typography>
                      {prayer.time && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: prayer.completed ? 'success.dark' : 'text.secondary'
                          }}
                        >
                          {prayer.time}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      onClick={() => handlePrayerToggle(prayer.name)}
                      sx={{
                        color: prayer.completed ? 'success.main' : 'action.disabled',
                        '&:hover': {
                          bgcolor: prayer.completed ? 'success.lighter' : 'action.hover'
                        }
                      }}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {showHistory && (
        <PrayerHistoryComponent
          prayerHistory={prayerHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </Box>
  );
};

export default HomePage;
