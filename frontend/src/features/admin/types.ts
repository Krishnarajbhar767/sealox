export interface OperatingLimitRow {
  label: string;
  value: string;
}

export interface FaceMaterialRow {
  label: string;
  value: string;
}

export interface AssemblyComponentRow {
  code: number;
  name: string;
}

export interface CustomSpecItem {
  label: string;
  value: string;
}

export interface CustomSpecGroup {
  groupTitle: string;
  items: CustomSpecItem[];
}

export interface GalleryImageRecord {
  id: number;
  image?: string;
  static_image_path?: string;
  url: string;
  caption?: string;
  order: number;
}

export interface CatalogProductRecord {
  id: number;
  slug: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  primary_image?: string;
  static_image_path: string;
  primaryImageUrl: string;
  operating_limits: OperatingLimitRow[];
  face_materials: FaceMaterialRow[];
  secondary_seal_materials: string[];
  metal_parts: string[];
  seal_components: AssemblyComponentRow[];
  applications: string[];
  custom_spec_groups: CustomSpecGroup[];
  is_active: boolean;
  order: number;
  galleryImages: GalleryImageRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormInputState {
  name: string;
  slug: string;
  category: string;
  subtitle: string;
  description: string;
  static_image_path: string;
  operating_limits: OperatingLimitRow[];
  face_materials: FaceMaterialRow[];
  secondary_seal_materials: string[];
  metal_parts: string[];
  seal_components: AssemblyComponentRow[];
  applications: string[];
  custom_spec_groups: CustomSpecGroup[];
  is_active: boolean;
  order: number;
  primary_image_file?: File | null;
}

export type ApiFieldErrors = Record<string, string[]>;

export interface DeleteModalState {
  isOpen: boolean;
  targetProduct: CatalogProductRecord | null;
  isDeleting: boolean;
}

export type EditorSaveStatus = 'clean' | 'dirty' | 'saving' | 'saved' | 'error';

export interface ApiErrorDetail {
  detail?: string;
  [fieldName: string]: string[] | string | undefined;
}

