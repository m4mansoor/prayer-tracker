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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Prayer, PrayerHistory } from '../types';
import PrayerHistoryComponent from '../components/PrayerHistory';
import { getTodaysPrayers, updatePrayerStatus } from '../utils/prayerUtils';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [todaysPrayers, setTodaysPrayers] = useState<Prayer[]>([]);
  const [prayerHistory, setPrayerHistory] = useState<PrayerHistory>({});
  const [showHistory, setShowHistory] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<{ name: string; time: string } | null>(null);

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

  const handleTimeEdit = (prayer: Prayer) => {
    setEditingPrayer({ name: prayer.name, time: prayer.time || '' });
  };

  const handleTimeUpdate = () => {
    if (!editingPrayer) return;

    const updatedPrayers = todaysPrayers.map(prayer => 
      prayer.name === editingPrayer.name 
        ? { ...prayer, time: editingPrayer.time }
        : prayer
    );

    setTodaysPrayers(updatedPrayers);
    const today = new Date().toISOString().split('T')[0];
    const updatedHistory = {
      ...prayerHistory,
      [today]: {
        ...prayerHistory[today],
        prayers: updatedPrayers,
      },
    };
    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
    setEditingPrayer(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
          theme.palette.secondary.main,
          0.1
        )} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
            variant="contained"
            startIcon={<HistoryIcon />}
            onClick={() => setShowHistory(true)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            Prayer History
          </Button>
        </Box>

        <Grid container spacing={3}>
          {todaysPrayers.map((prayer) => (
            <Grid item xs={12} key={prayer.name}>
              <Card 
                sx={{ 
                  borderRadius: 3,
                  background: prayer.completed
                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.light, 0.1)}, ${alpha(
                        theme.palette.success.main,
                        0.2
                      )})`
                    : theme.palette.background.paper,
                  boxShadow: `0 8px 32px ${alpha(
                    prayer.completed ? theme.palette.success.main : theme.palette.primary.main,
                    0.1
                  )}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 48px ${alpha(
                      prayer.completed ? theme.palette.success.main : theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="h5"
                        sx={{ 
                          fontWeight: 'bold',
                          color: prayer.completed ? 'success.main' : 'text.primary',
                          mb: 1,
                        }}
                      >
                        {prayer.name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: prayer.completed ? 'success.main' : 'text.secondary'
                          }}
                        >
                          {prayer.time}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleTimeEdit(prayer)}
                          sx={{ color: 'action.active' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                      {prayer.completed ? (
                        <SentimentSatisfiedAltIcon 
                          sx={{ 
                            color: 'success.main',
                            fontSize: 28
                          }} 
                        />
                      ) : (
                        <SentimentVeryDissatisfiedIcon 
                          sx={{ 
                            color: 'error.main',
                            fontSize: 28
                          }} 
                        />
                      )}
                      <IconButton
                        onClick={() => handlePrayerToggle(prayer.name)}
                        sx={{
                          color: prayer.completed ? 'success.main' : 'action.disabled',
                          bgcolor: alpha(
                            prayer.completed ? theme.palette.success.main : theme.palette.grey[500],
                            0.1
                          ),
                          '&:hover': {
                            bgcolor: alpha(
                              prayer.completed ? theme.palette.success.main : theme.palette.grey[500],
                              0.2
                            ),
                          },
                        }}
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                    </Box>
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

      <Dialog open={!!editingPrayer} onClose={() => setEditingPrayer(null)}>
        <DialogTitle>Edit Prayer Time</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Time"
            type="time"
            fullWidth
            variant="outlined"
            value={editingPrayer?.time || ''}
            onChange={(e) => setEditingPrayer(prev => prev ? { ...prev, time: e.target.value } : null)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingPrayer(null)}>Cancel</Button>
          <Button onClick={handleTimeUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
