import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  useTheme,
  alpha,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 8,
        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Qunoot Prayer Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your daily prayers, maintain accountability, and manage fines
              with our comprehensive prayer tracking solution.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact Us
            </Link>
            <Link href="/legal" color="inherit" display="block">
              Legal
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Connect with Developer
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                href="https://facebook.com/developer"
                target="_blank"
                color="primary"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com/developer"
                target="_blank"
                color="primary"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://youtube.com/developer"
                target="_blank"
                color="primary"
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                href="https://wa.me/developernumber"
                target="_blank"
                color="primary"
              >
                <WhatsAppIcon />
              </IconButton>
              <IconButton
                href="mailto:developer@email.com"
                color="primary"
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
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          © {currentYear} Qunoot Prayer Tracker. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
