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
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { FinePayment } from '../types';

interface FineHistoryProps {
  fineHistory: Record<string, { amount: number; prayers: string[] }>;
  finePayments: FinePayment[];
  onPayFine: (amount: number) => void;
}

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom';

const FineHistory: React.FC<FineHistoryProps> = ({
  fineHistory,
  finePayments,
  onPayFine,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });

  const getDateRange = () => {
    const now = new Date();
    let start = now;
    let end = now;

    switch (dateRange) {
      case 'daily':
        start = new Date(format(now, 'yyyy-MM-dd'));
        end = new Date(format(now, 'yyyy-MM-dd'));
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
          start = new Date(customRange.start);
          end = new Date(customRange.end);
        }
        break;
    }

    return { start, end };
  };

  const getFilteredFines = () => {
    const { start, end } = getDateRange();
    return Object.entries(fineHistory)
      .filter(([date]) => {
        const currentDate = new Date(date);
        return currentDate >= start && currentDate <= end;
      })
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
  };

  const filteredFines = getFilteredFines();
  const totalFine = filteredFines.reduce((sum, [_, data]) => sum + data.amount, 0);
  const totalPaid = finePayments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const { start, end } = getDateRange();
      return paymentDate >= start && paymentDate <= end;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);
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
              <ToggleButton value="custom">Custom</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          {dateRange === 'custom' && (
            <Grid item xs={12} sm="auto">
              <Box display="flex" gap={2}>
                <input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                />
              </Box>
            </Grid>
          )}
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
                ₨{totalFine}
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
                ₨{totalPaid}
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
                ₨{remainingFine}
              </Typography>
              {remainingFine > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => onPayFine(remainingFine)}
                >
                  Pay Now
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Fine Details
              </Typography>
              <Grid container spacing={2}>
                {filteredFines.map(([date, data]) => (
                  <Grid item xs={12} key={date}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Missed Prayers: {data.prayers.join(', ')}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h6" color="warning.main">
                              ₨{data.amount}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={() => onPayFine(data.amount)}
                            >
                              Pay
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
            .filter(payment => {
              const paymentDate = new Date(payment.date);
              const { start, end } = getDateRange();
              return paymentDate >= start && paymentDate <= end;
            })
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
                          ₨{payment.amount}
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
    </Box>
  );
};

export default FineHistory;
