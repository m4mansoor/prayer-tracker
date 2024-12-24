import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

const LegalPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Navigation onSectionClick={() => {}} />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" color="primary" gutterBottom align="center">
          Legal Information
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Terms of Service & Privacy Policy
        </Typography>

        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.light,
              0.1
            )}, ${alpha(theme.palette.primary.main, 0.05)})`,
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Terms of Service
            </Typography>
            <Typography variant="body1" paragraph>
              By using Qunoot Prayer Tracker, you agree to the following terms:
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>The app is provided "as is" without any warranties</li>
                <li>We are not responsible for any missed prayers or incorrect data</li>
                <li>Users are responsible for maintaining their own prayer records</li>
                <li>The fine system is for personal accountability only</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            maxWidth: 800,
            mx: 'auto',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.light,
              0.1
            )}, ${alpha(theme.palette.primary.main, 0.05)})`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Your privacy is important to us. Here's how we handle your data:
            </Typography>
            <Typography variant="body1" component="div">
              <ul>
                <li>All prayer data is stored locally on your device</li>
                <li>We do not collect or store any personal information</li>
                <li>No data is shared with third parties</li>
                <li>You can delete your data at any time by clearing your browser data</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default LegalPage;
