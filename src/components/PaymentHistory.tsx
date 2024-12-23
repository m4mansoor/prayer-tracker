import React from 'react';
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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { PaymentHistory } from '../types';
import { format } from 'date-fns';

interface PaymentHistoryProps {
  paymentHistory: PaymentHistory;
}

const PaymentHistoryComponent: React.FC<PaymentHistoryProps> = ({ paymentHistory }) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Payment History
      </Typography>

      {/* Payment Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount Paid
              </Typography>
              <Typography variant="h4" color="primary.main">
                ${paymentHistory.totalPaid}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Number of Payments
              </Typography>
              <Typography variant="h4" color="primary.main">
                {paymentHistory.records.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Records Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Payment Date</TableCell>
              <TableCell align="right">Amount Paid</TableCell>
              <TableCell align="right">Remaining Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentHistory.records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{formatDateTime(record.date)}</TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  ${record.amount}
                </TableCell>
                <TableCell align="right" sx={{ color: record.remainingBalance > 0 ? 'error.main' : 'success.main' }}>
                  ${record.remainingBalance}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentHistoryComponent;
