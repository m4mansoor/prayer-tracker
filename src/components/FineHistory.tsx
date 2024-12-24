import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

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
  const [customDates, setCustomDates] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const calculateFineForDateRange = (startDate: string, endDate: string) => {
    let totalFine = 0;
    let paidAmount = 0;

    // Calculate total fine
    Object.entries(fineHistory).forEach(([date, data]) => {
      if (date >= startDate && date <= endDate) {
        const missedPrayers = data.prayers?.filter((p: any) => !p.completed) || [];
        totalFine += missedPrayers.length * 10;
      }
    });

    // Calculate paid amount
    finePayments.forEach(payment => {
      if (payment.date >= startDate && payment.date <= endDate) {
        paidAmount += payment.amount;
      }
    });

    return {
      totalFine,
      paidAmount,
      remainingFine: Math.max(0, totalFine - paidAmount)
    };
  };

  const renderDateRangeSummary = (startDate: string, endDate: string, label: string) => {
    const { totalFine, paidAmount, remainingFine } = calculateFineForDateRange(startDate, endDate);

    return (
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.warning.light,
            0.1
          )}, ${alpha(theme.palette.warning.main, 0.05)})`,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {label}
          </Typography>
          <Grid container spacing={2} alignItems="center">
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
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
              {remainingFine > 0 && (
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => onPayFine({
                    amount: remainingFine,
                    startDate,
                    endDate,
                  })}
                >
                  Pay ₨{remainingFine}
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  return (
    <Box>
      {renderDateRangeSummary(today, today, "Today's Fine")}
      {renderDateRangeSummary(weekStart, weekEnd, 'This Week')}
      {renderDateRangeSummary(monthStart, monthEnd, 'This Month')}

      <Card sx={{ mt: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Custom Date Range
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={customDates.start}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, start: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={customDates.end}
                onChange={(e) =>
                  setCustomDates((prev) => ({ ...prev, end: e.target.value }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {renderDateRangeSummary(customDates.start, customDates.end, 'Custom Range')}
        </CardContent>
      </Card>

      <Card sx={{ mt: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Payment History
          </Typography>
          {finePayments.length > 0 ? (
            finePayments.map((payment, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      Payment of ₨{payment.amount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(payment.date), 'PPP')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      For period: {format(new Date(payment.startDate), 'PP')} to{' '}
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
  );
};

export default FineHistory;
