import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EditIcon from '@mui/icons-material/Edit';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { PrayerHistory, FilterOptions, PrayerStats, Prayer } from '../types';
import { filterPrayerHistory, getDateRangeForFilter, formatDate } from '../utils/prayerUtils';

interface PrayerHistoryProps {
  history: PrayerHistory;
  onUpdatePrayer: (date: string, prayerName: string, completed: boolean) => void;
}

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  prayer: Prayer;
  date: string;
  onUpdate: (completed: boolean) => void;
}

const EditPrayerDialog: React.FC<EditDialogProps> = ({ open, onClose, prayer, date, onUpdate }) => {
  const [isCompleted, setIsCompleted] = useState(prayer.completed);

  const handleSave = () => {
    onUpdate(isCompleted);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: 'primary.main' }}>
        Edit Prayer Status
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {prayer.name}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Date: {new Date(date).toLocaleDateString()}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Time: {prayer.startTime} - {prayer.endTime}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <Typography>Mark as Completed</Typography>
            <Switch
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              color="success"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PrayerHistoryComponent: React.FC<PrayerHistoryProps> = ({ history, onUpdatePrayer }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
    const defaultRange = getDateRangeForFilter('day');
    return {
      dateRange: defaultRange,
      filterType: 'day',
      showCompleted: true,
      showMissed: true,
    };
  });

  const [filteredHistory, setFilteredHistory] = useState<PrayerHistory>(history);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<{ prayer: Prayer; date: string } | null>(null);

  useEffect(() => {
    const filtered = filterPrayerHistory(history, filterOptions);
    setFilteredHistory(filtered);
  }, [history, filterOptions]);

  const calculateTotalStats = (): PrayerStats => {
    let totalPrayers = 0;
    let completedPrayers = 0;
    let totalFine = 0;

    Object.values(filteredHistory).forEach(day => {
      totalPrayers += day.prayers.length;
      completedPrayers += day.totalCompleted;
      totalFine += day.totalFine;
    });

    const missedPrayers = totalPrayers - completedPrayers;
    const completionRate = totalPrayers > 0 ? (completedPrayers / totalPrayers) * 100 : 0;

    return {
      totalPrayers,
      completedPrayers,
      missedPrayers,
      totalFine,
      completionRate,
    };
  };

  const handleEditPrayer = (prayer: Prayer, date: string) => {
    setSelectedPrayer({ prayer, date });
    setEditDialogOpen(true);
  };

  const handleUpdatePrayer = (completed: boolean) => {
    if (selectedPrayer) {
      onUpdatePrayer(selectedPrayer.date, selectedPrayer.prayer.name, completed);
    }
  };

  const stats = calculateTotalStats();

  const handleFilterTypeChange = (type: FilterOptions['filterType']) => {
    const dateRange = getDateRangeForFilter(type);
    setFilterOptions(prev => ({
      ...prev,
      filterType: type,
      dateRange,
    }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
        Prayer History & Reports
      </Typography>

      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={filterOptions.filterType}
                label="Time Period"
                onChange={(e) => handleFilterTypeChange(e.target.value as FilterOptions['filterType'])}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {filterOptions.filterType === 'custom' && (
            <>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="Start Date"
                  value={new Date(filterOptions.dateRange.startDate)}
                  onChange={(newDate) => {
                    if (newDate) {
                      setFilterOptions(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          startDate: formatDate(newDate),
                        },
                      }));
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <DatePicker
                  label="End Date"
                  value={new Date(filterOptions.dateRange.endDate)}
                  onChange={(newDate) => {
                    if (newDate) {
                      setFilterOptions(prev => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRange,
                          endDate: formatDate(newDate),
                        },
                      }));
                    }
                  }}
                  sx={{ width: '100%' }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.showCompleted}
                  onChange={(e) =>
                    setFilterOptions(prev => ({
                      ...prev,
                      showCompleted: e.target.checked,
                    }))
                  }
                />
              }
              label="Show Completed"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterOptions.showMissed}
                  onChange={(e) =>
                    setFilterOptions(prev => ({
                      ...prev,
                      showMissed: e.target.checked,
                    }))
                  }
                />
              }
              label="Show Missed"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Prayers
              </Typography>
              <Typography variant="h4">{stats.totalPrayers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.completedPrayers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Missed
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.missedPrayers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fine
              </Typography>
              <Typography variant="h4" color="error.main">
                ${stats.totalFine}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Prayer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Fine Amount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(filteredHistory).map(([date, dayData]) =>
              dayData.prayers.map((prayer, index) => (
                <TableRow key={`${date}-${prayer.name}`}>
                  {index === 0 && (
                    <TableCell rowSpan={dayData.prayers.length}>
                      {new Date(date).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell>
                    {prayer.name}
                    <IconButton
                      size="small"
                      onClick={() => handleEditPrayer(prayer, date)}
                      sx={{ ml: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ ml: 1 }}>
                      {prayer.completed ? (
                        <SentimentSatisfiedAltIcon
                          fontSize="small"
                          sx={{ color: 'success.main' }}
                        />
                      ) : (
                        <SentimentVeryDissatisfiedIcon
                          fontSize="small"
                          sx={{ color: 'error.main' }}
                        />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={prayer.completed ? 'success.main' : 'error.main'}
                    >
                      {prayer.completed ? 'Completed' : 'Missed'}
                    </Typography>
                  </TableCell>
                  <TableCell>${prayer.completed ? 0 : prayer.fineAmount}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleEditPrayer(prayer, date)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Prayer Dialog */}
      {selectedPrayer && (
        <EditPrayerDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedPrayer(null);
          }}
          prayer={selectedPrayer.prayer}
          date={selectedPrayer.date}
          onUpdate={handleUpdatePrayer}
        />
      )}
    </Box>
  );
};

export default PrayerHistoryComponent;
