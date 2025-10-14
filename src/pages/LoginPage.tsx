import { useEffect, useState } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(120deg, #146C94, #19A7CE)' }}
    >
      <Card sx={{ minWidth: 360 }}>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1} textAlign="center">
              <Typography variant="h4" fontWeight={700} color="primary">
                KBT Control Panel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('login_title')}
              </Typography>
            </Stack>
            <TextField
              label={t('login_email_label')}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('login_password_label')}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<LoginIcon />}
              disabled={isLoading}
            >
              {isLoading ? t('signing_in') : t('login_button')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
