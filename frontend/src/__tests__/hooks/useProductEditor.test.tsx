import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useProductEditor } from '../../features/admin/hooks/useProductEditor';
import React from 'react';

// Wrapper for router
function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('useProductEditor Hook', () => {
  it('initializes with clean state and standard presets', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.saveStatus).toBe('clean');
    expect(result.current.formInputState.name).toBe('');
    expect(result.current.formInputState.slug).toBe('');
    expect(result.current.formInputState.operating_limits.length).toBeGreaterThan(0);
    expect(result.current.formInputState.face_materials.length).toBeGreaterThan(0);
  });

  it('updates product name and automatically generates URL slug when slug has not been manually customized', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });

    act(() => {
      result.current.handleNameChange('HIGH PRESSURE BELLOWS SEAL');
    });

    expect(result.current.formInputState.name).toBe('HIGH PRESSURE BELLOWS SEAL');
    expect(result.current.formInputState.slug).toBe('high-pressure-bellows-seal');
    expect(result.current.isDirty).toBe(true);
  });

  it('detects dirty state when field changes and reverts to clean when reverted', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });

    expect(result.current.isDirty).toBe(false);

    act(() => {
      result.current.handleFieldChange('subtitle', 'A new subtitle');
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.handleFieldChange('subtitle', '');
    });
    expect(result.current.isDirty).toBe(false);
  });

  it('allows adding, updating, and removing operating limits rows', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });
    const initialRowCount = result.current.formInputState.operating_limits.length;

    act(() => {
      result.current.addOperatingLimitRow();
    });
    expect(result.current.formInputState.operating_limits.length).toBe(initialRowCount + 1);

    act(() => {
      result.current.updateOperatingLimitRow(initialRowCount, 'label', 'Shaft Torque');
      result.current.updateOperatingLimitRow(initialRowCount, 'value', '250 Nm');
    });
    expect(
      result.current.formInputState.operating_limits[initialRowCount],
    ).toEqual({ label: 'Shaft Torque', value: '250 Nm' });

    act(() => {
      result.current.removeOperatingLimitRow(initialRowCount);
    });
    expect(result.current.formInputState.operating_limits.length).toBe(initialRowCount);
  });

  it('auto-increments component callout codes when adding new callout rows', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });
    const highestInitialCode = result.current.formInputState.seal_components.reduce(
      (max, item) => Math.max(max, item.code),
      0,
    );

    act(() => {
      result.current.addAssemblyComponentRow();
    });

    const lastComponent =
      result.current.formInputState.seal_components[
        result.current.formInputState.seal_components.length - 1
      ];
    expect(lastComponent.code).toBe(highestInitialCode + 1);
    expect(lastComponent.name).toBe('');
  });

  it('deduplicates tags and trims whitespace', () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });

    act(() => {
      result.current.updateChipList('secondary_seal_materials', [
        'Viton',
        '  Viton  ',
        'NBR',
        '',
        '   ',
      ]);
    });

    expect(result.current.formInputState.secondary_seal_materials).toEqual(['Viton', 'NBR']);
  });

  it('validates required fields on client-side and stops submission if name is missing', async () => {
    const { result } = renderHook(() => useProductEditor(), { wrapper });

    await act(async () => {
      await result.current.saveProduct();
    });

    expect(result.current.fieldErrors.name).toContain('Product Name is required.');
    expect(result.current.fieldErrors.slug).toContain('URL Slug is required.');
    expect(result.current.generalErrorMessage).toContain('Please fill in all required fields.');
  });
});
