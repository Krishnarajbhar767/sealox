import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextInput,
  Textarea,
  Switch,
  NumberInput,
  Grid,
  Stack,
  Group,
  Button,
  Alert,
  Title,
  Text,
  Loader,
  Badge,
  Modal,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconDeviceFloppy,
  IconExternalLink,
} from '@tabler/icons-react';
import { AdminLayout } from './AdminLayout';
import { AdminHeader } from './components/AdminHeader';
import { MediaUploadCard } from './components/MediaUploadCard';
import { OperatingLimitsTable } from './components/OperatingLimitsTable';
import { FaceMaterialsTable } from './components/FaceMaterialsTable';
import { TagsField } from './components/TagsField';
import { AssemblyCalloutsTable } from './components/AssemblyCalloutsTable';
import { useProductEditor } from './hooks/useProductEditor';

export const ProductEditor: React.FC = () => {
  const { lookup } = useParams<{ lookup: string }>();
  const navigate = useNavigate();
  const [discardModalOpened, setDiscardModalOpened] = useState<boolean>(false);

  const {
    isEditing,
    isLoading,
    isSaving,
    isDirty,
    saveStatus,
    lastSavedTime,
    formInputState,
    generalErrorMessage,
    fieldErrors,
    activeDisplayImageUrl,
    handleNameChange,
    handleFieldChange,
    handleImageFileSelection,
    addOperatingLimitRow,
    updateOperatingLimitRow,
    removeOperatingLimitRow,
    loadStandardLimitsTemplate,
    addFaceMaterialRow,
    updateFaceMaterialRow,
    removeFaceMaterialRow,
    loadStandardFaceMaterialsTemplate,
    addAssemblyComponentRow,
    updateAssemblyComponentRow,
    removeAssemblyComponentRow,
    updateChipList,
    saveProduct,
  } = useProductEditor(lookup);

  const handleCancelClick = () => {
    if (isDirty) {
      setDiscardModalOpened(true);
    } else {
      navigate('/admin');
    }
  };

  const handleConfirmDiscard = () => {
    setDiscardModalOpened(false);
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box p="xl" ta="center" py={80}>
          <Loader color="teal" size="lg" mx="auto" mb="sm" />
          <Text size="sm" c="dimmed">
            Loading mechanical seal specifications...
          </Text>
        </Box>
      </AdminLayout>
    );
  }

  const errorCount = Object.keys(fieldErrors).length;

  return (
    <AdminLayout>
      {/* Unsaved Changes Discard Confirmation Modal */}
      <Modal
        opened={discardModalOpened}
        onClose={() => setDiscardModalOpened(false)}
        title={
          <Group gap="xs">
            <ThemeIcon color="orange" variant="light" size="md" radius="md">
              <IconAlertTriangle size={18} />
            </ThemeIcon>
            <Text fw={700} size="sm">
              Discard Unsaved Changes?
            </Text>
          </Group>
        }
        centered
        radius="md"
        shadow="lg"
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            You have unsaved changes in this mechanical seal specification. If you leave now, all
            recent edits will be discarded.
          </Text>
          <Group justify="flex-end" gap="xs">
            <Button variant="default" size="xs" onClick={() => setDiscardModalOpened(false)}>
              Keep Editing
            </Button>
            <Button color="red" size="xs" onClick={handleConfirmDiscard}>
              Discard & Leave
            </Button>
          </Group>
        </Stack>
      </Modal>

      <form onSubmit={saveProduct} noValidate>
        <AdminHeader
          title={
            isEditing
              ? `Edit: ${formInputState.name || 'Mechanical Seal'}`
              : 'Add New Mechanical Seal'
          }
          subtitle={
            isEditing
              ? 'Update catalog specifications, operating limits, and assembly parts.'
              : 'Define a new industrial mechanical seal model for the catalog.'
          }
          backHref="/admin"
          actions={
            <Group gap="xs">
              <Button variant="default" size="xs" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="teal"
                size="xs"
                loading={isSaving}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </Button>
            </Group>
          }
        />

        <Box p={{ base: 'md', sm: 'xl' }} className="space-y-6 pb-28">
          {/* General Alert Banners */}
          {generalErrorMessage && (
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="Validation Alert"
              color="red"
              radius="md"
            >
              {generalErrorMessage}
            </Alert>
          )}

          {/* 1. PRODUCT IDENTITY & METADATA */}
          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Stack gap={1} mb="md">
              <Title order={4} size="h5" c="dark.8">
                Product Identity & Marketing Copy
              </Title>
              <Text size="xs" c="dimmed">
                Core product title, slug URL, and catalog categorization.
              </Text>
            </Stack>

            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  id="name"
                  name="name"
                  label="Product Name"
                  required
                  placeholder="e.g. CLOSE / STOCK TYPE ELASTOMER UNBALANCED SEAL"
                  value={formInputState.name}
                  onChange={(event) => handleNameChange(event.currentTarget.value)}
                  error={fieldErrors.name?.[0]}
                  size="sm"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  id="slug"
                  name="slug"
                  label="URL Slug"
                  required
                  placeholder="e.g. close-stock-type-elastomer-unbalanced-seal"
                  value={formInputState.slug}
                  onChange={(event) => handleFieldChange('slug', event.currentTarget.value)}
                  error={fieldErrors.slug?.[0]}
                  size="sm"
                  description="Auto-derived identifier for storefront product URL (lowercase, numbers, and hyphens)."
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  id="category"
                  name="category"
                  label="Product Category"
                  placeholder="e.g. Mechanical Seals • Elastomer Bellows"
                  value={formInputState.category}
                  onChange={(event) => handleFieldChange('category', event.currentTarget.value)}
                  error={fieldErrors.category?.[0]}
                  size="sm"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  id="subtitle"
                  name="subtitle"
                  label="Short Subtitle"
                  placeholder="e.g. Close Stock Type Elastomer Unbalanced Shaft Seal"
                  value={formInputState.subtitle}
                  onChange={(event) => handleFieldChange('subtitle', event.currentTarget.value)}
                  error={fieldErrors.subtitle?.[0]}
                  size="sm"
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <Textarea
                  id="description"
                  name="description"
                  label="Engineering Description"
                  placeholder="Detailed mechanical engineering description, operational advantages, and design features..."
                  value={formInputState.description}
                  onChange={(event) => handleFieldChange('description', event.currentTarget.value)}
                  error={fieldErrors.description?.[0]}
                  rows={3}
                  size="sm"
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* 2. MEDIA UPLOAD */}
          <MediaUploadCard
            displayImageUrl={activeDisplayImageUrl}
            staticImagePath={formInputState.static_image_path}
            fileError={fieldErrors.primary_image?.[0]}
            onStaticPathChange={(newPath) => handleFieldChange('static_image_path', newPath)}
            onFileSelected={handleImageFileSelection}
          />

          {/* 3. OPERATING LIMITS TABLE */}
          <OperatingLimitsTable
            rows={formInputState.operating_limits}
            onAddRow={addOperatingLimitRow}
            onUpdateRow={updateOperatingLimitRow}
            onRemoveRow={removeOperatingLimitRow}
            onLoadTemplate={loadStandardLimitsTemplate}
          />

          {/* 4. FACE MATERIALS TABLE */}
          <FaceMaterialsTable
            rows={formInputState.face_materials}
            onAddRow={addFaceMaterialRow}
            onUpdateRow={updateFaceMaterialRow}
            onRemoveRow={removeFaceMaterialRow}
            onLoadTemplate={loadStandardFaceMaterialsTemplate}
          />

          {/* 5. ELASTOMERS, METALS & APPLICATIONS (MANTINE TAGSINPUT) */}
          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Stack gap={1} mb="md">
              <Title order={4} size="h5" c="dark.8">
                Elastomers, Metallurgy & Industry Sectors
              </Title>
              <Text size="xs" c="dimmed">
                Enter material grades and industries. Type and press Enter to create chips.
              </Text>
            </Stack>

            <Grid gap="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TagsField
                  label="Secondary Seal Elastomers"
                  placeholder="e.g. Viton, NBR, EPDM, Silicon"
                  description="Available elastomer bellows and O-ring materials."
                  value={formInputState.secondary_seal_materials}
                  onChange={(tags) => updateChipList('secondary_seal_materials', tags)}
                  error={fieldErrors.secondary_seal_materials?.[0]}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <TagsField
                  label="Metal Components & Alloys"
                  placeholder="e.g. SS304, SS316, Hastelloy-C"
                  description="Metal casing, drive collar, and spring alloys."
                  value={formInputState.metal_parts}
                  onChange={(tags) => updateChipList('metal_parts', tags)}
                  error={fieldErrors.metal_parts?.[0]}
                />
              </Grid.Col>

              <Grid.Col span={12}>
                <TagsField
                  label="Target Industry Applications"
                  placeholder="e.g. Chemical Plant, Oil Refinery, Water Treatment"
                  description="Target industries where this mechanical seal is deployed."
                  value={formInputState.applications}
                  onChange={(tags) => updateChipList('applications', tags)}
                  error={fieldErrors.applications?.[0]}
                />
              </Grid.Col>
            </Grid>
          </Paper>

          {/* 6. ASSEMBLY CALLOUTS TABLE */}
          <AssemblyCalloutsTable
            rows={formInputState.seal_components}
            onAddRow={addAssemblyComponentRow}
            onUpdateRow={updateAssemblyComponentRow}
            onRemoveRow={removeAssemblyComponentRow}
          />

          {/* 7. PUBLISHING & ORDERING */}
          <Paper withBorder p="md" radius="md" bg="white" shadow="xs">
            <Stack gap={1} mb="md">
              <Title order={4} size="h5" c="dark.8">
                Storefront Publishing Status
              </Title>
              <Text size="xs" c="dimmed">
                Configure storefront visibility and catalog sorting priority.
              </Text>
            </Stack>

            <Group justify="space-between" wrap="wrap" gap="md">
              <Switch
                label="Active & Visible on Public Website"
                description="Toggle off to temporarily hide or save as a draft."
                checked={formInputState.is_active}
                onChange={(event) =>
                  handleFieldChange('is_active', event.currentTarget.checked)
                }
                color="teal"
                size="md"
              />

              <NumberInput
                label="Display Order Rank"
                description="0 = highest priority"
                value={formInputState.order}
                onChange={(val) => handleFieldChange('order', Number(val) || 0)}
                w={140}
                min={0}
                size="sm"
              />
            </Group>
          </Paper>
        </Box>

        {/* STICKY BOTTOM ACTIONS BAR WITH LIVE STATUS */}
        <Paper
          withBorder
          radius={0}
          p="sm"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md"
        >
          <Group justify="space-between" className="max-w-7xl mx-auto px-4 sm:px-8">
            <Group gap="sm" align="center">
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={handleCancelClick}
              >
                Cancel & Return
              </Button>

              {/* Real-time Save Status Indicators */}
              {isDirty && (
                <Badge variant="dot" color="orange" size="xs">
                  Unsaved Changes
                </Badge>
              )}

              {saveStatus === 'saved' && !isDirty && (
                <Badge variant="dot" color="teal" size="xs">
                  All Changes Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}
                </Badge>
              )}

              {saveStatus === 'saving' && (
                <Badge variant="light" color="blue" size="xs">
                  Saving Specifications...
                </Badge>
              )}

              {errorCount > 0 && (
                <Badge variant="filled" color="red" size="xs">
                  {errorCount} {errorCount === 1 ? 'Error' : 'Errors'} Found
                </Badge>
              )}
            </Group>

            <Group gap="xs">
              {isEditing && (
                <Button
                  component={Link}
                  to={`/products/${formInputState.slug}`}
                  target="_blank"
                  variant="default"
                  size="xs"
                  leftSection={<IconExternalLink size={14} />}
                >
                  View Live Page
                </Button>
              )}

              <Button
                type="submit"
                color="teal"
                size="sm"
                loading={isSaving}
                leftSection={<IconDeviceFloppy size={16} />}
              >
                {isEditing ? 'Save Specification Changes' : 'Publish Product'}
              </Button>
            </Group>
          </Group>
        </Paper>
      </form>
    </AdminLayout>
  );
};
