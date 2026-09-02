export interface CategoryModel {
  id: number;
  parent_id: number | null;
  position: number;
  moderated: boolean;
  is_active: boolean;
  created_user_id: number | null;
  name: string;
  description: string;
  product_count: number;
  image: string;
  created_at: string;
  updated_at: string | null;
  children: CategoryModel[];
}
