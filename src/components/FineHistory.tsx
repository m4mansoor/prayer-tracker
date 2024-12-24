import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { FinePayment } from '../types';

interface FineHistoryProps {
  fineHistory: Record<string, number>;
  finePayments: FinePayment[];
  onPayFine: (amount: number) => void;
}

type DateRange = 'daily' | 'weekly' | 'monthly';

const FineHistory: React.FC<FineHistoryProps> = ({
  fineHistory,
  finePayments,
  onPayFine,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const totalFine = Object.values(fineHistory).reduce((sum, fine) => sum + fine, 0);
  const totalPaid = finePayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingFine = totalFine - totalPaid;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={(_, value) => value && setDateRange(value)}
              size="small"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.light,
                0.1
              )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Fine
              </Typography>
              <Typography variant="h4" color="primary.main">
                ₹{totalFine}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.success.light,
                0.1
              )}, ${alpha(theme.palette.success.main, 0.05)})`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Paid
              </Typography>
              <Typography variant="h4" color="success.main">
                ₹{totalPaid}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.error.light,
                0.1
              )}, ${alpha(theme.palette.error.main, 0.05)})`,
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Remaining Fine
              </Typography>
              <Typography variant="h4" color="error.main">
                ₹{remainingFine}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Payment History
        </Typography>
        <Grid container spacing={2}>
          {finePayments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((payment) => (
              <Grid item xs={12} key={payment.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="subtitle1" color="success.main">
                          ₹{payment.amount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(payment.date), 'MMMM d, yyyy')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {payment.method}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      {remainingFine > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Pay Fine
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onPayFine(paymentAmount);
                  setPaymentAmount(0);
                }}
                disabled={paymentAmount <= 0 || paymentAmount > remainingFine}
              >
                Pay Now
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default FineHistory;
