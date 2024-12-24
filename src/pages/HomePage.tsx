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
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { v4 as uuidv4 } from 'uuid';
import { Prayer, PrayerHistory, FinePayment } from '../types';
import PrayerHistoryComponent from '../components/PrayerHistory';
import PrayerReports from '../components/PrayerReports';
import FineHistory from '../components/FineHistory';
import { getTodaysPrayers, updatePrayerStatus } from '../utils/prayerUtils';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [todaysPrayers, setTodaysPrayers] = useState<Prayer[]>([]);
  const [prayerHistory, setPrayerHistory] = useState<PrayerHistory>({
    fineHistory: {},
    finePayments: [],
  });
  const [showHistory, setShowHistory] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('prayerHistory');
    if (storedHistory) {
      setPrayerHistory(JSON.parse(storedHistory));
    } else {
      setPrayerHistory({ fineHistory: {}, finePayments: [] });
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

  const calculateTodaysFine = () => {
    return todaysPrayers.reduce((total, prayer) => {
      if (!prayer.completed) {
        return total + 10; // 10 rupees fine for each missed prayer
      }
      return total;
    }, 0);
  };

  const handlePayFine = (payment: Omit<FinePayment, 'id' | 'paidAt' | 'status'>) => {
    const newPayment: FinePayment = {
      ...payment,
      id: uuidv4(),
      paidAt: new Date().toISOString(),
      status: 'paid',
    };

    const updatedHistory = {
      ...prayerHistory,
      finePayments: [...(prayerHistory.finePayments || []), newPayment],
      fineHistory: {
        ...prayerHistory.fineHistory,
      },
    };

    // Mark fines as paid
    Object.keys(updatedHistory.fineHistory).forEach((date) => {
      const fineDate = new Date(date);
      const startDate = new Date(payment.startDate);
      const endDate = new Date(payment.endDate);

      if (fineDate >= startDate && fineDate <= endDate) {
        updatedHistory.fineHistory[date].paid = true;
        updatedHistory.fineHistory[date].paidAt = newPayment.paidAt;
        updatedHistory.fineHistory[date].paymentId = newPayment.id;
      }
    });

    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
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
      <Container maxWidth="lg">
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
            Qunoot Prayer Tracker
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
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {todaysPrayers.map((prayer) => (
            <Grid item xs={12} sm={6} md={4} key={prayer.name}>
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

        {/* Prayer History Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Prayer History
          </Typography>
          <PrayerHistoryComponent prayerHistory={prayerHistory} onClose={() => {}} />
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Reports Section */}
        <PrayerReports prayerHistory={prayerHistory} />

        <Divider sx={{ my: 6 }} />

        {/* Fine History Section */}
        <FineHistory
          fineHistory={prayerHistory.fineHistory}
          finePayments={prayerHistory.finePayments || []}
          onPayFine={handlePayFine}
        />

        {/* Today's Fine Section */}
        <Box sx={{ mb: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.1)}, ${alpha(
                theme.palette.warning.main,
                0.2
              )})`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" color="warning.main" fontWeight="bold">
                    Today's Fine
                  </Typography>
                  <Typography color="text.secondary">
                    Rs. 10 fine for each missed prayer
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    Rs. {calculateTodaysFine()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* View History Button */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            View Prayer History
          </Button>
        </Box>

        <Divider sx={{ my: 6 }} />

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
      </Container>
    </Box>
  );
};

export default HomePage;
