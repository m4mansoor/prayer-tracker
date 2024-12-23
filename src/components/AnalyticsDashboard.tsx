import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { PrayerHistory, PrayerStats } from '../types';
import {
  getTrendData,
  getPrayerDistribution,
  getTimeDistribution,
  getWeeklyStats,
} from '../utils/analyticsUtils';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface AnalyticsDashboardProps {
  history: PrayerHistory;
  stats: PrayerStats;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ history, stats }) => {
  const theme = useTheme();
  const trendData = getTrendData(history);
  const prayerDistribution = getPrayerDistribution(history);
  const timeDistribution = getTimeDistribution(history);
  const weeklyStats = getWeeklyStats(history);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
        <AssessmentIcon sx={{ mr: 1 }} /> Prayer Analytics
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(1)}%`}
            icon={<TrendingUpIcon color="primary" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Streak"
            value={`${stats.streakData.currentStreak} days`}
            icon={<WhatshotIcon sx={{ color: 'error.main' }} />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Average Delay"
            value={`${stats.timeAnalysis.averageDelay.toFixed(0)} min`}
            icon={<AccessTimeIcon color="warning" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Best Day"
            value={stats.timeAnalysis.bestPerformingDay}
            icon={<AssessmentIcon color="success" />}
            color="success.main"
          />
        </Grid>
      </Grid>

      {/* Trends and Distribution */}
      <Grid container spacing={3}>
        {/* Completion Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Prayer Completion Trend
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveLine
                data={[
                  {
                    id: 'completion',
                    data: trendData.map(d => ({
                      x: d.date,
                      y: d.completionRate,
                    })),
                  },
                ]}
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0, max: 100 }}
                curve="monotoneX"
                axisBottom={{
                  tickRotation: -45,
                  format: (value) => value.split('-').slice(1).join('/'),
                }}
                axisLeft={{
                  tickValues: [0, 25, 50, 75, 100],
                  format: v => `${v}%`,
                }}
                enablePoints={false}
                enableArea={true}
                areaOpacity={0.1}
                colors={[theme.palette.primary.main]}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: theme.palette.text.secondary,
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: theme.palette.divider,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Prayer Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Prayer Distribution
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsivePie
                data={prayerDistribution.map(d => ({
                  id: d.name,
                  label: d.name,
                  value: d.completed,
                }))}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: 'nivo' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor={theme.palette.text.primary}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                theme={{
                  labels: {
                    text: {
                      fill: theme.palette.text.primary,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Time Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Prayer Time Distribution
            </Typography>
            <Box sx={{ height: 350 }}>
              <ResponsiveLine
                data={[
                  {
                    id: 'time',
                    data: timeDistribution.map(d => ({
                      x: d.hour,
                      y: d.count,
                    })),
                  },
                ]}
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 0 }}
                curve="monotoneX"
                axisBottom={{
                  tickRotation: -45,
                }}
                enablePoints={true}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={true}
                areaOpacity={0.1}
                colors={[theme.palette.secondary.main]}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: theme.palette.text.secondary,
                      },
                    },
                  },
                  grid: {
                    line: {
                      stroke: theme.palette.divider,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;
