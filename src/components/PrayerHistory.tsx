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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Switch,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import { Prayer, PrayerHistory } from '../types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import PrayerCard from './PrayerCard';

interface PrayerHistoryProps {
  prayerHistory: PrayerHistory;
  onClose: () => void;
}

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom';

interface EditDialogState {
  open: boolean;
  date: string;
  prayer: Prayer | null;
  reason: string;
}

const PrayerHistoryComponent: React.FC<PrayerHistoryProps> = ({
  prayerHistory,
  onClose,
}) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  });
  const [editingPrayer, setEditingPrayer] = useState<{
    date: string;
    name: string;
    completed: boolean;
    reason: string;
    startTime: string;
    endTime: string;
  } | null>(null);

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

  const togglePrayerStatus = (date: string, prayerName: string, reason?: string) => {
    const prayers = prayerHistory[date]?.prayers || [];
    const updatedPrayers = prayers.map((prayer) =>
      prayer.name === prayerName
        ? { 
            ...prayer, 
            completed: !prayer.completed,
            reason: reason || prayer.reason
          }
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
    window.location.reload();
  };

  const handlePrayerEdit = (date: string, name: string, completed: boolean, reason: string, startTime: string, endTime: string) => {
    const prayers = prayerHistory[date]?.prayers || [];
    const updatedPrayers = prayers.map((prayer) =>
      prayer.name === name
        ? { 
            ...prayer, 
            completed,
            reason,
            startTime,
            endTime
          }
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
    window.location.reload();
  };

  const handleStatusChange = (prayer: any, completed: boolean) => {
    if (!completed) {
      setEditingPrayer(prayer);
    } else {
      togglePrayerStatus(prayer.date, prayer.name);
    }
  };

  const handleTimeEdit = (prayer: any) => {
    setEditingPrayer(prayer);
  };

  const handleDialogClose = () => {
    setEditingPrayer(null);
  };

  const handleSaveReason = () => {
    if (editingPrayer) {
      togglePrayerStatus(editingPrayer.date, editingPrayer.name, editingPrayer.reason);
    }
    handleDialogClose();
  };

  const handleSaveTime = () => {
    if (editingPrayer) {
      handlePrayerEdit(
        editingPrayer.date,
        editingPrayer.name,
        editingPrayer.completed,
        editingPrayer.reason,
        editingPrayer.startTime,
        editingPrayer.endTime
      );
    }
    handleDialogClose();
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={prayer.completed}
                                onChange={(e) => handleStatusChange({ date, ...prayer }, e.target.checked)}
                                color="success"
                              />
                            }
                            label={prayer.name}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleTimeEdit({ date, ...prayer })}
                            sx={{ ml: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {!prayer.completed && prayer.reason && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2, display: 'block' }}>
                              Reason: {prayer.reason}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Reason Dialog */}
      <Dialog open={!!editingPrayer && !editingPrayer.completed} onClose={handleDialogClose}>
        <DialogTitle>Why did you miss {editingPrayer?.name}?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            fullWidth
            variant="outlined"
            value={editingPrayer?.reason || ''}
            onChange={(e) => setEditingPrayer((prev) => ({ ...prev, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveReason} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Time Edit Dialog */}
      <Dialog open={!!editingPrayer && editingPrayer.completed} onClose={handleDialogClose}>
        <DialogTitle>Edit Prayer Time</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={editingPrayer?.startTime || ''}
              onChange={(e) =>
                setEditingPrayer(
                  (prev) => prev && { ...prev, startTime: e.target.value }
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Time"
              type="time"
              value={editingPrayer?.endTime || ''}
              onChange={(e) =>
                setEditingPrayer(
                  (prev) => prev && { ...prev, endTime: e.target.value }
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveTime} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrayerHistoryComponent;
