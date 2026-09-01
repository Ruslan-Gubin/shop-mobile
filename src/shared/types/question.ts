export type QuestionModel = {
  id: number;
  create_user_id: number;
  question: string;
  answer: string;
  created_at: string;
  update_at: string | null;
  product: { id: number };
};
