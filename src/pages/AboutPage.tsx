import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Navigation onSectionClick={() => {}} />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" color="primary" gutterBottom align="center">
          About
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Your Personal Prayer Accountability Partner
        </Typography>

        <Box sx={{ mb: 8 }}>
          <Typography variant="body1" paragraph>
            Qunoot Prayer Tracker is a comprehensive Progressive Web App designed to help
            Muslims maintain their daily prayer schedule. Our platform combines prayer
            tracking with accountability features, making it easier for users to stay
            consistent with their prayers.
          </Typography>
          <Typography variant="body1" paragraph>
            The app includes features such as prayer time tracking, missed prayer
            notifications, fine management, and detailed prayer history. We believe that
            by providing these tools, we can help our users develop and maintain a
            strong connection with their spiritual obligations.
          </Typography>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Meet the Developer
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
            }}
          >
            <CardContent>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Avatar
                    src="/developer-photo.jpg"
                    alt="Inaamul Haq Mansoor"
                    sx={{
                      width: 200,
                      height: 200,
                      mx: 'auto',
                      border: `4px solid ${theme.palette.primary.main}`,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    Inaamul Haq Mansoor
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Full Stack Developer & UI/UX Designer
                  </Typography>
                  <Typography variant="body1" paragraph>
                    With a passion for creating meaningful applications that serve the
                    Muslim community, Inaamul has developed Qunoot Prayer Tracker to help
                    Muslims worldwide maintain their prayer schedules effectively.
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <IconButton
                      href="https://facebook.com/developer"
                      target="_blank"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <FacebookIcon />
                    </IconButton>
                    <IconButton
                      href="https://twitter.com/developer"
                      target="_blank"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <TwitterIcon />
                    </IconButton>
                    <IconButton
                      href="https://youtube.com/developer"
                      target="_blank"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <YouTubeIcon />
                    </IconButton>
                    <IconButton
                      href="https://wa.me/developernumber"
                      target="_blank"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                    <IconButton
                      href="mailto:developer@email.com"
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      <EmailIcon />
                    </IconButton>
                    <IconButton
                      href="https://developer-website.com"
                      target="_blank"
                      color="primary"
                    >
                      <LanguageIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph align="center">
            To provide Muslims with an effective tool for maintaining their prayer
            schedule and building a stronger connection with their faith through
            consistent prayer habits.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default AboutPage;
