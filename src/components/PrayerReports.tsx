import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { PrayerHistory, PrayerReport } from '../types';

interface PrayerReportsProps {
  prayerHistory: PrayerHistory;
}

type DateRange = 'daily' | 'weekly' | 'monthly' | 'custom';

const PrayerReports: React.FC<PrayerReportsProps> = ({ prayerHistory }) => {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>('daily');
  const [customRange, setCustomRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  const generateReport = (startDate: Date, endDate: Date): PrayerReport => {
    const report: PrayerReport = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalPrayers: 0,
      completedPrayers: 0,
      missedPrayers: 0,
      totalFine: 0,
      completionRate: 0,
      prayerBreakdown: {},
      dailyStats: {},
    };

    Object.entries(prayerHistory).forEach(([date, dayData]) => {
      const currentDate = new Date(date);
      if (currentDate >= startDate && currentDate <= endDate) {
        const dailyStats = {
          completed: 0,
          total: dayData.prayers.length,
          fine: 0,
        };

        dayData.prayers.forEach((prayer) => {
          report.totalPrayers++;
          if (prayer.completed) {
            report.completedPrayers++;
            dailyStats.completed++;
          } else {
            report.missedPrayers++;
            const fine = 10; // Default fine amount
            report.totalFine += fine;
            dailyStats.fine += fine;
          }

          // Update prayer breakdown
          if (!report.prayerBreakdown[prayer.name]) {
            report.prayerBreakdown[prayer.name] = {
              total: 0,
              completed: 0,
              completionRate: 0,
              totalFine: 0,
            };
          }
          report.prayerBreakdown[prayer.name].total++;
          if (prayer.completed) {
            report.prayerBreakdown[prayer.name].completed++;
          } else {
            report.prayerBreakdown[prayer.name].totalFine += 10;
          }
          report.prayerBreakdown[prayer.name].completionRate =
            (report.prayerBreakdown[prayer.name].completed /
              report.prayerBreakdown[prayer.name].total) *
            100;
        });

        report.dailyStats[date] = dailyStats;
      }
    });

    report.completionRate =
      report.totalPrayers > 0
        ? (report.completedPrayers / report.totalPrayers) * 100
        : 0;

    return report;
  };

  const getDateRange = (): { start: Date; end: Date } => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);

    switch (dateRange) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'weekly':
        start.setDate(end.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'custom':
        return {
          start: new Date(customRange.start),
          end: new Date(customRange.end),
        };
    }

    return { start, end };
  };

  const report = useMemo(() => {
    const { start, end } = getDateRange();
    return generateReport(start, end);
  }, [prayerHistory, dateRange, customRange]);

  const chartData = useMemo(() => {
    return Object.entries(report.prayerBreakdown).map(([name, stats]) => ({
      name,
      completed: stats.completed,
      missed: stats.total - stats.completed,
      fine: stats.totalFine,
    }));
  }, [report]);

  return (
    <Box sx={{ mt: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )}, ${alpha(theme.palette.secondary.main, 0.1)})`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5" fontWeight="bold" color="primary">
            Prayer Reports
          </Typography>
          <Box display="flex" gap={2} alignItems="center">
            <ToggleButtonGroup
              value={dateRange}
              exclusive
              onChange={(_, value) => value && setDateRange(value)}
              size="small"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              onClick={() => setShowCustomRange(true)}
              color={dateRange === 'custom' ? 'primary' : 'default'}
            >
              <DateRangeIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Completion Rate
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.dark">
                  {report.completionRate.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                background: alpha(theme.palette.success.main, 0.1),
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Completed
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.dark">
                  {report.completedPrayers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                background: alpha(theme.palette.error.main, 0.1),
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="error.main" gutterBottom>
                  Missed
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.dark">
                  {report.missedPrayers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card
              sx={{
                background: alpha(theme.palette.warning.main, 0.1),
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="warning.main" gutterBottom>
                  Total Fine
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.dark">
                  Rs. {report.totalFine}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ height: 300, mb: 4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="completed"
                stackId="a"
                fill={theme.palette.success.main}
                name="Completed"
              />
              <Bar
                dataKey="missed"
                stackId="a"
                fill={theme.palette.error.main}
                name="Missed"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Dialog open={showCustomRange} onClose={() => setShowCustomRange(false)}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={customRange.start}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, start: e.target.value }))
              }
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={customRange.end}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, end: e.target.value }))
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomRange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setDateRange('custom');
              setShowCustomRange(false);
            }}
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrayerReports;
