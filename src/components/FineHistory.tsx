import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PaymentIcon from '@mui/icons-material/Payment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { FineHistory, FinePayment } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface FineHistoryProps {
  fineHistory: FineHistory;
  finePayments: FinePayment[];
  onPayFine: (payment: Omit<FinePayment, 'id' | 'paidAt' | 'status'>) => void;
}

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom';

const FineHistory: React.FC<FineHistoryProps> = ({
  fineHistory,
  finePayments,
  onPayFine,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [customRange, setCustomRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const getDateRange = () => {
    const now = new Date();
    let start = now;
    let end = now;

    switch (dateRange) {
      case 'daily':
        break;
      case 'weekly':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'monthly':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'custom':
        if (customRange.start && customRange.end) {
          start = customRange.start;
          end = customRange.end;
        }
        break;
    }

    return { start, end };
  };

  const calculateTotalFine = () => {
    const { start, end } = getDateRange();
    let total = 0;

    Object.entries(fineHistory).forEach(([date, data]) => {
      const currentDate = new Date(date);
      if (currentDate >= start && currentDate <= end && !data.paid) {
        total += data.amount;
      }
    });

    return total;
  };

  const handlePayment = () => {
    const { start, end } = getDateRange();
    const totalAmount = calculateTotalFine();

    if (totalAmount > 0) {
      onPayFine({
        amount: totalAmount,
        date: new Date().toISOString(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        paymentMethod,
      });
    }

    setShowPaymentDialog(false);
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        Fine History
      </Typography>

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
              <ToggleButton value="custom">Custom</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          {dateRange === 'custom' && (
            <Grid item xs={12} sm="auto">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box display="flex" gap={2}>
                  <DatePicker
                    label="Start Date"
                    value={customRange.start}
                    onChange={(date) =>
                      setCustomRange((prev) => ({ ...prev, start: date }))
                    }
                  />
                  <DatePicker
                    label="End Date"
                    value={customRange.end}
                    onChange={(date) =>
                      setCustomRange((prev) => ({ ...prev, end: date }))
                    }
                  />
                </Box>
              </LocalizationProvider>
            </Grid>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.warning.light,
                0.1
              )}, ${alpha(theme.palette.warning.main, 0.2)})`,
            }}
          >
            <CardContent>
              <Typography variant="h6" color="warning.main" gutterBottom>
                Unpaid Fines
              </Typography>
              {Object.entries(fineHistory)
                .filter(([date]) => {
                  const { start, end } = getDateRange();
                  const currentDate = new Date(date);
                  return currentDate >= start && currentDate <= end;
                })
                .map(([date, data]) => (
                  <Box
                    key={date}
                    sx={{
                      py: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">
                          {format(new Date(date), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography color="text.secondary">
                          {data.prayers.join(', ')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="subtitle1"
                          color={data.paid ? 'success.main' : 'warning.main'}
                          fontWeight="bold"
                        >
                          Rs. {data.amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              background: theme.palette.background.paper,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Fine
              </Typography>
              <Typography variant="h3" color="warning.main" gutterBottom>
                Rs. {calculateTotalFine()}
              </Typography>
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                fullWidth
                onClick={() => setShowPaymentDialog(true)}
                disabled={calculateTotalFine() === 0}
                sx={{
                  mt: 2,
                  background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.warning.dark}, ${theme.palette.warning.main})`,
                  },
                }}
              >
                Pay Fine
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              {finePayments
                .filter((payment) => {
                  const { start, end } = getDateRange();
                  const paymentDate = new Date(payment.date);
                  return paymentDate >= start && paymentDate <= end;
                })
                .map((payment) => (
                  <Box
                    key={payment.id}
                    sx={{
                      py: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 0 },
                    }}
                  >
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle1">
                          {format(new Date(payment.date), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography color="text.secondary">
                          {payment.paymentMethod}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Typography color="text.secondary">
                          {format(new Date(payment.startDate), 'MMM dd')} -{' '}
                          {format(new Date(payment.endDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="subtitle1"
                          color="success.main"
                          fontWeight="bold"
                        >
                          Rs. {payment.amount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)}>
        <DialogTitle>Pay Fine</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Total Amount: Rs. {calculateTotalFine()}
            </Typography>
            <TextField
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
              <MenuItem value="easypaisa">Easypaisa</MenuItem>
              <MenuItem value="jazzcash">JazzCash</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            color="warning"
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FineHistory;
