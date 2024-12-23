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
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import { Prayer, PrayerHistory } from '../types';
import PrayerHistoryComponent from '../components/PrayerHistory';
import { getTodaysPrayers, updatePrayerStatus } from '../utils/prayerUtils';

const HomePage: React.FC = () => {
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Today's Prayers
          </Typography>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
          >
            History
          </Button>
        </Box>

        <Grid container spacing={3}>
          {todaysPrayers.map((prayer) => (
            <Grid item xs={12} sm={6} md={4} key={prayer.name}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="h2">
                      {prayer.name}
                    </Typography>
                    <IconButton
                      onClick={() => handlePrayerToggle(prayer.name)}
                      color={prayer.completed ? "success" : "default"}
                      sx={{ 
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                  </Box>
                  {prayer.time && (
                    <Typography color="textSecondary" sx={{ mt: 1 }}>
                      Time: {prayer.time}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {showHistory && (
        <PrayerHistoryComponent
          prayerHistory={prayerHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </Container>
  );
};

export default HomePage;
