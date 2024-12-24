import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  useTheme,
} from '@mui/material';
import PrayerHistory from '../components/PrayerHistory';
import FineHistory from '../components/FineHistory';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Prayer {
  name: string;
  completed: boolean;
  reason?: string;
  startTime: string;
  endTime: string;
}

const defaultPrayers: Prayer[] = [
  { name: 'Fajr', completed: false, startTime: '04:30', endTime: '05:45' },
  { name: 'Dhuhr', completed: false, startTime: '12:00', endTime: '15:00' },
  { name: 'Asr', completed: false, startTime: '15:30', endTime: '17:00' },
  { name: 'Maghrib', completed: false, startTime: '17:30', endTime: '19:00' },
  { name: 'Isha', completed: false, startTime: '19:30', endTime: '23:59' },
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [prayerHistory, setPrayerHistory] = useState<{[key: string]: Prayer[]}>({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Initialize today's prayers if they don't exist
    setPrayerHistory(prev => {
      if (!prev[today]) {
        const newHistory = {
          ...prev,
          [today]: defaultPrayers
        };
        localStorage.setItem('prayerHistory', JSON.stringify(newHistory));
        return newHistory;
      }
      return prev;
    });
  }, [today]);

  useEffect(() => {
    // Load saved history
    const savedHistory = localStorage.getItem('prayerHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setPrayerHistory(parsed);
      } catch (error) {
        console.error('Failed to parse prayer history:', error);
        setPrayerHistory({ [today]: defaultPrayers });
      }
    }
  }, []);

  const handlePrayerStatusChange = (name: string, completed: boolean, reason?: string) => {
    setPrayerHistory(prev => {
      const updatedPrayers = (prev[today] || defaultPrayers).map(prayer =>
        prayer.name === name ? { ...prayer, completed, reason } : prayer
      );

      const newHistory = {
        ...prev,
        [today]: updatedPrayers
      };

      localStorage.setItem('prayerHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handlePrayerTimeUpdate = (name: string, startTime: string, endTime: string) => {
    setPrayerHistory(prev => {
      const updatedPrayers = (prev[today] || defaultPrayers).map(prayer =>
        prayer.name === name ? { ...prayer, startTime, endTime } : prayer
      );

      const newHistory = {
        ...prev,
        [today]: updatedPrayers
      };

      localStorage.setItem('prayerHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const todaysPrayers = prayerHistory[today] || defaultPrayers;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation onSectionClick={(section) => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Box id="prayers" sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Today's Prayers
          </Typography>
          <Grid container spacing={3}>
            {todaysPrayers.map((prayer) => (
              <Grid item xs={12} sm={6} md={4} key={prayer.name}>
                <Card 
                  sx={{ 
                    p: 2,
                    backgroundColor: prayer.completed 
                      ? theme.palette.success.light
                      : theme.palette.background.paper,
                    color: prayer.completed 
                      ? theme.palette.success.contrastText
                      : theme.palette.text.primary
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">{prayer.name}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: prayer.completed ? theme.palette.success.main : theme.palette.text.secondary
                      }}
                    >
                      {prayer.startTime} - {prayer.endTime}
                    </Typography>
                  </Box>
                  <PrayerHistory
                    prayers={[prayer]}
                    onPrayerUpdate={handlePrayerStatusChange}
                    onTimeUpdate={handlePrayerTimeUpdate}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box id="fines" sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Fine History
          </Typography>
          <FineHistory
            prayerHistory={prayerHistory}
            onPayFine={() => {}}
          />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default HomePage;
