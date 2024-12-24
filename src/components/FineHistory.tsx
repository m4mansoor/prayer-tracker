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
  const calculateFine = (prayers: Prayer[]) => {
    return prayers.filter(p => !p.completed).length * 10; // 10 rupees per missed prayer
  };

  const totalFine = Object.entries(prayerHistory).reduce((total, [_, prayers]) => {
    return total + calculateFine(prayers);
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

      {Object.entries(prayerHistory)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([date, prayers]) => {
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
    </Box>
  );
};

export default FineHistory;
