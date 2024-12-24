import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { format } from 'date-fns';

interface FineHistoryProps {
  fineHistory: Record<string, any>;
  finePayments: Array<{
    date: string;
    amount: number;
    startDate: string;
    endDate: string;
  }>;
  onPayFine: (payment: any) => void;
}

const FineHistory: React.FC<FineHistoryProps> = ({
  fineHistory,
  finePayments = [],
  onPayFine,
}) => {
  const theme = useTheme();

  const calculateFineForDate = (date: string) => {
    let totalFine = 0;
    let paidAmount = 0;

    // Calculate total fine for this date
    if (fineHistory[date]) {
      const missedPrayers = fineHistory[date].prayers?.filter((p: any) => !p.completed) || [];
      totalFine = missedPrayers.length * 10;
    }

    // Calculate paid amount for this date
    finePayments.forEach(payment => {
      if (payment.date === date) {
        paidAmount += payment.amount;
      }
    });

    return {
      totalFine,
      paidAmount,
      remainingFine: Math.max(0, totalFine - paidAmount)
    };
  };

  const dates = Object.keys(fineHistory).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Fine History
        </Typography>
        
        <Grid container spacing={3}>
          {dates.map(date => {
            const { totalFine, paidAmount, remainingFine } = calculateFineForDate(date);
            
            return (
              <Grid item xs={12} key={date}>
                <Card 
                  sx={{ 
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${alpha(
                      theme.palette.warning.light,
                      0.1
                    )}, ${alpha(theme.palette.warning.main, 0.05)})`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6">
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Total Fine
                            </Typography>
                            <Typography variant="h6" color="warning.main">
                              ₨{totalFine}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Paid Amount
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              ₨{paidAmount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Remaining
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              ₨{remainingFine}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {fineHistory[date].prayers && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Missed Prayers: {fineHistory[date].prayers
                                .filter((p: any) => !p.completed)
                                .map((p: any) => p.name)
                                .join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {remainingFine > 0 && (
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => onPayFine({
                              amount: remainingFine,
                              startDate: date,
                              endDate: date,
                            })}
                          >
                            Pay ₨{remainingFine}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Payment History
        </Typography>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            {finePayments.length > 0 ? (
              finePayments.map((payment, index) => (
                <Box key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" color="success.main">
                        ₨{payment.amount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Paid on {format(new Date(payment.date), 'PPP')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        For prayers missed between:
                      </Typography>
                      <Typography variant="body2">
                        {format(new Date(payment.startDate), 'PP')} to{' '}
                        {format(new Date(payment.endDate), 'PP')}
                      </Typography>
                    </Grid>
                  </Grid>
                  {index < finePayments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No payments made yet
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default FineHistory;
