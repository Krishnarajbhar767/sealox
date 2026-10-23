import React from 'react';
import { Link } from 'react-router-dom';
import { Box, SimpleGrid, Alert, Button } from '@mantine/core';
import {
  IconPlus,
  IconPackage,
  IconCheck,
  IconEyeOff,
  IconAlertCircle,
} from '@tabler/icons-react';
import { AdminLayout } from './AdminLayout';
import { AdminHeader } from './components/AdminHeader';
import { MetricCard } from './components/MetricCard';
import { FilterBar } from './components/FilterBar';
import { CatalogTable } from './components/CatalogTable';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { useAdminCatalog } from './hooks/useAdminCatalog';

export const AdminDashboard: React.FC = () => {
  const {
    catalogProducts,
    allCategories,
    totalProductCount,
    activeProductCount,
    draftProductCount,
    isLoading,
    errorMessage,
    searchKeyword,
    setSearchKeyword,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    actionInProgressProductId,
    deleteModalState,
    reloadCatalog,
    toggleProductActive,
    duplicateProduct,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useAdminCatalog();

  return (
    <AdminLayout>
      <AdminHeader
        title="Mechanical Seals Catalog"
        subtitle="Industrial mechanical seals, technical specifications, and storefront visibility management."
        actions={
          <Button
            component={Link}
            to="/admin/products/new"
            color="teal"
            size="sm"
            leftSection={<IconPlus size={16} />}
          >
            Add New Product
          </Button>
        }
      />

      <Box p={{ base: 'md', sm: 'xl' }} className="space-y-5">

        {/* Global Error Banner */}
        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Connection Alert"
            color="red"
            radius="md"
          >
            {errorMessage}
          </Alert>
        )}

        {/* Metric Summary KPIs */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <MetricCard
            label="Total Catalog Models"
            value={totalProductCount}
            helperText="Mechanical seals in database"
            icon={<IconPackage size={22} />}
            color="teal"
          />
          <MetricCard
            label="Active on Storefront"
            value={activeProductCount}
            helperText="Publicly visible to clients"
            icon={<IconCheck size={22} />}
            color="green"
          />
          <MetricCard
            label="Drafts / Inactive"
            value={draftProductCount}
            helperText="Hidden from public catalog"
            icon={<IconEyeOff size={22} />}
            color="gray"
          />
        </SimpleGrid>

        {/* Search & Filter Toolbar */}
        <FilterBar
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          selectedCategory={selectedCategoryFilter}
          onCategoryChange={setSelectedCategoryFilter}
          categories={allCategories}
          totalProductCount={totalProductCount}
          onRefresh={reloadCatalog}
          isLoading={isLoading}
        />

        {/* Catalog Table */}
        <CatalogTable
          products={catalogProducts}
          isLoading={isLoading}
          errorMessage={errorMessage}
          actionInProgressId={actionInProgressProductId}
          onToggleActive={toggleProductActive}
          onDuplicate={duplicateProduct}
          onDelete={openDeleteModal}
          onRetry={reloadCatalog}
        />
      </Box>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        product={deleteModalState.targetProduct}
        isDeleting={deleteModalState.isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </AdminLayout>
  );
};
