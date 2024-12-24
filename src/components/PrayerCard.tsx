import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format, addMinutes, isWithinInterval, parseISO } from 'date-fns';

interface PrayerCardProps {
  name: string;
  completed: boolean;
  startTime: string;
  endTime: string;
  onStatusChange: (completed: boolean, reason: string) => void;
  onTimeChange: (startTime: string, endTime: string) => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({
  name,
  completed,
  startTime,
  endTime,
  onStatusChange,
  onTimeChange,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedStatus, setEditedStatus] = useState(completed);
  const [editedReason, setEditedReason] = useState('');
  const [editedStartTime, setEditedStartTime] = useState(startTime);
  const [editedEndTime, setEditedEndTime] = useState(endTime);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkAndNotify = () => {
      const now = new Date();
      const start = parseISO(startTime);
      const end = parseISO(endTime);
      const notifyStartTime = addMinutes(start, -15);
      const notifyEndTime = addMinutes(end, -15);

      // Check if current time is within 1 minute of notification times
      const shouldNotifyStart = isWithinInterval(now, {
        start: addMinutes(notifyStartTime, -1),
        end: addMinutes(notifyStartTime, 1),
      });

      const shouldNotifyEnd = isWithinInterval(now, {
        start: addMinutes(notifyEndTime, -1),
        end: addMinutes(notifyEndTime, 1),
      });

      if (shouldNotifyStart) {
        new Notification(`${name} Prayer Reminder`, {
          body: `${name} prayer will start in 15 minutes at ${format(start, 'hh:mm a')}`,
          icon: '/logo192.png',
        });
      }

      if (shouldNotifyEnd) {
        new Notification(`${name} Prayer Reminder`, {
          body: `${name} prayer will end in 15 minutes at ${format(end, 'hh:mm a')}`,
          icon: '/logo192.png',
        });
      }
    };

    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    // Check every minute
    const interval = setInterval(checkAndNotify, 60000);
    return () => clearInterval(interval);
  }, [name, startTime, endTime, notificationsEnabled]);

  const handleSave = () => {
    onStatusChange(editedStatus, editedReason);
    onTimeChange(editedStartTime, editedEndTime);
    setIsEditDialogOpen(false);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(parseISO(startTime), 'hh:mm a')} - {format(parseISO(endTime), 'hh:mm a')}
            </Typography>
          </Box>
          <Box>
            <IconButton 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              color={notificationsEnabled ? "primary" : "default"}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={() => setIsEditDialogOpen(true)}>
              <EditIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit {name} Prayer</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              value={editedStartTime}
              onChange={(e) => setEditedStartTime(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              value={editedEndTime}
              onChange={(e) => setEditedEndTime(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.checked)}
                />
              }
              label="Completed"
            />
            {!editedStatus && (
              <TextField
                label="Reason"
                multiline
                rows={3}
                value={editedReason}
                onChange={(e) => setEditedReason(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PrayerCard;
