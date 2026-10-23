import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type { CatalogProductRecord, DeleteModalState } from '../types';
import {
  fetchAdminCatalogProducts,
  toggleAdminProductVisibility,
  duplicateAdminProductTemplate,
  deleteAdminProductRecord,
} from '../../../api/adminApi';

function extractErrorMessage(error: unknown, defaultFallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const detailValue = (error as { detail: unknown }).detail;
    if (typeof detailValue === 'string') return detailValue;
  }
  return defaultFallback;
}

export function useAdminCatalog() {
  const [catalogProducts, setCatalogProducts] = useState<CatalogProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [actionInProgressProductId, setActionInProgressProductId] = useState<number | null>(null);

  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
    isOpen: false,
    targetProduct: null,
    isDeleting: false,
  });

  const displayToast = useCallback((messageText: string) => {
    notifications.show({
      title: 'Catalog Notification',
      message: messageText,
      color: 'teal',
      icon: React.createElement(IconCheck, { size: 18 }),
      autoClose: 4000,
    });
    setToastNotification(messageText);
    const timeoutHandle = setTimeout(() => {
      setToastNotification(null);
    }, 4500);
    return () => clearTimeout(timeoutHandle);
  }, []);

  const loadCatalogData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await fetchAdminCatalogProducts();
      setCatalogProducts(fetchedProducts);
      setErrorMessage(null);
    } catch (caughtError: unknown) {
      setErrorMessage(extractErrorMessage(caughtError, 'Could not connect to the backend server.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  const uniqueCategories = useMemo(() => {
    const categorySet = new Set<string>();
    catalogProducts.forEach((productRecord) => {
      if (productRecord.category) {
        categorySet.add(productRecord.category);
      }
    });
    return Array.from(categorySet);
  }, [catalogProducts]);

  const filteredCatalogProducts = useMemo(() => {
    return catalogProducts.filter((productRecord) => {
      const matchesCategory =
        selectedCategoryFilter === 'ALL' ||
        productRecord.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

      const normalizedKeyword = searchKeyword.toLowerCase().trim();
      const matchesSearch =
        !normalizedKeyword ||
        productRecord.name.toLowerCase().includes(normalizedKeyword) ||
        productRecord.slug.toLowerCase().includes(normalizedKeyword) ||
        productRecord.category.toLowerCase().includes(normalizedKeyword) ||
        (productRecord.description &&
          productRecord.description.toLowerCase().includes(normalizedKeyword));

      return matchesCategory && matchesSearch;
    });
  }, [catalogProducts, searchKeyword, selectedCategoryFilter]);

  const totalProductCount = catalogProducts.length;
  const activeProductCount = catalogProducts.filter((productRecord) => productRecord.is_active).length;
  const draftProductCount = totalProductCount - activeProductCount;

  const handleToggleProductActive = async (targetProduct: CatalogProductRecord) => {
    setActionInProgressProductId(targetProduct.id);
    try {
      const response = await toggleAdminProductVisibility(targetProduct.id);
      setCatalogProducts((previousCatalog) =>
        previousCatalog.map((productRecord) =>
          productRecord.id === targetProduct.id
            ? { ...productRecord, is_active: response.is_active }
            : productRecord,
        ),
      );
      displayToast(
        `"${targetProduct.name}" is now ${
          response.is_active ? 'Active on Storefront' : 'Draft / Hidden'
        }.`,
      );
    } catch (caughtError: unknown) {
      const err = extractErrorMessage(caughtError, 'Failed to update visibility status.');
      setErrorMessage(err);
      notifications.show({
        title: 'Status Update Failed',
        message: err,
        color: 'red',
        icon: React.createElement(IconAlertCircle, { size: 18 }),
        autoClose: 5000,
      });
    } finally {
      setActionInProgressProductId(null);
    }
  };

  const handleDuplicateProduct = async (targetProduct: CatalogProductRecord) => {
    setActionInProgressProductId(targetProduct.id);
    try {
      const duplicatedRecord = await duplicateAdminProductTemplate(targetProduct.id);
      setCatalogProducts((previousCatalog) => [duplicatedRecord, ...previousCatalog]);
      displayToast(`Duplicated "${targetProduct.name}" as a new draft template.`);
    } catch (caughtError: unknown) {
      const err = extractErrorMessage(caughtError, 'Failed to duplicate product template.');
      setErrorMessage(err);
      notifications.show({
        title: 'Duplication Failed',
        message: err,
        color: 'red',
        icon: React.createElement(IconAlertCircle, { size: 18 }),
        autoClose: 5000,
      });
    } finally {
      setActionInProgressProductId(null);
    }
  };

  const openDeleteModal = (targetProduct: CatalogProductRecord) => {
    setDeleteModalState({
      isOpen: true,
      targetProduct,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModalState({
      isOpen: false,
      targetProduct: null,
      isDeleting: false,
    });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModalState.targetProduct) return;
    const targetProduct = deleteModalState.targetProduct;

    setDeleteModalState((prevState) => ({ ...prevState, isDeleting: true }));
    setActionInProgressProductId(targetProduct.id);
    try {
      await deleteAdminProductRecord(targetProduct.id);
      setCatalogProducts((previousCatalog) =>
        previousCatalog.filter((productRecord) => productRecord.id !== targetProduct.id),
      );
      displayToast(`Deleted "${targetProduct.name}".`);
      closeDeleteModal();
    } catch (caughtError: unknown) {
      const err = extractErrorMessage(caughtError, 'Failed to delete product record.');
      setErrorMessage(err);
      notifications.show({
        title: 'Deletion Failed',
        message: err,
        color: 'red',
        icon: React.createElement(IconAlertCircle, { size: 18 }),
        autoClose: 5000,
      });
      setDeleteModalState((prevState) => ({ ...prevState, isDeleting: false }));
    } finally {
      setActionInProgressProductId(null);
    }
  };

  return {
    catalogProducts: filteredCatalogProducts,
    allCategories: uniqueCategories,
    totalProductCount,
    activeProductCount,
    draftProductCount,
    isLoading,
    errorMessage,
    searchKeyword,
    setSearchKeyword,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    toastNotification,
    setToastNotification,
    actionInProgressProductId,
    deleteModalState,
    reloadCatalog: loadCatalogData,
    toggleProductActive: handleToggleProductActive,
    duplicateProduct: handleDuplicateProduct,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete: confirmDeleteProduct,
  };
}
