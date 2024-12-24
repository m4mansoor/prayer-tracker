import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Grid,
  Card,
  CardContent,
  IconButton,
  TextField,
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
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  const [prayerHistory, setPrayerHistory] = useState<Record<string, any>>({});
  const [showPayFineDialog, setShowPayFineDialog] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [todaysPrayers, setTodaysPrayers] = useState<Prayer[]>([]);
  const [editingPrayer, setEditingPrayer] = useState<{ name: string; time: string } | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('prayerHistory');
    if (savedHistory) {
      setPrayerHistory(JSON.parse(savedHistory));
    }

    // Handle scroll to section from navigation
    if (location.state?.scrollTo) {
      scrollToSection(location.state.scrollTo);
    }
  }, [location.state]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('prayerHistory');
    if (storedHistory) {
      setPrayerHistory(JSON.parse(storedHistory));
    } else {
      setPrayerHistory({ fineHistory: {}, finePayments: [] });
    }
    setTodaysPrayers(getTodaysPrayers());
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysPrayersFromHistory = prayerHistory[today]?.prayers || defaultPrayers;

  const handlePrayerStatusChange = (index: number, completed: boolean, reason: string = '') => {
    const updatedHistory = { ...prayerHistory };
    if (!updatedHistory[today]) {
      updatedHistory[today] = {
        prayers: defaultPrayers.map(p => ({ ...p })),
      };
    }

    updatedHistory[today].prayers[index] = {
      ...updatedHistory[today].prayers[index],
      completed,
      reason: completed ? '' : reason,
    };

    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
  };

  const handlePrayerTimeUpdate = (index: number, startTime: string, endTime: string) => {
    const updatedHistory = { ...prayerHistory };
    if (!updatedHistory[today]) {
      updatedHistory[today] = {
        prayers: defaultPrayers.map(p => ({ ...p })),
      };
    }

    updatedHistory[today].prayers[index] = {
      ...updatedHistory[today].prayers[index],
      startTime,
      endTime,
    };

    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
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

  const handlePayFine = () => {
    if (!selectedPayment) return;

    const updatedHistory = { ...prayerHistory };
    if (!updatedHistory.finePayments) {
      updatedHistory.finePayments = [];
    }

    updatedHistory.finePayments.push({
      date: today,
      amount: selectedPayment.amount,
      startDate: selectedPayment.startDate,
      endDate: selectedPayment.endDate,
    });

    setPrayerHistory(updatedHistory);
    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
    setShowPayFineDialog(false);
    setSelectedPayment(null);
  };

  const calculateTodaysFine = () => {
    return todaysPrayers.reduce((total, prayer) => {
      if (!prayer.completed) {
        return total + 10; // 10 rupees fine for each missed prayer
      }
      return total;
    }, 0);
  };

  return (
    <Box>
      <Navigation onSectionClick={scrollToSection} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box id="prayers" sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Today's Prayers
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {todaysPrayersFromHistory.map((prayer, index) => (
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
                          onClick={() => handlePrayerStatusChange(index, !prayer.completed)}
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

          <Box sx={{ mb: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.light, 0.1)}, ${alpha(
                  theme.palette.warning.main,
                  0.05
                )})`,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Today's Fine
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h4" color="warning.main">
                    ₨{calculateTodaysFine()}
                  </Typography>
                  {calculateTodaysFine() > 0 && (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setFineAmount(calculateTodaysFine());
                        setShowPayFineDialog(true);
                      }}
                    >
                      Pay Now
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box id="history" sx={{ mt: 4 }}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              Prayer History
            </Typography>
            <PrayerHistoryComponent
              prayerHistory={prayerHistory}
              onClose={() => {}}
              onPrayerUpdate={handlePrayerStatusChange}
              onTimeUpdate={handlePrayerTimeUpdate}
            />
          </Box>

          <Box id="fines" sx={{ mt: 4 }}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              Fine History
            </Typography>
            <FineHistory
              fineHistory={prayerHistory.fineHistory}
              finePayments={prayerHistory.finePayments || []}
              onPayFine={(payment) => {
                setSelectedPayment(payment);
                setFineAmount(payment.amount);
                setShowPayFineDialog(true);
              }}
            />
          </Box>

          <Box id="reports" sx={{ mt: 4 }}>
            <Typography variant="h5" color="primary.main" gutterBottom>
              Prayer Reports
            </Typography>
            <PrayerReports prayerHistory={prayerHistory} />
          </Box>
        </Box>
      </Container>

      {/* Pay Fine Dialog */}
      <Dialog 
        open={showPayFineDialog} 
        onClose={() => setShowPayFineDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" color="primary">
            Pay Today's Fine
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" paragraph>
              You have a fine of <strong>₨{fineAmount}</strong> for today's missed prayers.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              By paying the fine, you acknowledge your missed prayers and commit to being more regular in your prayers.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPayFineDialog(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlePayFine();
              setShowPayFineDialog(false);
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default HomePage;
