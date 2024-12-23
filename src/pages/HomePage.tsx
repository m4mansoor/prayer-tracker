import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MosqueIcon from '@mui/icons-material/Mosque';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { v4 as uuidv4 } from 'uuid';
import { Prayer, PrayerHistory, PaymentHistory, PrayerSettings, UserPreferences, PrayerTimes } from '../types';
import {
  DEFAULT_PRAYERS,
  getToday,
  createDailyPrayers,
  updateDailyPrayers,
  calculatePrayerTimes,
  getQiblaDirection,
} from '../utils/prayerUtils';
import { calculatePrayerStats } from '../utils/analyticsUtils';
import PrayerHistoryComponent from '../components/PrayerHistory';
import PaymentHistoryComponent from '../components/PaymentHistory';
import PrayerTimeSettings from '../components/PrayerTimeSettings';
import PrayerTimesDisplay from '../components/PrayerTimesDisplay';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const HomePage: React.FC = () => {
  const [prayerHistory, setPrayerHistory] = useState<PrayerHistory>(() => {
    const savedHistory = localStorage.getItem('prayerHistory');
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
    return {
      [getToday()]: createDailyPrayers(),
    };
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory>(() => {
    const savedPayments = localStorage.getItem('paymentHistory');
    if (savedPayments) {
      return JSON.parse(savedPayments);
    }
    return {
      records: [],
      totalPaid: 0,
    };
  });

  const [prayerSettings, setPrayerSettings] = useState<PrayerSettings>(() => {
    const saved = localStorage.getItem('prayerSettings');
    return saved ? JSON.parse(saved) : {
      location: { latitude: 0, longitude: 0 },
      calculationMethod: 'MuslimWorldLeague',
      asrMethod: 'Standard',
      adjustments: {
        fajr: 0,
        sunrise: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
      },
    };
  });

  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'en',
      notificationsEnabled: false,
      notificationSound: true,
      notificationTime: 15,
    };
  });

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);

  const today = getToday();
  const todaysPrayers = prayerHistory[today]?.prayers || DEFAULT_PRAYERS;
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    // Initialize today's prayers if not exists
    if (!prayerHistory[today]) {
      setPrayerHistory(prev => ({
        ...prev,
        [today]: createDailyPrayers(),
      }));
    }
  }, [today]);

  useEffect(() => {
    // Save to localStorage whenever history changes
    localStorage.setItem('prayerHistory', JSON.stringify(prayerHistory));
  }, [prayerHistory]);

  useEffect(() => {
    // Save payment history to localStorage
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  useEffect(() => {
    localStorage.setItem('prayerSettings', JSON.stringify(prayerSettings));
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));

    // Calculate prayer times for today
    const times = calculatePrayerTimes(new Date(), prayerSettings);
    setPrayerTimes(times);

    // Calculate Qibla direction
    const qibla = getQiblaDirection(prayerSettings.location);
    setQiblaDirection(qibla);
  }, [prayerSettings, userPreferences]);

  // Request notification permission when enabled
  useEffect(() => {
    if (userPreferences.notificationsEnabled) {
      Notification.requestPermission();
    }
  }, [userPreferences.notificationsEnabled]);

  const handlePrayerComplete = async (prayerName: string) => {
    try {
      const updatedDailyPrayers = updateDailyPrayers(
        prayerHistory[today],
        prayerName,
        true
      );

      setPrayerHistory(prev => ({
        ...prev,
        [today]: updatedDailyPrayers,
      }));
    } catch (error) {
      console.error('Error marking prayer as complete:', error);
    }
  };

  const handleEditPrayer = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setEditDialogOpen(true);
  };

  const handleSavePrayerEdit = () => {
    if (selectedPrayer) {
      const updatedPrayers = todaysPrayers.map(prayer =>
        prayer.name === selectedPrayer.name ? selectedPrayer : prayer
      );

      setPrayerHistory(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          prayers: updatedPrayers,
        },
      }));

      setEditDialogOpen(false);
      setSelectedPrayer(null);
    }
  };

  const handlePayFine = () => {
    const payment = Number(paymentAmount);
    if (payment > 0) {
      const currentBalance = prayerHistory[today]?.totalFine || 0;
      const newBalance = Math.max(0, currentBalance - payment);
      
      // Update prayer history
      setPrayerHistory(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          totalFine: newBalance,
        },
      }));

      // Add payment record
      const newPayment = {
        id: uuidv4(),
        amount: payment,
        date: new Date().toISOString(),
        remainingBalance: newBalance,
      };

      setPaymentHistory(prev => ({
        records: [newPayment, ...prev.records],
        totalPaid: prev.totalPaid + payment,
      }));
    }
    setPaymentAmount('');
    setPaymentDialogOpen(false);
  };

  const handleSettingsChange = (newSettings: PrayerSettings) => {
    setPrayerSettings(newSettings);
  };

  const handleNotificationSettingsChange = (enabled: boolean, time: number) => {
    setUserPreferences(prev => ({
      ...prev,
      notificationsEnabled: enabled,
      notificationTime: time,
    }));
  };

  return (
    <Box className="islamic-pattern" sx={{ minHeight: '100vh', py: 4, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Prayer Times Display */}
        {prayerTimes && (
          <PrayerTimesDisplay
            prayerTimes={prayerTimes}
            qiblaDirection={qiblaDirection}
          />
        )}

        {/* Prayer Time Settings */}
        <PrayerTimeSettings
          settings={prayerSettings}
          onSettingsChange={handleSettingsChange}
          notificationsEnabled={userPreferences.notificationsEnabled}
          notificationTime={userPreferences.notificationTime}
          onNotificationSettingsChange={handleNotificationSettingsChange}
        />

        {/* Today's Prayers Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(195, 147, 91, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MosqueIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
                Today's Prayers
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setPaymentDialogOpen(true)}
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(195, 147, 91, 0.2)',
              }}
            >
              Pay Fine
            </Button>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(195, 147, 91, 0.2)' }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Today's Fine: ${prayerHistory[today]?.totalFine || 0}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {new Date().toLocaleDateString()}
            </Typography>
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
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" component="div" color="primary.main" gutterBottom>
                          {prayer.name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Amiri', color: 'secondary.main' }}>
                          {prayer.arabicName}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleEditPrayer(prayer)}
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'rgba(31, 75, 63, 0.1)' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography color="text.secondary" gutterBottom>
                        Time: {prayer.startTime} - {prayer.endTime}
                      </Typography>
                      <Typography color="text.secondary">
                        Fine Amount: ${prayer.fineAmount}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {prayer.completed ? (
                        <CheckCircleIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <PendingIcon sx={{ color: 'warning.main' }} />
                      )}
                      <Typography color={prayer.completed ? 'success.main' : 'warning.main'}>
                        {prayer.completed ? 'Completed' : 'Pending'}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={prayer.completed ? "contained" : "outlined"}
                      color={prayer.completed ? "success" : "primary"}
                      onClick={() => !prayer.completed && handlePrayerComplete(prayer.name)}
                      disabled={prayer.completed}
                      sx={{ 
                        py: 1,
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        '&:not(:disabled):hover': {
                          transform: 'scale(1.02)',
                        }
                      }}
                    >
                      {prayer.completed ? "Completed" : "Mark as Done"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard
          history={prayerHistory}
          stats={calculatePrayerStats(prayerHistory)}
        />

        {/* Prayer History Component */}
        <PrayerHistoryComponent 
          history={prayerHistory} 
          onUpdatePrayer={(date, prayerName, completed) => {
            const dayData = prayerHistory[date];
            if (dayData) {
              const updatedDailyPrayers = updateDailyPrayers(dayData, prayerName, completed);
              setPrayerHistory(prev => ({
                ...prev,
                [date]: updatedDailyPrayers,
              }));
            }
          }}
        />

        {/* Payment History Component */}
        <PaymentHistoryComponent paymentHistory={paymentHistory} />

        {/* Edit Prayer Dialog */}
        <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'primary.main', borderBottom: '1px solid rgba(195, 147, 91, 0.2)' }}>
            Edit Prayer Time
          </DialogTitle>
          <DialogContent>
            {selectedPrayer && (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={selectedPrayer.startTime}
                  onChange={(e) => setSelectedPrayer({ ...selectedPrayer, startTime: e.target.value })}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={selectedPrayer.endTime}
                  onChange={(e) => setSelectedPrayer({ ...selectedPrayer, endTime: e.target.value })}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Fine Amount"
                  type="number"
                  value={selectedPrayer.fineAmount}
                  onChange={(e) => setSelectedPrayer({ ...selectedPrayer, fineAmount: Number(e.target.value) })}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(195, 147, 91, 0.2)' }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSavePrayerEdit} 
              variant="contained"
              sx={{ px: 4 }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pay Fine Dialog */}
        <Dialog 
          open={paymentDialogOpen} 
          onClose={() => setPaymentDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <DialogTitle sx={{ color: 'primary.main', borderBottom: '1px solid rgba(195, 147, 91, 0.2)' }}>
            Pay Fine
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography gutterBottom color="text.secondary">
                Current Balance: ${prayerHistory[today]?.totalFine || 0}
              </Typography>
              <TextField
                fullWidth
                label="Payment Amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(195, 147, 91, 0.2)' }}>
            <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handlePayFine} 
              variant="contained" 
              color="primary"
              sx={{ px: 4 }}
            >
              Pay
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default HomePage;
