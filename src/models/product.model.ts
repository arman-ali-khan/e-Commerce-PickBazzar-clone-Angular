
export interface ProductVariantOption {
  name: string;
  priceModifier?: number;
}

export interface ProductVariant {
  type: string; // e.g., 'Size', 'Color'
  options: ProductVariantOption[];
}

export interface ProductReview {
  user: string;
  rating: number; // 1-5
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string; // Will be used as the primary thumbnail
  images: string[];
  unit: string;
  shortDescription: string;
  longDescription: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
}