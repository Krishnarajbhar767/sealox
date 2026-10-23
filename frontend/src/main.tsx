import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'sealox-green',
  colors: {
    'sealox-green': [
      '#eef8f0', // 0
      '#d3eed9', // 1
      '#b8e3c1', // 2
      '#9dd9aa', // 3
      '#82ce92', // 4
      '#50B861', // 5 (primary)
      '#439951', // 6
      '#357a41', // 7
      '#285c31', // 8
      '#155C48', // 9 (dark)
    ] as const,
  },
  breakpoints: {
    xs: '30em', // 480px
    sm: '37.5em', // 600px
    md: '48em', // 768px
    lg: '64em', // 1024px
    xl: '80em', // 1280px
  },
  fontFamily:
    "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  defaultRadius: 'sm',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme="light">
        <Notifications position="top-right" zIndex={2000} autoClose={4000} />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
