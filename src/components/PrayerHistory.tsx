import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Prayer, PrayerHistory } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface PrayerHistoryProps {
  prayerHistory: PrayerHistory;
  onClose: () => void;
}

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom';

const PrayerHistoryComponent: React.FC<PrayerHistoryProps> = ({
  prayerHistory,
  onClose,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });

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
          start = new Date(customRange.start);
          end = new Date(customRange.end);
        }
        break;
    }

    return { start, end };
  };

  const togglePrayerStatus = (date: string, prayerName: string) => {
    const prayers = prayerHistory[date]?.prayers || [];
    const updatedPrayers = prayers.map((prayer) =>
      prayer.name === prayerName
        ? { ...prayer, completed: !prayer.completed }
        : prayer
    );

    const updatedHistory = {
      ...prayerHistory,
      [date]: {
        ...prayerHistory[date],
        prayers: updatedPrayers,
      },
    };

    localStorage.setItem('prayerHistory', JSON.stringify(updatedHistory));
    window.location.reload(); // Refresh to update all components
  };

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
                />
                <input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {Object.entries(prayerHistory)
          .filter(([date]) => {
            if (date === 'fineHistory' || date === 'finePayments') return false;
            const { start, end } = getDateRange();
            const currentDate = new Date(date);
            return currentDate >= start && currentDate <= end;
          })
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, dayData]) => (
            <Grid item xs={12} key={date}>
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
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </Typography>
                  <Grid container spacing={2}>
                    {dayData.prayers.map((prayer) => (
                      <Grid item xs={12} sm={6} md={4} key={prayer.name}>
                        <Card
                          sx={{
                            borderRadius: 2,
                            bgcolor: prayer.completed
                              ? alpha(theme.palette.success.main, 0.1)
                              : alpha(theme.palette.error.main, 0.1),
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  color={
                                    prayer.completed ? 'success.main' : 'error.main'
                                  }
                                  fontWeight="bold"
                                >
                                  {prayer.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {prayer.time}
                                </Typography>
                              </Box>
                              <Box display="flex" gap={1}>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    togglePrayerStatus(date, prayer.name)
                                  }
                                  sx={{
                                    color: prayer.completed
                                      ? 'success.main'
                                      : 'error.main',
                                  }}
                                >
                                  {prayer.completed ? (
                                    <CheckCircleIcon />
                                  ) : (
                                    <CancelIcon />
                                  )}
                                </IconButton>
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
          ))}
      </Grid>
    </Box>
  );
};

export default PrayerHistoryComponent;
