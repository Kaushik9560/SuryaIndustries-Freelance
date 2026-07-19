export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  desc: string;
  fullDesc: string;
  image: string;
  gallery: string[];
  priceNote: string;
  features: string[];
  specs: ProductSpec[];
  isAvailable: boolean;
  isVisible: boolean;
  isBestseller?: boolean;
  isClearance?: boolean;
  clearanceNote?: string;
}

export type ProductInput = Omit<ProductItem, "id">;
