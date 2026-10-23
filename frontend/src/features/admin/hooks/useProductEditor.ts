import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';
import type {
  ProductFormInputState,
  OperatingLimitRow,
  FaceMaterialRow,
  ApiFieldErrors,
  EditorSaveStatus,
} from '../types';
import {
  fetchAdminProductDetail,
  createAdminProductRecord,
  updateAdminProductRecord,
  uploadAdminProductImage,
} from '../../../api/adminApi';

const STANDARD_PUMP_LIMITS: OperatingLimitRow[] = [
  { label: 'Seal Size', value: '12mm to 50mm' },
  { label: 'Pressure', value: '8 kg/cm²' },
  { label: 'Speed', value: '3000 RPM' },
  { label: 'Temperature', value: '-20°C to +150°C' },
];

const STANDARD_FACE_MATERIALS: FaceMaterialRow[] = [
  { label: 'Rotary Face', value: 'Carbon, Silicon, Tungsten Carbide' },
  { label: 'Stationary Seats', value: 'Silicon, TC, SS, Ceramic' },
  { label: 'Type', value: 'S-60 / Equivalent' },
];

function extractApiErrors(error: unknown): { fieldErrors: ApiFieldErrors; generalMessage: string } {
  if (error && typeof error === 'object') {
    const errorRecord = error as Record<string, unknown>;
    const fieldErrors: ApiFieldErrors = {};
    let generalMessage = 'Validation failed. Please correct the highlighted errors.';

    if (typeof errorRecord.detail === 'string') {
      generalMessage = errorRecord.detail;
    }

    for (const [key, value] of Object.entries(errorRecord)) {
      if (key === 'detail') continue;
      if (Array.isArray(value)) {
        fieldErrors[key] = value.map(String);
      } else if (typeof value === 'string') {
        fieldErrors[key] = [value];
      }
    }

    return { fieldErrors, generalMessage };
  }

  if (error instanceof Error) {
    return { fieldErrors: {}, generalMessage: error.message };
  }

  return { fieldErrors: {}, generalMessage: 'An unexpected error occurred while saving.' };
}

function sanitizeRows<T extends { label: string; value: string }>(rows: T[]): T[] {
  return rows.filter((row) => row.label.trim().length > 0 || row.value.trim().length > 0);
}

