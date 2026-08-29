export type PromotionModel = {
  id: number;
  name: string;
  description: string | null;
  percent: number;
  date_from: string;
  date_to: string;
  is_active: boolean;
  created_user_id: number;
  created_at: string;
  updated_at: string | null;
};
