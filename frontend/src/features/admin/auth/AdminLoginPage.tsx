import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Alert,
  Stack,
  ThemeIcon,
  Group,
  Anchor,
  Box,
} from '@mantine/core';
import {
  IconLock,
  IconUser,
  IconShieldLock,
  IconAlertCircle,
  IconArrowLeft,
} from '@tabler/icons-react';
import { loginAdminApi } from '../../../api/adminApi';
import { setAdminSession } from './authStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Where to redirect after login (default /admin)
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please provide both User ID / Username and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginAdminApi(username.trim(), password);
      setAdminSession(response.token, response.user);
      navigate(fromLocation, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to sign in. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Container size={440} className="w-full">
        {/* Header Branding */}
        <Stack align="center" gap="xs" mb="xl">
          <ThemeIcon
            size={52}
            radius="md"
            color="teal.8"
            variant="filled"
            className="shadow-lg shadow-teal-900/30"
          >
            <IconShieldLock size={30} stroke={1.8} />
          </ThemeIcon>

          <Title order={2} c="white" fw={800} lts="0.05em" ta="center">
            SEALOX ADMIN
          </Title>
          <Text c="slate.4" size="sm" ta="center">
            Industrial Mechanical Seals Catalog Management
          </Text>
        </Stack>

        {/* Login Card */}
        <Paper
          withBorder
          radius="lg"
          p="xl"
          bg="#0f172a"
          className="border-slate-800 shadow-2xl"
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Text size="xs" fw={700} tt="uppercase" lts="0.08em" c="teal.4">
                Administrator Authentication
              </Text>

              {errorMessage && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="red"
                  radius="md"
                  variant="light"
                  title="Authentication Failed"
                >
                  {errorMessage}
                </Alert>
              )}

              <TextInput
                label="User ID / Username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
                autoFocus
                leftSection={<IconUser size={16} className="text-slate-400" />}
                styles={{
                  label: { color: '#cbd5e1', fontSize: 13, marginBottom: 4, fontWeight: 500 },
                  input: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f8fafc',
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your administrator password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                leftSection={<IconLock size={16} className="text-slate-400" />}
                styles={{
                  label: { color: '#cbd5e1', fontSize: 13, marginBottom: 4, fontWeight: 500 },
                  input: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#f8fafc',
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                color="teal"
                size="md"
                mt="xs"
                className="bg-emerald-600 hover:bg-emerald-700 font-semibold tracking-wide"
              >
                Sign In to Admin Console
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Back Link */}
        <Group justify="center" mt="xl">
          <Anchor
            component={Link}
            to="/"
            size="xs"
            c="slate.5"
            className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors no-underline"
          >
            <IconArrowLeft size={14} />
            Return to Storefront
          </Anchor>
        </Group>
      </Container>
    </Box>
  );
};