export function useProductEditor(productIdentifier?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(productIdentifier);

  const [isLoading, setIsLoading] = useState<boolean>(isEditing);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>('clean');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [generalErrorMessage, setGeneralErrorMessage] = useState<string | null>(null);
  const [generalSuccessMessage, setGeneralSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});

  const [existingServerImageUrl, setExistingServerImageUrl] = useState<string>('');
  const [localBlobPreviewUrl, setLocalBlobPreviewUrl] = useState<string | null>(null);
  const blobCleanupRef = useRef<string | null>(null);

  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  const [formInputState, setFormInputState] = useState<ProductFormInputState>({
    name: '',
    slug: '',
    category: 'Mechanical Seals • Elastomer Bellows',
    subtitle: '',
    description: '',
    static_image_path: '',
    operating_limits: [...STANDARD_PUMP_LIMITS],
    face_materials: [...STANDARD_FACE_MATERIALS],
    secondary_seal_materials: ['Viton', 'NBR', 'EPDM', 'Silicon'],
    metal_parts: ['SS304', 'SS316'],
    seal_components: [
      { code: 1, name: 'Elastomer Bellow' },
      { code: 2, name: 'SS Casing' },
      { code: 3, name: 'SS Spring' },
      { code: 4, name: 'Seal Face' },
      { code: 5, name: 'Stationary Seat' },
      { code: 6, name: 'Stationary Packing' },
      { code: 8, name: 'SS Corner Ring' },
    ],
    applications: ['Chemical Plant', 'Oil Refinery', 'Water Treatment'],
    custom_spec_groups: [],
    is_active: true,
    order: 0,
    primary_image_file: null,
  });

  // Track Unsaved Changes
  const currentSnapshot = useMemo(() => {
    const { primary_image_file, ...comparableState } = formInputState;
    return JSON.stringify({
      ...comparableState,
      hasFile: Boolean(primary_image_file),
    });
  }, [formInputState]);

  const isDirty = useMemo(() => {
    if (!initialSnapshot) return false;
    return currentSnapshot !== initialSnapshot;
  }, [currentSnapshot, initialSnapshot]);

  // Browser reload / tab close guard
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const loadExistingProduct = useCallback(async (identifier: string) => {
    setIsLoading(true);
    setGeneralErrorMessage(null);
    try {
      const productRecord = await fetchAdminProductDetail(identifier);
      const loadedState: ProductFormInputState = {
        name: productRecord.name || '',
        slug: productRecord.slug || '',
        category: productRecord.category || 'Mechanical Seals • Elastomer Bellows',
        subtitle: productRecord.subtitle || '',
        description: productRecord.description || '',
        static_image_path: productRecord.static_image_path || '',
        operating_limits: productRecord.operating_limits || [],
        face_materials: productRecord.face_materials || [],
        secondary_seal_materials: productRecord.secondary_seal_materials || [],
        metal_parts: productRecord.metal_parts || [],
        seal_components: productRecord.seal_components || [],
        applications: productRecord.applications || [],
        custom_spec_groups: productRecord.custom_spec_groups || [],
        is_active: productRecord.is_active ?? true,
        order: productRecord.order || 0,
        primary_image_file: null,
      };

      setFormInputState(loadedState);
      setExistingServerImageUrl(
        productRecord.primaryImageUrl || productRecord.static_image_path || '',
      );

      const loadedSnapshot = JSON.stringify({
        ...loadedState,
        hasFile: false,
      });
      setInitialSnapshot(loadedSnapshot);
      setSaveStatus('clean');
    } catch (caughtError: unknown) {
      const { generalMessage } = extractApiErrors(caughtError);
      setGeneralErrorMessage(generalMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditing && productIdentifier) {
      loadExistingProduct(productIdentifier);
    } else if (!isEditing) {
      setInitialSnapshot(currentSnapshot);
    }
  }, [isEditing, productIdentifier, loadExistingProduct]);

  // Object URL cleanup
  useEffect(() => {
    return () => {
      if (blobCleanupRef.current) {
        URL.revokeObjectURL(blobCleanupRef.current);
      }
    };
  }, []);

  const handleNameChange = (newProductName: string) => {
    setFormInputState((previousState) => {
      const generatedSlug =
        !isEditing || !previousState.slug
          ? newProductName
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, '')
              .replace(/[\s_-]+/g, '-')
              .replace(/^-+|-+$/g, '')
          : previousState.slug;

      return { ...previousState, name: newProductName, slug: generatedSlug };
    });
    _clearFieldError('name');
  };

  const handleFieldChange = <K extends keyof ProductFormInputState>(
    fieldKey: K,
    fieldValue: ProductFormInputState[K],
  ) => {
    setFormInputState((previousState) => ({
      ...previousState,
      [fieldKey]: fieldValue,
    }));
    _clearFieldError(fieldKey as string);
  };

  const handleImageFileSelection = (selectedFile: File | null) => {
    if (blobCleanupRef.current) {
      URL.revokeObjectURL(blobCleanupRef.current);
      blobCleanupRef.current = null;
    }

    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setFieldErrors((prev) => ({
          ...prev,
          primary_image: ['Image file size must be less than 10MB.'],
        }));
        return;
      }

      const newBlobUrl = URL.createObjectURL(selectedFile);
      blobCleanupRef.current = newBlobUrl;
      setLocalBlobPreviewUrl(newBlobUrl);
      setFormInputState((previousState) => ({
        ...previousState,
        primary_image_file: selectedFile,
      }));
      _clearFieldError('primary_image');
    } else {
      setLocalBlobPreviewUrl(null);
      setFormInputState((previousState) => ({
        ...previousState,
        primary_image_file: null,
      }));
    }
  };

  // Operating Limits Handlers
  const addOperatingLimitRow = () => {
    setFormInputState((previousState) => ({
      ...previousState,
      operating_limits: [...previousState.operating_limits, { label: '', value: '' }],
    }));
  };

  const updateOperatingLimitRow = (
    rowIndex: number,
    columnKey: 'label' | 'value',
    cellValue: string,
  ) => {
    setFormInputState((previousState) => {
      const updatedRows = [...previousState.operating_limits];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: cellValue };
      return { ...previousState, operating_limits: updatedRows };
    });
  };

  const removeOperatingLimitRow = (rowIndex: number) => {
    setFormInputState((previousState) => ({
      ...previousState,
      operating_limits: previousState.operating_limits.filter((_, index) => index !== rowIndex),
    }));
  };

  const loadStandardLimitsTemplate = () => {
    setFormInputState((previousState) => ({
      ...previousState,
      operating_limits: [...STANDARD_PUMP_LIMITS],
    }));
  };

  // Face Materials Handlers
  const addFaceMaterialRow = () => {
    setFormInputState((previousState) => ({
      ...previousState,
      face_materials: [...previousState.face_materials, { label: '', value: '' }],
    }));
  };

  const updateFaceMaterialRow = (
    rowIndex: number,
    columnKey: 'label' | 'value',
    cellValue: string,
  ) => {
    setFormInputState((previousState) => {
      const updatedRows = [...previousState.face_materials];
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: cellValue };
      return { ...previousState, face_materials: updatedRows };
    });
  };

  const removeFaceMaterialRow = (rowIndex: number) => {
    setFormInputState((previousState) => ({
      ...previousState,
      face_materials: previousState.face_materials.filter((_, index) => index !== rowIndex),
    }));
  };

  const loadStandardFaceMaterialsTemplate = () => {
    setFormInputState((previousState) => ({
      ...previousState,
      face_materials: [...STANDARD_FACE_MATERIALS],
    }));
  };

  // Assembly Callouts Handlers
  const addAssemblyComponentRow = () => {
    setFormInputState((previousState) => {
      const highestCode = previousState.seal_components.reduce(
        (maxCode, componentItem) => Math.max(maxCode, componentItem.code || 0),
        0,
      );
      return {
        ...previousState,
        seal_components: [...previousState.seal_components, { code: highestCode + 1, name: '' }],
      };
    });
  };

  const updateAssemblyComponentRow = (
    rowIndex: number,
    columnKey: 'code' | 'name',
    cellValue: string | number,
  ) => {
    setFormInputState((previousState) => {
      const updatedRows = [...previousState.seal_components];
      const parsedValue =
        columnKey === 'code' ? Math.max(1, parseInt(String(cellValue), 10) || 1) : String(cellValue);
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], [columnKey]: parsedValue };
      return { ...previousState, seal_components: updatedRows };
    });
  };

  const removeAssemblyComponentRow = (rowIndex: number) => {
    setFormInputState((previousState) => ({
      ...previousState,
      seal_components: previousState.seal_components.filter((_, index) => index !== rowIndex),
    }));
  };

  // Tag Chips Handler
  const updateChipList = (
    fieldKey: 'secondary_seal_materials' | 'metal_parts' | 'applications',
    updatedTags: string[],
  ) => {
    const cleanedTags = Array.from(
      new Set(updatedTags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
    );
    setFormInputState((previousState) => ({
      ...previousState,
      [fieldKey]: cleanedTags,
    }));
    _clearFieldError(fieldKey);
  };

  const _clearFieldError = (fieldName: string) => {
    setFieldErrors((previousErrors) => {
      if (!previousErrors[fieldName]) return previousErrors;
      const nextErrors = { ...previousErrors };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  };

  const _scrollToFirstError = (errors: ApiFieldErrors) => {
    const firstKey = Object.keys(errors)[0];
    if (!firstKey) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElement = document.querySelector(`[name="${firstKey}"], #${firstKey}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (targetElement as HTMLElement).focus?.();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const saveProduct = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    // Client-side validation
    const clientValidationErrors: ApiFieldErrors = {};
    if (!formInputState.name.trim()) {
      clientValidationErrors.name = ['Product Name is required.'];
    }
    if (!formInputState.slug.trim()) {
      clientValidationErrors.slug = ['URL Slug is required.'];
    }

    if (Object.keys(clientValidationErrors).length > 0) {
      setFieldErrors(clientValidationErrors);
      setGeneralErrorMessage('Please fill in all required fields.');
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields before saving.',
        color: 'red',
        icon: React.createElement(IconAlertCircle, { size: 18 }),
        autoClose: 4000,
      });
      _scrollToFirstError(clientValidationErrors);
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    setGeneralErrorMessage(null);
    setGeneralSuccessMessage(null);
    setFieldErrors({});

    // Sanitize state before sending
    const sanitizedState: ProductFormInputState = {
      ...formInputState,
      operating_limits: sanitizeRows(formInputState.operating_limits),
      face_materials: sanitizeRows(formInputState.face_materials),
      seal_components: formInputState.seal_components
        .filter((c) => c.name.trim().length > 0)
        .sort((a, b) => a.code - b.code),
    };

    try {
      // 1. If a local image file was selected, upload it via the dedicated media service first
      let uploadedImagePath: string | undefined = undefined;
      if (formInputState.primary_image_file) {
        try {
          const uploadResult = await uploadAdminProductImage(formInputState.primary_image_file);
          uploadedImagePath = uploadResult.file_path;
          setExistingServerImageUrl(uploadResult.url);
          if (blobCleanupRef.current) {
            URL.revokeObjectURL(blobCleanupRef.current);
            blobCleanupRef.current = null;
          }
          setLocalBlobPreviewUrl(null);
        } catch (uploadError: unknown) {
          const { generalMessage } = extractApiErrors(uploadError);
          setFieldErrors({ primary_image: [generalMessage] });
          setGeneralErrorMessage(`Image upload failed: ${generalMessage}`);
          notifications.show({
            title: 'Image Upload Failed',
            message: generalMessage || 'Could not upload product photograph.',
            color: 'red',
            icon: React.createElement(IconAlertCircle, { size: 18 }),
            autoClose: 5000,
          });
          setSaveStatus('error');
          setIsSaving(false);
          return;
        }
      }

      // 2. Prepare 100% pure JSON payload
      const pureJsonPayload: Record<string, unknown> = {
        name: sanitizedState.name,
        slug: sanitizedState.slug,
        category: sanitizedState.category,
        subtitle: sanitizedState.subtitle,
        description: sanitizedState.description,
        static_image_path: sanitizedState.static_image_path,
        is_active: sanitizedState.is_active,
        order: sanitizedState.order,
        operating_limits: sanitizedState.operating_limits,
        face_materials: sanitizedState.face_materials,
        secondary_seal_materials: sanitizedState.secondary_seal_materials,
        metal_parts: sanitizedState.metal_parts,
        seal_components: sanitizedState.seal_components,
        applications: sanitizedState.applications,
        custom_spec_groups: sanitizedState.custom_spec_groups || [],
      };

      if (uploadedImagePath) {
        pureJsonPayload.primary_image = uploadedImagePath;
      }

      if (isEditing && productIdentifier) {
        const updatedRecord = await updateAdminProductRecord(productIdentifier, pureJsonPayload);
        setGeneralSuccessMessage('Product specifications updated successfully.');
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        notifications.show({
          title: 'Product Updated',
          message: 'Product specifications updated successfully.',
          color: 'teal',
          icon: React.createElement(IconCheck, { size: 18 }),
          autoClose: 4000,
        });

        setFormInputState((prevState) => ({
          ...prevState,
          primary_image_file: null,
        }));

        const updatedSnapshot = JSON.stringify({
          ...sanitizedState,
          primary_image_file: null,
          hasFile: false,
        });
        setInitialSnapshot(updatedSnapshot);

        // If slug changed, seamlessly update the URL
        if (updatedRecord.slug !== productIdentifier) {
          navigate(`/admin/products/${updatedRecord.slug}/edit`, { replace: true });
        }
      } else {
        const createdRecord = await createAdminProductRecord(pureJsonPayload);
        setGeneralSuccessMessage('New mechanical seal created successfully.');
        setSaveStatus('saved');

        notifications.show({
          title: 'Product Published',
          message: 'New mechanical seal created successfully.',
          color: 'teal',
          icon: React.createElement(IconCheck, { size: 18 }),
          autoClose: 4000,
        });

        navigate(`/admin/products/${createdRecord.slug}/edit`, { replace: true });
      }
    } catch (caughtError: unknown) {
      const { fieldErrors: serverFieldErrors, generalMessage } = extractApiErrors(caughtError);
      setFieldErrors(serverFieldErrors);
      setGeneralErrorMessage(generalMessage);
      notifications.show({
        title: 'Save Failed',
        message: generalMessage || 'Please review highlighted fields.',
        color: 'red',
        icon: React.createElement(IconAlertCircle, { size: 18 }),
        autoClose: 5000,
      });
      setSaveStatus('error');
      _scrollToFirstError(serverFieldErrors);
    } finally {
      setIsSaving(false);
    }
  };

  const activeDisplayImageUrl =
    localBlobPreviewUrl ||
    existingServerImageUrl ||
    formInputState.static_image_path ||
    '/hero_image.png';

  return {
    isEditing,
    isLoading,
    isSaving,
    isDirty,
    saveStatus,
    lastSavedTime,
    formInputState,
    generalErrorMessage,
    generalSuccessMessage,
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
  };
}
