import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { AdminLoginPage } from '../../features/admin/auth/AdminLoginPage';
import * as adminApi from '../../api/adminApi';

vi.mock('../../api/adminApi', () => ({
  loginAdminApi: vi.fn(),
}));

describe('AdminLoginPage Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with username and password fields', () => {
    renderWithProviders(<AdminLoginPage />);

    expect(screen.getByText('SEALOX ADMIN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('admin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your administrator password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Admin Console/i })).toBeInTheDocument();
  });

  it('submits credentials and handles successful login', async () => {
    const user = userEvent.setup();
    vi.mocked(adminApi.loginAdminApi).mockResolvedValue({
      success: true,
      token: 'mock-signed-token',
      user: { id: 1, username: 'admin', email: 'salessealox@gmail.com' },
    });

    renderWithProviders(<AdminLoginPage />);

    await user.type(screen.getByPlaceholderText('admin'), 'admin');
    await user.type(screen.getByPlaceholderText(/Your administrator password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Sign In to Admin Console/i }));

    await waitFor(() => {
      expect(adminApi.loginAdminApi).toHaveBeenCalledWith('admin', 'password123');
    });
  });

  it('shows error banner when login credentials fail', async () => {
    const user = userEvent.setup();
    vi.mocked(adminApi.loginAdminApi).mockRejectedValue(new Error('Invalid username or password.'));

    renderWithProviders(<AdminLoginPage />);

    await user.type(screen.getByPlaceholderText('admin'), 'admin');
    await user.type(screen.getByPlaceholderText(/Your administrator password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /Sign In to Admin Console/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });
  });
});
