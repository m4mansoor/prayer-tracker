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
  alpha,
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
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(
          theme.palette.primary.dark,
          0.2
        )} 100%)`,
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            mb: 6,
            textAlign: 'center',
            '& h1': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            },
          }}
        >
          <Typography variant="h3" component="h1" fontWeight="bold">
            Qunoot Prayer Tracker
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Track your daily prayers and maintain accountability
          </Typography>
          <Button
            variant="contained"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
            sx={{
              mt: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              },
            }}
          >
            View History
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
                  transition: 'all 0.3s ease',
                  background: prayer.completed
                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)} 0%, ${alpha(
                        theme.palette.success.main,
                        0.2
                      )} 100%)`
                    : 'white',
                  borderRadius: 3,
                  boxShadow: prayer.completed
                    ? `0 8px 32px ${alpha(theme.palette.success.main, 0.15)}`
                    : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: prayer.completed
                      ? `0 12px 48px ${alpha(theme.palette.success.main, 0.2)}`
                      : '0 12px 48px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      sx={{
                        color: prayer.completed
                          ? theme.palette.success.main
                          : theme.palette.text.primary,
                      }}
                    >
                      {prayer.name}
                    </Typography>
                    <IconButton
                      onClick={() => handlePrayerToggle(prayer.name)}
                      sx={{
                        color: prayer.completed ? theme.palette.success.main : theme.palette.grey[400],
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          color: prayer.completed
                            ? theme.palette.success.dark
                            : theme.palette.success.light,
                        },
                      }}
                    >
                      <CheckCircleOutlineIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  {prayer.time && (
                    <Typography
                      color={prayer.completed ? 'success.main' : 'text.secondary'}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      Time: {prayer.time}
                    </Typography>
                  )}
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
