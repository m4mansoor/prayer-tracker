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
  alpha,
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
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(
            theme.palette.background.paper,
            0.95
          )} 100%)`,
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            '& h2': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            },
          }}
        >
          <Typography variant="h4" component="h2" fontWeight="bold">
            Prayer History
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          {/* Statistics Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(
                theme.palette.secondary.main,
                0.1
              )} 100%)`,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.6),
                  }}
                >
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {stats.completionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completion Rate
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.6),
                  }}
                >
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {stats.streakData.currentStreak}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Current Streak
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.background.paper, 0.6),
                  }}
                >
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    Rs. {stats.totalFine}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Fine
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Prayer Records */}
          <Box>
            {sortedDates.map((date) => (
              <Paper
                key={date}
                elevation={0}
                sx={{
                  p: 3,
                  mb: 2,
                  background: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    mb: 2,
                  }}
                >
                  {formatDate(date)}
                </Typography>
                <Grid container spacing={2}>
                  {prayerHistory[date].prayers.map((prayer, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1.5,
                          borderRadius: 2,
                          background: prayer.completed
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                          border: `1px solid ${
                            prayer.completed
                              ? alpha(theme.palette.success.main, 0.2)
                              : alpha(theme.palette.error.main, 0.2)
                          }`,
                        }}
                      >
                        {prayer.completed ? (
                          <CheckCircleIcon
                            sx={{ color: theme.palette.success.main }}
                          />
                        ) : (
                          <CancelIcon
                            sx={{ color: theme.palette.error.main }}
                          />
                        )}
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: prayer.completed
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                              fontWeight: 'medium',
                            }}
                          >
                            {prayer.name}
                          </Typography>
                          {prayer.fine > 0 && (
                            <Typography
                              variant="caption"
                              sx={{ color: theme.palette.error.main }}
                            >
                              Fine: Rs. {prayer.fine}
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
