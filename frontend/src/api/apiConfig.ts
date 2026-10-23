/**
 * API configuration and URL resolution for Sealox Frontend.
 * Supports zero-touch deployment across Vercel, Render, Railway, and localhost.
 */

/**
 * Resolves the backend API base origin.
 * If VITE_API_URL is configured (e.g. in Vercel: https://sealox-backend.onrender.com),
 * API requests will directly target the remote backend.
 * If omitted (local Vite development), requests use relative paths (/api/products)
 * which are proxied by Vite to http://127.0.0.1:8000.
 */
export function getApiOrigin(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, '');
  }
  return '';
}

export const API_BASE_URL = `${getApiOrigin()}/api/products`;
export const ADMIN_PRODUCTS_ENDPOINT = `${getApiOrigin()}/api/products/admin`;

/**
 * Resolves media image URLs.
 * If an image is hosted on local backend media storage (/media/products/...)
 * and the frontend is running on a different domain (e.g. Vercel),
 * this automatically prefixes the remote backend origin so images never break.
 */
export function resolveImageUrl(imageUrl?: string | null): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return '/hero_image.png';
  }
  const cleanUrl = imageUrl.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith('/media/')) {
    const origin = getApiOrigin();
    return origin ? `${origin}${cleanUrl}` : cleanUrl;
  }
  return cleanUrl;
}
