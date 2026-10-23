import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminCatalog } from '../../features/admin/hooks/useAdminCatalog';
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
    slug: 'close-seal-1',
    name: 'Close Seal Alpha',
    category: 'Elastomer Bellows',
    subtitle: 'Alpha seal',
    description: 'High performance seal',
    static_image_path: '/products/close.png',
    primaryImageUrl: '/products/close.png',
    operating_limits: [],
    face_materials: [],
    secondary_seal_materials: ['Viton'],
    metal_parts: ['SS316'],
    seal_components: [],
    applications: ['Pumps'],
    custom_spec_groups: [],
    is_active: true,
    order: 0,
    galleryImages: [],
  },
  {
    id: 2,
    slug: 'cartridge-seal-beta',
    name: 'Cartridge Seal Beta',
    category: 'Cartridge Seals',
    subtitle: 'Beta seal',
    description: 'Heavy duty seal',
    static_image_path: '/products/cartridge.png',
    primaryImageUrl: '/products/cartridge.png',
    operating_limits: [],
    face_materials: [],
    secondary_seal_materials: ['EPDM'],
    metal_parts: ['Hastelloy'],
    seal_components: [],
    applications: ['Mixers'],
    custom_spec_groups: [],
    is_active: false,
    order: 1,
    galleryImages: [],
  },
];

describe('useAdminCatalog Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminApi.fetchAdminCatalogProducts).mockResolvedValue(mockProducts);
  });

  it('loads and filters products accurately', async () => {
    const { result } = renderHook(() => useAdminCatalog());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data load
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.totalProductCount).toBe(2);
    expect(result.current.activeProductCount).toBe(1);
    expect(result.current.draftProductCount).toBe(1);
    expect(result.current.allCategories).toEqual(['Elastomer Bellows', 'Cartridge Seals']);
  });

  it('filters by search keyword', async () => {
    const { result } = renderHook(() => useAdminCatalog());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setSearchKeyword('cartridge');
    });

    expect(result.current.catalogProducts.length).toBe(1);
    expect(result.current.catalogProducts[0].name).toBe('Cartridge Seal Beta');
  });

  it('filters by category selection', async () => {
    const { result } = renderHook(() => useAdminCatalog());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.setSelectedCategoryFilter('Elastomer Bellows');
    });

    expect(result.current.catalogProducts.length).toBe(1);
    expect(result.current.catalogProducts[0].category).toBe('Elastomer Bellows');
  });

  it('toggles product visibility', async () => {
    vi.mocked(adminApi.toggleAdminProductVisibility).mockResolvedValue({
      is_active: false,
      message: 'Product is now Draft',
    });

    const { result } = renderHook(() => useAdminCatalog());
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.toggleProductActive(mockProducts[0]);
    });

    expect(adminApi.toggleAdminProductVisibility).toHaveBeenCalledWith(1);
    const updated = result.current.catalogProducts.find((p) => p.id === 1);
    expect(updated?.is_active).toBe(false);
    expect(result.current.toastNotification).toContain('Draft / Hidden');
  });

  it('duplicates product as template and adds to list', async () => {
    const duplicated: CatalogProductRecord = {
      ...mockProducts[0],
      id: 99,
      slug: 'close-seal-1-copy',
      name: 'Close Seal Alpha (Copy)',
      is_active: false,
    };
    vi.mocked(adminApi.duplicateAdminProductTemplate).mockResolvedValue(duplicated);

    const { result } = renderHook(() => useAdminCatalog());
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.duplicateProduct(mockProducts[0]);
    });

    expect(adminApi.duplicateAdminProductTemplate).toHaveBeenCalledWith(1);
    expect(result.current.catalogProducts.length).toBe(3);
    expect(result.current.catalogProducts[0].slug).toBe('close-seal-1-copy');
  });

  it('manages modal-based deletion state and deletes product', async () => {
    vi.mocked(adminApi.deleteAdminProductRecord).mockResolvedValue();

    const { result } = renderHook(() => useAdminCatalog());
    await act(async () => {
      await Promise.resolve();
    });

    // Open modal
    act(() => {
      result.current.openDeleteModal(mockProducts[0]);
    });
    expect(result.current.deleteModalState.isOpen).toBe(true);
    expect(result.current.deleteModalState.targetProduct?.id).toBe(1);

    // Confirm delete
    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(adminApi.deleteAdminProductRecord).toHaveBeenCalledWith(1);
    expect(result.current.deleteModalState.isOpen).toBe(false);
    expect(result.current.catalogProducts.find((p) => p.id === 1)).toBeUndefined();
    expect(result.current.toastNotification).toContain('Deleted "Close Seal Alpha"');
  });
});
