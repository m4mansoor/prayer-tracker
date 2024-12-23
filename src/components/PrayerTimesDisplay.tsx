import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { PrayerTimes } from '../types';
import { formatPrayerTime, getNextPrayer } from '../utils/prayerTimeUtils';
import { format } from 'date-fns';
import ExploreIcon from '@mui/icons-material/Explore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

interface PrayerTimesDisplayProps {
  prayerTimes: PrayerTimes;
  qiblaDirection: number;
}

const PrayerTimesDisplay: React.FC<PrayerTimesDisplayProps> = ({ prayerTimes, qiblaDirection }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(getNextPrayer(prayerTimes));
  const [timeProgress, setTimeProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setNextPrayer(getNextPrayer(prayerTimes));
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  useEffect(() => {
    if (nextPrayer) {
      const updateProgress = () => {
        const now = new Date().getTime();
        const prayerTime = nextPrayer.time.getTime();
        const previousPrayerTime = Object.values(prayerTimes)
          .filter((time) => time < nextPrayer.time)
          .sort((a, b) => b.getTime() - a.getTime())[0]?.getTime() || now;

        const totalDuration = prayerTime - previousPrayerTime;
        const elapsed = now - previousPrayerTime;
        const progress = (elapsed / totalDuration) * 100;
        setTimeProgress(Math.min(Math.max(progress, 0), 100));
      };

      updateProgress();
      const timer = setInterval(updateProgress, 1000);
      return () => clearInterval(timer);
    }
  }, [nextPrayer, prayerTimes]);

  const prayerCards = [
    { name: 'Fajr', time: prayerTimes.fajr },
    { name: 'Sunrise', time: prayerTimes.sunrise },
    { name: 'Dhuhr', time: prayerTimes.dhuhr },
    { name: 'Asr', time: prayerTimes.asr },
    { name: 'Maghrib', time: prayerTimes.maghrib },
    { name: 'Isha', time: prayerTimes.isha },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      {/* Next Prayer Card */}
      {nextPrayer && (
        <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Next Prayer: {nextPrayer.name}</Typography>
                <Typography variant="h4">{formatPrayerTime(nextPrayer.time)}</Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={timeProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'white',
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Tooltip title="Current Time">
                    <Box sx={{ textAlign: 'center' }}>
                      <IconButton color="inherit">
                        <AccessTimeIcon />
                      </IconButton>
                      <Typography variant="body2">
                        {format(currentTime, 'HH:mm:ss')}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Qibla Direction">
                    <Box sx={{ textAlign: 'center' }}>
                      <IconButton color="inherit">
                        <ExploreIcon sx={{ transform: `rotate(${qiblaDirection}deg)` }} />
                      </IconButton>
                      <Typography variant="body2">
                        {Math.round(qiblaDirection)}°
                      </Typography>
                    </Box>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Prayer Times Grid */}
      <Grid container spacing={2}>
        {prayerCards.map(({ name, time }) => {
          const isPast = time < currentTime;
          const isNext = nextPrayer?.name === name;

          return (
            <Grid item xs={12} sm={6} md={4} key={name}>
              <Card
                sx={{
                  bgcolor: isNext
                    ? 'primary.light'
                    : isPast
                    ? 'action.disabledBackground'
                    : 'background.paper',
                }}
              >
                <CardContent>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={8}>
                      <Typography
                        variant="h6"
                        color={isNext ? 'primary.contrastText' : 'textPrimary'}
                      >
                        {name}
                      </Typography>
                      <Typography
                        variant="h5"
                        color={isNext ? 'primary.contrastText' : 'textPrimary'}
                      >
                        {formatPrayerTime(time)}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      {isNext && (
                        <NotificationsActiveIcon
                          sx={{ color: 'primary.contrastText', fontSize: 30 }}
                        />
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
  );
};

export default PrayerTimesDisplay;
