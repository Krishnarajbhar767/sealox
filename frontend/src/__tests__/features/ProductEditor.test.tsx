import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { ProductEditor } from '../../features/admin/ProductEditor';
import * as adminApi from '../../api/adminApi';

vi.mock('../../api/adminApi', () => ({
  fetchAdminProductDetail: vi.fn(),
  createAdminProductRecord: vi.fn(),
  updateAdminProductRecord: vi.fn(),
  uploadAdminProductImage: vi.fn(),
}));

describe('ProductEditor Feature Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product creation layout with initial presets and action buttons', () => {
    renderWithProviders(<ProductEditor />, { initialEntries: ['/admin/products/new'] });

    expect(screen.getByText('Add New Mechanical Seal')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Product Name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /URL Slug/i })).toBeInTheDocument();
    expect(screen.getByText('Operating Limits & Parameters')).toBeInTheDocument();
    expect(screen.getByText('Face Materials & Stationary Seats')).toBeInTheDocument();
    expect(screen.getByText('Numbered Assembly Callouts')).toBeInTheDocument();
  });

  it('shows required field errors when attempting to submit with blank name', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductEditor />, { initialEntries: ['/admin/products/new'] });

    const publishButton = screen.getAllByRole('button', { name: /Publish Product/i })[0];
    await user.click(publishButton);

    expect(await screen.findByText('Product Name is required.')).toBeInTheDocument();
    expect(screen.getByText('URL Slug is required.')).toBeInTheDocument();
    expect(
      screen.getByText('Please fill in all required fields.'),
    ).toBeInTheDocument();
  });

  it('opens discard confirmation modal when navigating away with unsaved changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductEditor />, { initialEntries: ['/admin/products/new'] });

    const nameInput = screen.getByRole('textbox', { name: /Product Name/i });
    await user.type(nameInput, 'SEALOX-NEW-MODEL');

    // Click Cancel
    const cancelButton = screen.getByRole('button', { name: /^Cancel$/i });
    await user.click(cancelButton);

    // Modal appears
    expect(await screen.findByText('Discard Unsaved Changes?')).toBeInTheDocument();
    expect(
      screen.getByText(/You have unsaved changes in this mechanical seal specification/i),
    ).toBeInTheDocument();

    // Click Keep Editing
    const keepEditingButton = await screen.findByRole('button', { name: /Keep Editing/i });
    await user.click(keepEditingButton);

    await waitFor(() => {
      expect(screen.queryByText('Discard Unsaved Changes?')).not.toBeInTheDocument();
    });
  });

  it('submits pure JSON payload and navigates on successful creation', async () => {
    const user = userEvent.setup();
    vi.mocked(adminApi.createAdminProductRecord).mockResolvedValue({
      id: 101,
      slug: 'sealox-bellows-pro',
      name: 'SEALOX BELLOWS PRO',
      category: 'Single Spring Seals',
      subtitle: 'Pro seal',
      description: 'Desc',
      static_image_path: '',
      primaryImageUrl: '/hero_image.png',
      operating_limits: [],
      face_materials: [],
      secondary_seal_materials: [],
      metal_parts: [],
      seal_components: [],
      applications: [],
      custom_spec_groups: [],
      is_active: true,
      order: 0,
      galleryImages: [],
    });

    renderWithProviders(<ProductEditor />, { initialEntries: ['/admin/products/new'] });

    const nameInput = screen.getByRole('textbox', { name: /Product Name/i });
    await user.type(nameInput, 'SEALOX BELLOWS PRO');

    const publishButton = screen.getAllByRole('button', { name: /Publish Product/i })[0];
    await user.click(publishButton);

    await waitFor(() => {
      expect(adminApi.createAdminProductRecord).toHaveBeenCalledTimes(1);
    });

    const callPayload = vi.mocked(adminApi.createAdminProductRecord).mock.calls[0][0];
    expect(callPayload.name).toBe('SEALOX BELLOWS PRO');
    expect(callPayload.slug).toBe('sealox-bellows-pro');
  });
});
