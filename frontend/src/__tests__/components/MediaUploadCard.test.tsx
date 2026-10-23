import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../testUtils';
import { MediaUploadCard } from '../../features/admin/components/MediaUploadCard';

describe('MediaUploadCard Component', () => {
  it('renders title, description, and preview image', () => {
    renderWithProviders(
      <MediaUploadCard
        displayImageUrl="/products/test-seal.png"
        staticImagePath="/products/test-seal.png"
        onStaticPathChange={vi.fn()}
        onFileSelected={vi.fn()}
      />,
    );

    expect(screen.getByText('Primary Product Photograph & Media')).toBeInTheDocument();
    expect(
      screen.getByText(/Upload product photo directly to Cloudinary/i),
    ).toBeInTheDocument();
  });

  it('triggers onStaticPathChange when user types in fallback static path', async () => {
    const handleStaticPathChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <MediaUploadCard
        displayImageUrl="/hero_image.png"
        staticImagePath=""
        onStaticPathChange={handleStaticPathChange}
        onFileSelected={vi.fn()}
      />,
    );

    const staticInput = screen.getByLabelText(/Fallback Static Image Path/i);
    await user.type(staticInput, '/products/custom-seal.png');

    expect(handleStaticPathChange).toHaveBeenCalled();
  });

  it('displays error message when fileError prop is provided', () => {
    renderWithProviders(
      <MediaUploadCard
        displayImageUrl="/hero_image.png"
        staticImagePath=""
        fileError="File size exceeds 10MB limit. Please choose a smaller image."
        onStaticPathChange={vi.fn()}
        onFileSelected={vi.fn()}
      />,
    );

    expect(
      screen.getByText('File size exceeds 10MB limit. Please choose a smaller image.'),
    ).toBeInTheDocument();
  });

  it('allows file selection and triggers onFileSelected', async () => {
    const handleFileSelected = vi.fn();
    const user = userEvent.setup();

    const { container } = renderWithProviders(
      <MediaUploadCard
        displayImageUrl="/hero_image.png"
        staticImagePath=""
        onStaticPathChange={vi.fn()}
        onFileSelected={handleFileSelected}
      />,
    );

    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();
    const testFile = new File(['dummy png content'], 'seal.png', { type: 'image/png' });

    await user.upload(fileInput, testFile);

    expect(handleFileSelected).toHaveBeenCalledTimes(1);
    expect(handleFileSelected).toHaveBeenCalledWith(testFile);
  });
});
