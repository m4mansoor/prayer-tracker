import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { PrayerHistory } from '../types';

interface PrayerHistoryComponentProps {
  prayerHistory: PrayerHistory;
  onClose: () => void;
}

const PrayerHistoryComponent: React.FC<PrayerHistoryComponentProps> = ({
  prayerHistory,
  onClose,
}) => {
  const sortedDates = Object.keys(prayerHistory).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Prayer History</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Prayer</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedDates.map(date => (
                prayerHistory[date].prayers.map((prayer, index) => (
                  <TableRow key={`${date}-${prayer.name}`}>
                    {index === 0 && (
                      <TableCell 
                        rowSpan={prayerHistory[date].prayers.length}
                        sx={{ 
                          borderRight: '1px solid rgba(224, 224, 224, 1)',
                          backgroundColor: 'background.default'
                        }}
                      >
                        {new Date(date).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell>{prayer.name}</TableCell>
                    <TableCell align="center">
                      {prayer.completed ? (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          <SentimentSatisfiedAltIcon color="success" />
                          <Typography color="success.main">Completed</Typography>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          <SentimentVeryDissatisfiedIcon color="error" />
                          <Typography color="error.main">Missed</Typography>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default PrayerHistoryComponent;
