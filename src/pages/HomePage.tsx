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
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { v4 as uuidv4 } from 'uuid';
import { Prayer, PrayerHistory, PaymentHistory } from '../types';
import {
  DEFAULT_PRAYERS,
  getToday,
  createDailyPrayers,
  updateDailyPrayers,
} from '../utils/prayerUtils';
import PrayerHistoryComponent from '../components/PrayerHistory';
import PaymentHistoryComponent from '../components/PaymentHistory';

const HomePage: React.FC = () => {
  // Initialize prayer history with today's prayers
  const [prayerHistory, setPrayerHistory] = useState<PrayerHistory>(() => {
    const savedHistory = localStorage.getItem('prayerHistory');
    if (savedHistory) {
      return JSON.parse(savedHistory);
    }
    const today = getToday();
    return {
      [today]: createDailyPrayers(today)
    };
  });

  // Initialize payment history
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory>(() => {
    const savedPayments = localStorage.getItem('paymentHistory');
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // Save prayer history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('prayerHistory', JSON.stringify(prayerHistory));
  }, [prayerHistory]);

  // Save payment history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
  }, [paymentHistory]);

  // Handle prayer completion toggle
  const handlePrayerToggle = (prayer: Prayer) => {
    const today = getToday();
    const updatedHistory = { ...prayerHistory };
    
    if (!updatedHistory[today]) {
      updatedHistory[today] = createDailyPrayers(today);
    }
    
    const dayPrayers = updatedHistory[today].prayers.map(p => 
      p.name === prayer.name ? { ...p, completed: !p.completed } : p
    );
    
    updatedHistory[today] = {
      ...updatedHistory[today],
      prayers: dayPrayers
    };
    
    setPrayerHistory(updatedHistory);
  };

  // Get today's prayers
  const today = getToday();
  const todaysPrayers = prayerHistory[today]?.prayers || createDailyPrayers(today).prayers;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Qunoot Prayer Tracker
      </Typography>

      {/* Today's Prayers Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          backgroundColor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          Today's Prayers
        </Typography>
        <Grid container spacing={2}>
          {todaysPrayers.map((prayer) => (
            <Grid item xs={12} sm={6} md={4} key={prayer.name}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: prayer.completed ? '#e8f5e9' : 'background.paper'
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {prayer.name}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    {prayer.completed ? (
                      <SentimentSatisfiedAltIcon color="success" />
                    ) : (
                      <SentimentVeryDissatisfiedIcon color="error" />
                    )}
                    <Typography sx={{ ml: 1 }}>
                      {prayer.completed ? 'Completed' : 'Pending'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handlePrayerToggle(prayer)}
                    startIcon={prayer.completed ? <CheckCircleIcon /> : <PendingIcon />}
                  >
                    {prayer.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* History Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={() => setShowHistory(true)}
          startIcon={<MosqueIcon />}
        >
          View Prayer History
        </Button>
        <Button
          variant="outlined"
          onClick={() => setShowPaymentHistory(true)}
          startIcon={<EditIcon />}
        >
          View Payment History
        </Button>
      </Box>

      {/* Prayer History */}
      {showHistory && (
        <PrayerHistoryComponent
          prayerHistory={prayerHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Payment History */}
      {showPaymentHistory && (
        <PaymentHistoryComponent
          paymentHistory={paymentHistory}
          onClose={() => setShowPaymentHistory(false)}
        />
      )}
    </Container>
  );
};

export default HomePage;
