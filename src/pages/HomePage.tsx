import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [showPayFineDialog, setShowPayFineDialog] = useState(false);
  const [fineAmount, setFineAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [editingPrayer, setEditingPrayer] = useState<{ name: string; time: string } | null>(null);
  const [prayerHistory, setPrayerHistory] = useState<{
    [key: string]: {
      prayers: Prayer[];
      finePayments?: Array<{
        date: string;
        amount: number;
        startDate: string;
        endDate: string;
      }>;
    };
  }>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('prayerHistory');
    if (savedHistory) {
      setPrayerHistory(JSON.parse(savedHistory));
    } else {
      // Initialize with today's prayers if no history exists
      const today = new Date().toISOString().split('T')[0];
      setPrayerHistory({
        [today]: {
          prayers: defaultPrayers,
          finePayments: []
        }
      });
    }
  }, []);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.state]);

  const today = new Date().toISOString().split('T')[0];
  const todaysPrayers = prayerHistory[today]?.prayers || defaultPrayers;

  const handlePrayerStatusChange = (index: number, completed: boolean, reason: string = '') => {
    setPrayerHistory(prev => {
      const updated = { ...prev };
      if (!updated[today]) {
        updated[today] = {
          prayers: [...defaultPrayers],
          finePayments: []
        };
      }
      
      const updatedPrayers = [...updated[today].prayers];
      updatedPrayers[index] = {
        ...updatedPrayers[index],
        completed,
        reason: completed ? '' : reason
      };
      
      updated[today].prayers = updatedPrayers;
      localStorage.setItem('prayerHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePrayerTimeUpdate = (index: number, startTime: string, endTime: string) => {
    setPrayerHistory(prev => {
      const updated = { ...prev };
      if (!updated[today]) {
        updated[today] = {
          prayers: [...defaultPrayers],
          finePayments: []
        };
      }
      
      const updatedPrayers = [...updated[today].prayers];
      updatedPrayers[index] = {
        ...updatedPrayers[index],
        startTime,
        endTime
      };
      
      updated[today].prayers = updatedPrayers;
      localStorage.setItem('prayerHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePayFine = () => {
    if (!selectedPayment) return;

    setPrayerHistory(prev => {
      const updated = { ...prev };
      if (!updated.finePayments) {
        updated.finePayments = [];
      }
      
      updated.finePayments.push({
        date: today,
        amount: selectedPayment.amount,
        startDate: selectedPayment.startDate,
        endDate: selectedPayment.endDate
      });
      
      localStorage.setItem('prayerHistory', JSON.stringify(updated));
      return updated;
    });

    setShowPayFineDialog(false);
    setSelectedPayment(null);
  };

  return (
    <Box>
      <Navigation onSectionClick={(section) => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box id="prayers" sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Today's Prayers
          </Typography>
          <Grid container spacing={3}>
            {todaysPrayers.map((prayer, index) => (
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{prayer.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          mr: 1,
                          color: prayer.completed ? theme.palette.success.main : theme.palette.text.secondary
                        }}
                      >
                        {prayer.startTime} - {prayer.endTime}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => setEditingPrayer({ name: prayer.name, time: prayer.startTime })}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <PrayerHistory
                    prayers={[prayer]}
                    onPrayerUpdate={(_, completed, reason) => 
                      handlePrayerStatusChange(index, completed, reason)
                    }
                    onTimeUpdate={(_, startTime, endTime) =>
                      handlePrayerTimeUpdate(index, startTime, endTime)
                    }
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
            fineHistory={prayerHistory}
            finePayments={prayerHistory.finePayments || []}
            onPayFine={(payment) => {
              setSelectedPayment(payment);
              setFineAmount(payment.amount);
              setShowPayFineDialog(true);
            }}
          />
        </Box>
      </Container>

      <Dialog open={showPayFineDialog} onClose={() => setShowPayFineDialog(false)}>
        <DialogTitle>Pay Fine</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to pay ₨{fineAmount}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPayFineDialog(false)}>Cancel</Button>
          <Button onClick={handlePayFine} variant="contained" color="primary">
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default HomePage;
