import type { CatalogProductRecord } from '../features/admin/types';
import { ADMIN_PRODUCTS_ENDPOINT, resolveImageUrl } from './apiConfig';

function normalizeAdminProduct(record: CatalogProductRecord): CatalogProductRecord {
  return {
    ...record,
    primaryImageUrl: resolveImageUrl(record.primaryImageUrl),
  };
}

function getCsrfToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookieMatch = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]*)/);
  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
}

export async function fetchAdminCatalogProducts(
  searchKeyword?: string,
  categoryFilter?: string,
): Promise<CatalogProductRecord[]> {
  const queryParameters = new URLSearchParams();
  if (searchKeyword?.trim()) {
    queryParameters.append('search', searchKeyword.trim());
  }
  if (categoryFilter && categoryFilter !== 'ALL') {
    queryParameters.append('category', categoryFilter);
  }

  const queryString = queryParameters.toString() ? `?${queryParameters.toString()}` : '';
  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/${queryString}`);

  if (!apiResponse.ok) {
    throw new Error(`Failed to retrieve catalog: ${apiResponse.statusText}`);
  }

  const results: CatalogProductRecord[] = await apiResponse.json();
  return Array.isArray(results) ? results.map(normalizeAdminProduct) : results;
}

export async function fetchAdminProductDetail(
  productIdentifier: string | number,
): Promise<CatalogProductRecord> {
  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/${encodeURIComponent(productIdentifier)}/`);

  if (!apiResponse.ok) {
    throw new Error(`Failed to load product '${productIdentifier}': ${apiResponse.statusText}`);
  }

  const record: CatalogProductRecord = await apiResponse.json();
  return normalizeAdminProduct(record);
}

export interface ImageUploadResponse {
  url: string;
  file_path: string;
  filename: string;
}

export async function uploadAdminProductImage(imageFile: File): Promise<ImageUploadResponse> {
  const multipartFormData = new FormData();
  multipartFormData.append('image', imageFile);

  const requestHeaders: HeadersInit = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/upload-image/`, {
    method: 'POST',
    headers: requestHeaders,
    body: multipartFormData,
  });

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.json().catch(() => ({ error: apiResponse.statusText }));
    throw errorBody;
  }

  return apiResponse.json();
}

export async function createAdminProductRecord(
  productData: Record<string, unknown>,
): Promise<CatalogProductRecord> {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/`, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify(productData),
  });

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.json().catch(() => ({ detail: apiResponse.statusText }));
    throw errorBody;
  }

  return apiResponse.json();
}

export async function updateAdminProductRecord(
  productIdentifier: string | number,
  productData: Record<string, unknown>,
): Promise<CatalogProductRecord> {
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/${encodeURIComponent(productIdentifier)}/`, {
    method: 'PATCH',
    headers: requestHeaders,
    body: JSON.stringify(productData),
  });

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.json().catch(() => ({ detail: apiResponse.statusText }));
    throw errorBody;
  }

  return apiResponse.json();
}

export async function deleteAdminProductRecord(
  productIdentifier: string | number,
): Promise<void> {
  const requestHeaders: HeadersInit = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(`${ADMIN_PRODUCTS_ENDPOINT}/${encodeURIComponent(productIdentifier)}/`, {
    method: 'DELETE',
    headers: requestHeaders,
  });

  if (!apiResponse.ok) {
    throw new Error(`Failed to delete product: ${apiResponse.statusText}`);
  }
}

export async function duplicateAdminProductTemplate(
  productIdentifier: string | number,
): Promise<CatalogProductRecord> {
  const requestHeaders: HeadersInit = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(
    `${ADMIN_PRODUCTS_ENDPOINT}/${encodeURIComponent(productIdentifier)}/duplicate/`,
    {
      method: 'POST',
      headers: requestHeaders,
    },
  );

  if (!apiResponse.ok) {
    throw new Error(`Failed to duplicate product: ${apiResponse.statusText}`);
  }

  return apiResponse.json();
}

export async function toggleAdminProductVisibility(
  productIdentifier: string | number,
): Promise<{ is_active: boolean; message: string }> {
  const requestHeaders: HeadersInit = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const apiResponse = await fetch(
    `${ADMIN_PRODUCTS_ENDPOINT}/${encodeURIComponent(productIdentifier)}/toggle-active/`,
    {
      method: 'POST',
      headers: requestHeaders,
    },
  );

  if (!apiResponse.ok) {
    throw new Error(`Failed to toggle visibility: ${apiResponse.statusText}`);
  }

  return apiResponse.json();
}

