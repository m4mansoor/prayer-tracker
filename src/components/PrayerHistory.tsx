import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { PrayerHistory as PrayerHistoryType, DailyPrayers, Prayer } from '../types';

interface PrayerHistoryComponentProps {
  prayerHistory: PrayerHistoryType;
  onClose: () => void;
}

interface PrayerStats {
  totalPrayers: number;
  completedPrayers: number;
  missedPrayers: number;
  totalFine: number;
  completionRate: number;
  streakData: {
    currentStreak: number;
    longestStreak: number;
  };
  timeAnalysis: {
    onTime: number;
    delayed: number;
  };
}

const PrayerHistoryComponent: React.FC<PrayerHistoryComponentProps> = ({
  prayerHistory,
  onClose,
}) => {
  const sortedDates = Object.keys(prayerHistory).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const calculateStats = (): PrayerStats => {
    let totalPrayers = 0;
    let completedPrayers = 0;
    let totalFine = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    let onTimePrayers = 0;
    let delayedPrayers = 0;

    Object.values(prayerHistory).forEach((day) => {
      day.prayers.forEach((prayer) => {
        totalPrayers++;
        if (prayer.completed) {
          completedPrayers++;
          if (prayer.completedOnTime) {
            onTimePrayers++;
          } else {
            delayedPrayers++;
          }
        }
        if (prayer.fine) {
          totalFine += prayer.fine;
        }
      });

      // Calculate streaks
      const allCompleted = day.prayers.every((p) => p.completed);
      if (allCompleted) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    const missedPrayers = totalPrayers - completedPrayers;
    const completionRate = totalPrayers > 0 ? (completedPrayers / totalPrayers) * 100 : 0;

    return {
      totalPrayers,
      completedPrayers,
      missedPrayers,
      totalFine,
      completionRate,
      streakData: {
        currentStreak,
        longestStreak,
      },
      timeAnalysis: {
        onTime: onTimePrayers,
        delayed: delayedPrayers,
      },
    };
  };

  const stats = calculateStats();

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Prayer History</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          {/* Statistics Summary */}
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Total Prayers</Typography>
                <Typography>{stats.totalPrayers}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Completion Rate</Typography>
                <Typography>{stats.completionRate.toFixed(1)}%</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Total Fine</Typography>
                <Typography>Rs. {stats.totalFine}</Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Prayer Records */}
          <Box>
            {sortedDates.map((date) => (
              <Paper key={date} elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {formatDate(date)}
                </Typography>
                <Grid container spacing={2}>
                  {prayerHistory[date].prayers.map((prayer, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {prayer.completed ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )}
                        <Typography>
                          {prayer.name} {prayer.fine ? `(Fine: Rs. ${prayer.fine})` : ''}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default PrayerHistoryComponent;
