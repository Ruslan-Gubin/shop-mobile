import type { ProductModel } from "./products";

export type ReviewModel = {
  id: number;
  create_user_id: number;
  dignities: string; // Достоинства
  disadvantages: string; // Недостатки
  rating: number;
  answer: string;
  comment: string;
  created_at: string;
  update_at: string | null;
  product?: ProductModel;
};
