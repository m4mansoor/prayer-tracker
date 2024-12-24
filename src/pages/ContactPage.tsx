import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  alpha,
  Snackbar,
  Alert,
} from '@mui/material';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box>
      <Navigation onSectionClick={() => {}} />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" color="primary" gutterBottom align="center">
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
          Get in touch with us
        </Typography>

        <Card
          sx={{
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.light,
              0.1
            )}, ${alpha(theme.palette.primary.main, 0.05)})`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
        >
          Message sent successfully!
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ContactPage;
