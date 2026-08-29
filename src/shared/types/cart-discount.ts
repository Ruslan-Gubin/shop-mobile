export type CartDiscountModel = {
  id: number;
  name: string;
  min_sum: number;
  percent: number;
  apply_to: string;
  is_active: boolean;
  created_user_id: number;
  created_at: string;
  updated_at: string | null;
};
