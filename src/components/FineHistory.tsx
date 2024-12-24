import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

interface Prayer {
  name: string;
  completed: boolean;
  reason?: string;
  startTime: string;
  endTime: string;
}

interface FineHistoryProps {
  prayerHistory: {[key: string]: Prayer[]};
  onPayFine: (payment: any) => void;
}

const FineHistory: React.FC<FineHistoryProps> = ({ prayerHistory }) => {
  if (!prayerHistory) {
    return (
      <Box>
        <Typography variant="body1" color="text.secondary" align="center">
          No fine history available
        </Typography>
      </Box>
    );
  }

  const calculateFine = (prayers: Prayer[] = []) => {
    return prayers.filter(p => !p.completed).length * 10; // 10 rupees per missed prayer
  };

  const dates = Object.keys(prayerHistory).sort((a, b) => b.localeCompare(a));
  const totalFine = dates.reduce((total, date) => {
    return total + calculateFine(prayerHistory[date]);
  }, 0);

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Fine
          </Typography>
          <Typography variant="h4" color="error">
            ₨{totalFine}
          </Typography>
        </CardContent>
      </Card>

      {dates.map(date => {
        const prayers = prayerHistory[date];
        const dayFine = calculateFine(prayers);
        if (dayFine === 0) return null;

        return (
          <Card key={date} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {new Date(date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" color="error" gutterBottom>
                Fine: ₨{dayFine}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Missed Prayers: {prayers.filter(p => !p.completed).map(p => p.name).join(', ')}
              </Typography>
            </CardContent>
          </Card>
        );
      })}

      {dates.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center">
          No fine history available
        </Typography>
      )}
    </Box>
  );
};

export default FineHistory;
