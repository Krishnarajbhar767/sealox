export interface SealComponent {
  code: number;
  name: string;
}

export interface KeyValueSpec {
  label: string;
  value: string;
}

export interface CustomSpecGroup {
  groupTitle: string;
  items: KeyValueSpec[];
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  subtitle: string;
  image: string;
  images: string[];
  description: string;

  // Structured category blocks matching catalog specification
  operatingLimits: KeyValueSpec[];
  faceMaterials: KeyValueSpec[];
  secondarySealMaterials: string[];
  metalParts: string[];
  sealComponents: SealComponent[];
  applications: string[];

  // Optional flexible custom category groups for future catalog products
  customSpecGroups?: CustomSpecGroup[];
}

export const catalogProducts: ProductItem[] = [
  {
    id: 'close-stock-type',
    slug: 'close-stock-type-elastomer-unbalanced-seal',
    name: 'CLOSE / STOCK TYPE ELASTOMER UNBALANCED SEAL',
    category: 'Mechanical Seals • Elastomer Bellows',
    subtitle: 'Close Stock Type Elastomer Unbalanced Shaft Seal',
    image: '/products/close-seal-photo.png',
    images: ['/products/close-seal-photo.png', '/products/close-seal-diagram.png'],
    description:
      'Engineered for reliable rotary fluid containment in centrifugal pumps, agitators, and mixers. Designed with a robust elastomeric bellows drive mechanism, single helical spring, and high-integrity sealing faces for chemical, refinery, and industrial water systems.',
    operatingLimits: [
      { label: 'Seal Size', value: '12mm to 50mm' },
      { label: 'Pressure', value: '8 kg/cm²' },
      { label: 'Speed', value: '10 m/s' },
      { label: 'Temp', value: '-10°C to 120°C' },
    ],
    faceMaterials: [
      { label: 'Rotary Face', value: 'Carbon, Silicon, TC' },
      { label: 'Stationary Seats', value: 'Silicon, TC, SS, Ceramic' },
      { label: 'Type', value: 'S-60, S-50' },
    ],
    secondarySealMaterials: ['Viton', 'NBR', 'EPDM', 'Silicon'],
    metalParts: ['SS304', 'SS316'],
    sealComponents: [
      { code: 1, name: 'Elastomer Bellow' },
      { code: 2, name: 'SS Casing' },
      { code: 3, name: 'SS Spring' },
      { code: 4, name: 'Seal Face' },
      { code: 5, name: 'Stationary Seat' },
      { code: 6, name: 'Stationary Packing' },
      { code: 8, name: 'SS Corner Ring' },
    ],
    applications: ['Chemical Plant', 'Oil Refinery', 'Water'],
  },
  {
    id: 'open-type',
    slug: 'open-type-elastomer-unbalanced-seal',
    name: 'OPEN TYPE ELASTOMER UNBALANCED SEAL',
    category: 'Mechanical Seals • Elastomer Bellows',
    subtitle: 'Open Wave Spring Elastomer Unbalanced Shaft Seal',
    image: '/products/open-seal-photo.png',
    images: ['/products/open-seal-photo.png', '/products/open-seal-diagram.png'],
    description:
      'Engineered with an open profile spring arrangement for viscous, slurry-prone, or general industrial media. Features self-aligning elastomeric bellow compensation, multi-material face compatibility, and elastomer gasket protection.',
    operatingLimits: [
      { label: 'Seal Size', value: '12 mm to 50mm' },
      { label: 'Pressure', value: '8 kg/cm²' },
      { label: 'Speed', value: '10 m/s' },
      { label: 'Temp', value: '-10°C to 120°C' },
    ],
    faceMaterials: [
      { label: 'Rotary Face', value: 'Ceramic, Silicon, TC' },
      { label: 'Stationary Seats', value: 'Silicon, TC, SS, Ceramic' },
      { label: 'Type', value: 'S-60, S-50, S-55, S-6' },
    ],
    secondarySealMaterials: ['Viton', 'NBR', 'EPDM', 'Silicon'],
    metalParts: ['SS304', 'SS316'],
    sealComponents: [
      { code: 1, name: 'Elastomer Bellow' },
      { code: 2, name: 'SS Casing' },
      { code: 3, name: 'SS Spring' },
      { code: 4, name: 'Seal Face' },
      { code: 5, name: 'Stationary Seat' },
      { code: 6, name: 'Stationary Packing' },
      { code: 8, name: 'SS Corner Ring' },
      { code: 21, name: 'Elastomer Gasket' },
    ],
    applications: ['Chemical Plant', 'Oil Refinery', 'Water'],
  },
];

export function getProductBySlug(slug?: string): ProductItem {
  if (!slug) return catalogProducts[0];
  const found = catalogProducts.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase(),
  );
  return found ?? catalogProducts[0];
}

export function getAllProducts(): ProductItem[] {
  return catalogProducts;
}
