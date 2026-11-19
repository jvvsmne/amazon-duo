export type Department =
  | 'All'
  | 'Wireless Chargers'
  | 'Cases & Covers'
  | 'USB Cables & Adapters'
  | 'Power Banks'
  | 'Screen Protectors'
  | 'Car Mounts & Stands';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'review-desc'
  | 'newest';

export type Condition = 'New' | 'Renewed';

export interface ProductVariant {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  asin: string;
  title: string;
  brand: string;
  department: Exclude<Department, 'All'>;
  price: number;
  typicalPrice?: number;
  rating: number;
  reviewCount: number;
  boughtPastMonth?: string;
  isPrime: boolean;
  isTomorrowDelivery: boolean;
  deliveryText: string;
  condition: Condition;
  compatibleDevices: string[];
  badge?: 'Best Seller' | "Amazon's Choice" | 'Limited time deal';
  isSponsored?: boolean;
  image: string;
  variants?: ProductVariant[];
  specs: string[];
  releaseOrder: number;
}

export interface CartItem {
  product: Product;
  selectedVariant?: string;
  quantity: number;
}

export interface FilterState {
  query: string;
  searchDepartment: string;
  department: Department;
  primeOnly: boolean;
  tomorrowOnly: boolean;
  minRating: number | null;
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
  condition: Condition | null;
  compatibleDevice: string | null;
}

export interface DeliveryLocation {
  country: string;
  postalCode: string;
  areaLabel: string;
}
