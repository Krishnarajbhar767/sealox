import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { AdminDashboard } from '../../features/admin/AdminDashboard';
import * as adminApi from '../../api/adminApi';
import type { CatalogProductRecord } from '../../features/admin/types';

vi.mock('../../api/adminApi', () => ({
  fetchAdminCatalogProducts: vi.fn(),
  toggleAdminProductVisibility: vi.fn(),
  duplicateAdminProductTemplate: vi.fn(),
  deleteAdminProductRecord: vi.fn(),
}));

const mockProducts: CatalogProductRecord[] = [
  {
    id: 1,
    slug: 'sl-single-spring-standard',
    name: 'SL-SINGLE SPRING STANDARD',
    category: 'Single Spring Seals',
    subtitle: 'Standard industrial pump seal',
    description: 'High reliability pump seal',
    static_image_path: '/products/seal-1.png',
    primaryImageUrl: '/products/seal-1.png',
    operating_limits: [],
    face_materials: [],
    secondary_seal_materials: ['Viton'],
    metal_parts: ['SS 316'],
    seal_components: [],
    applications: ['Water'],
    custom_spec_groups: [],
    is_active: true,
    order: 1,
    galleryImages: [],
  },
  {
    id: 2,
    slug: 'sl-cartridge-double-barrier',
    name: 'SL-CARTRIDGE DOUBLE BARRIER',
    category: 'Cartridge Seals',
    subtitle: 'API 682 Plan 53A seal',
    description: 'Double barrier seal for toxic media',
    static_image_path: '/products/seal-2.png',
    primaryImageUrl: '/products/seal-2.png',
    operating_limits: [],
    face_materials: [],
    secondary_seal_materials: ['Kalrez'],
    metal_parts: ['Hastelloy C-276'],
    seal_components: [],
    applications: ['Chemical'],
    custom_spec_groups: [],
    is_active: false,
    order: 2,
    galleryImages: [],
  },
];

describe('AdminDashboard Feature Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminApi.fetchAdminCatalogProducts).mockResolvedValue(mockProducts);
  });

  it('renders metric KPI cards, catalog table rows, and active badges', async () => {
    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('SL-SINGLE SPRING STANDARD')).toBeInTheDocument();
      expect(screen.getByText('SL-CARTRIDGE DOUBLE BARRIER')).toBeInTheDocument();
    });

    expect(screen.getByText('Mechanical Seals Catalog')).toBeInTheDocument();
    expect(screen.getByText('Active on Storefront')).toBeInTheDocument();
    expect(screen.getByText('Drafts / Inactive')).toBeInTheDocument();
  });

  it('filters table dynamically when typing search keyword', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('SL-SINGLE SPRING STANDARD')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by model name, slug, specification/i);
    await user.type(searchInput, 'DOUBLE BARRIER');

    expect(screen.getByText('SL-CARTRIDGE DOUBLE BARRIER')).toBeInTheDocument();
    expect(screen.queryByText('SL-SINGLE SPRING STANDARD')).not.toBeInTheDocument();
  });

  it('opens DeleteConfirmModal when delete action icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('SL-SINGLE SPRING STANDARD')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    await user.click(deleteButtons[0]);

    expect(screen.getByText('Confirm Product Deletion')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Permanently Delete/i })).toBeInTheDocument();
  });
});
