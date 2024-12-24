import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

const ContactPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Navigation onSectionClick={() => {}} />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" color="primary" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Get in touch with the developer
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
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Inaamul Haq Mansoor
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Full Stack Developer & UI/UX Designer
            </Typography>
            <Typography variant="body1" paragraph>
              Feel free to reach out through any of the following channels:
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <IconButton
                href="https://facebook.com/developer"
                target="_blank"
                color="primary"
                sx={{ mr: 2 }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com/developer"
                target="_blank"
                color="primary"
                sx={{ mr: 2 }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://youtube.com/developer"
                target="_blank"
                color="primary"
                sx={{ mr: 2 }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                href="https://wa.me/developernumber"
                target="_blank"
                color="primary"
                sx={{ mr: 2 }}
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                href="mailto:developer@email.com"
                color="primary"
                sx={{ mr: 2 }}
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
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactPage;
