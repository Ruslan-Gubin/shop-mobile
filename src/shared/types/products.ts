import type { PhotoModel } from "./photo";

export interface ProductModel {
  id: number;
  name: string;
  code: string;
  brand_name: string;
  category_id: number;
  description: string;
  country: string;
  product_type: string;
  equipment: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  purchase_price: number;
  available: number;
  accounting: boolean;
  price_list: { price: number; minQuantity: number }[];
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string | null;
  photos: PhotoModel[];
  keywords: string;
  og_description: string;
  og_title: string;
  og_type: string;
  seo_description: string;
  seo_title: string;
  slug: string;
}
