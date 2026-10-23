import { useEffect, useState } from 'react';
import {
  catalogProducts,
  getProductBySlug as getStaticProductBySlug,
  getAllProducts as getStaticAllProducts,
  type ProductItem,
} from '../features/products/productData';
import { API_BASE_URL, resolveImageUrl } from './apiConfig';

function normalizeProductMedia(product: ProductItem): ProductItem {
  return {
    ...product,
    image: resolveImageUrl(product.image),
    images: Array.isArray(product.images)
      ? product.images.map((img) => resolveImageUrl(img))
      : [resolveImageUrl(product.image)],
  };
}

/**
 * Fetches all active catalog products from the Django REST API.
 * Falls back to static catalogProducts if backend is offline or loading fails.
 */
export async function fetchProducts(): Promise<ProductItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(normalizeProductMedia);
    }
    return catalogProducts;
  } catch (err) {
    console.warn(
      '[Sealox API] Backend unavailable or offline. Falling back to static catalog baseline:',
      err,
    );
    return catalogProducts;
  }
}

/**
 * Fetches a single product by slug from the Django REST API.
 * Falls back to static baseline if backend is offline or product not found.
 */
export async function fetchProductBySlug(slug?: string): Promise<ProductItem> {
  if (!slug) {
    return getStaticProductBySlug();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(slug)}/`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    const data: ProductItem = await response.json();
    return normalizeProductMedia(data);
  } catch (err) {
    console.warn(`[Sealox API] Could not fetch ${slug} from backend. Using static fallback:`, err);
    return getStaticProductBySlug(slug);
  }
}

/**
 * Custom React Hook for fetching the full product catalog with loading state.
 */
export function useProducts() {
  const [products, setProducts] = useState<ProductItem[]>(getStaticAllProducts());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchProducts();
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[Sealox API] Failed to fetch products from backend:', err);
          setError('Failed to fetch from backend, showing catalog defaults.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}

/**
 * Custom React Hook for fetching a single product by slug with loading state.
 */
export function useProduct(slug?: string) {
  const [product, setProduct] = useState<ProductItem>(() => getStaticProductBySlug(slug));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchProductBySlug(slug);
        if (isMounted) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.warn(`[Sealox API] Failed to fetch product ${slug}:`, err);
          setError('Backend product fetch failed.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { product, loading, error };
}
