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
  useTheme,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { PrayerHistory as PrayerHistoryType, PrayerStats } from '../types';

interface PrayerHistoryComponentProps {
  prayerHistory: PrayerHistoryType;
  onClose: () => void;
}

const PrayerHistoryComponent: React.FC<PrayerHistoryComponentProps> = ({
  prayerHistory,
  onClose,
}) => {
  const theme = useTheme();
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Prayer History
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ p: 2 }}>
          {/* Statistics Summary */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'primary.main',
                  borderRadius: 2
                }}
              >
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {stats.completionRate.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'success.main',
                  borderRadius: 2
                }}
              >
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {stats.streakData.currentStreak}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Streak
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center',
                  border: 1,
                  borderColor: 'error.main',
                  borderRadius: 2
                }}
              >
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 'bold' }}>
                  {stats.totalFine}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fine (Rs)
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Prayer Records */}
          <Box>
            {sortedDates.map((date) => (
              <Paper
                key={date}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'medium',
                    mb: 2,
                    color: 'text.primary'
                  }}
                >
                  {formatDate(date)}
                </Typography>
                <Grid container spacing={1}>
                  {prayerHistory[date].prayers.map((prayer, index) => (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: prayer.completed ? 'success.lighter' : 'error.lighter',
                        }}
                      >
                        {prayer.completed ? (
                          <CheckCircleIcon fontSize="small" color="success" />
                        ) : (
                          <CancelIcon fontSize="small" color="error" />
                        )}
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'medium',
                              color: prayer.completed ? 'success.dark' : 'error.dark',
                            }}
                          >
                            {prayer.name}
                          </Typography>
                          {prayer.fine > 0 && (
                            <Typography
                              variant="caption"
                              color="error"
                            >
                              Rs. {prayer.fine}
                            </Typography>
                          )}
                        </Box>
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
