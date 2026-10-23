import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { DeleteConfirmModal } from '../../features/admin/components/DeleteConfirmModal';
import type { CatalogProductRecord } from '../../features/admin/types';

const mockProduct: CatalogProductRecord = {
  id: 42,
  slug: 'cartridge-seal-heavy',
  name: 'Cartridge Heavy Duty Mechanical Seal',
  category: 'Cartridge Seals',
  subtitle: 'API 682 Compliant Cartridge Seal',
  description: 'Industrial heavy duty seal.',
  static_image_path: '/products/cartridge.png',
  primaryImageUrl: '/products/cartridge.png',
  operating_limits: [{ label: 'Pressure', value: '25 bar' }],
  face_materials: [{ label: 'Rotary', value: 'SiC' }],
  secondary_seal_materials: ['Viton'],
  metal_parts: ['SS 316'],
  seal_components: [{ code: 1, name: 'Sleeve' }],
  applications: ['Refinery'],
  custom_spec_groups: [],
  is_active: true,
  order: 1,
  galleryImages: [],
};

describe('DeleteConfirmModal Component', () => {
  it('does not render modal dialog when isOpen is false', () => {
    renderWithProviders(
      <DeleteConfirmModal
        isOpen={false}
        product={mockProduct}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Confirm Product Deletion/i)).not.toBeInTheDocument();
  });

  it('renders product details and warning when isOpen is true', () => {
    renderWithProviders(
      <DeleteConfirmModal
        isOpen={true}
        product={mockProduct}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText('Confirm Product Deletion')).toBeInTheDocument();
    expect(screen.getByText('Cartridge Heavy Duty Mechanical Seal')).toBeInTheDocument();
    expect(screen.getByText(/\/cartridge-seal-heavy/i)).toBeInTheDocument();
    expect(screen.getByText('Cartridge Seals')).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to permanently delete this mechanical seal model/i),
    ).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal
        isOpen={true}
        product={mockProduct}
        isDeleting={false}
        onClose={handleClose}
        onConfirm={vi.fn()}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Permanently Delete button is clicked', async () => {
    const handleConfirm = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal
        isOpen={true}
        product={mockProduct}
        isDeleting={false}
        onClose={vi.fn()}
        onConfirm={handleConfirm}
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /Permanently Delete/i });
    await user.click(deleteButton);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
