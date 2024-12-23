import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PrayerSettings, Coordinates } from '../types';
import { getCurrentLocation } from '../utils/prayerTimeUtils';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface PrayerTimeSettingsProps {
  settings: PrayerSettings;
  onSettingsChange: (settings: PrayerSettings) => void;
  onNotificationSettingsChange: (enabled: boolean, time: number) => void;
  notificationsEnabled: boolean;
  notificationTime: number;
}

const PrayerTimeSettings: React.FC<PrayerTimeSettingsProps> = ({
  settings,
  onSettingsChange,
  onNotificationSettingsChange,
  notificationsEnabled,
  notificationTime,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationDetection = async () => {
    setLoading(true);
    setError(null);
    try {
      const coordinates = await getCurrentLocation();
      onSettingsChange({
        ...settings,
        location: coordinates,
      });
    } catch (err) {
      setError('Failed to detect location. Please enter coordinates manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (method: string) => {
    onSettingsChange({
      ...settings,
      calculationMethod: method,
    });
  };

  const handleCoordinateChange = (type: 'latitude' | 'longitude', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onSettingsChange({
        ...settings,
        location: {
          ...settings.location,
          [type]: numValue,
        },
      });
    }
  };

  const handleAdjustmentChange = (prayer: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onSettingsChange({
        ...settings,
        adjustments: {
          ...settings.adjustments,
          [prayer]: numValue,
        },
      });
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Prayer Time Settings
        </Typography>

        <Grid container spacing={3}>
          {/* Location Settings */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1 }} /> Location
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLocationDetection}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Detect Location
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={settings.location.latitude}
                  onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={settings.location.longitude}
                  onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Calculation Method */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Calculation Method</InputLabel>
              <Select
                value={settings.calculationMethod}
                label="Calculation Method"
                onChange={(e) => handleMethodChange(e.target.value)}
              >
                <MenuItem value="MuslimWorldLeague">Muslim World League</MenuItem>
                <MenuItem value="Egyptian">Egyptian</MenuItem>
                <MenuItem value="Karachi">Karachi</MenuItem>
                <MenuItem value="UmmAlQura">Umm Al-Qura</MenuItem>
                <MenuItem value="Dubai">Dubai</MenuItem>
                <MenuItem value="MoonsightingCommittee">Moonsighting Committee</MenuItem>
                <MenuItem value="NorthAmerica">North America</MenuItem>
                <MenuItem value="Kuwait">Kuwait</MenuItem>
                <MenuItem value="Qatar">Qatar</MenuItem>
                <MenuItem value="Singapore">Singapore</MenuItem>
                <MenuItem value="Turkey">Turkey</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NotificationsIcon />
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={(e) => onNotificationSettingsChange(e.target.checked, notificationTime)}
                  />
                }
                label="Enable Notifications"
              />
            </Box>
            {notificationsEnabled && (
              <TextField
                fullWidth
                type="number"
                label="Notification Time (minutes before)"
                value={notificationTime}
                onChange={(e) =>
                  onNotificationSettingsChange(notificationsEnabled, parseInt(e.target.value) || 0)
                }
                sx={{ mt: 2 }}
              />
            )}
          </Grid>

          {/* Time Adjustments */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Time Adjustments (minutes)
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(settings.adjustments).map(([prayer, adjustment]) => (
                <Grid item xs={6} sm={4} md={2} key={prayer}>
                  <TextField
                    fullWidth
                    label={prayer.charAt(0).toUpperCase() + prayer.slice(1)}
                    type="number"
                    value={adjustment}
                    onChange={(e) => handleAdjustmentChange(prayer, e.target.value)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PrayerTimeSettings;
