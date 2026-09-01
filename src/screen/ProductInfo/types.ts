import type { QuestionModel } from "../../shared/types/question";
import type { ReviewModel } from "../../shared/types/review";

export type StockModel = {
  available: number;
  accounting: boolean;
};

export type PriceItem = {
  price: number;
  minQuantity: number;
};

export type ReviewCollection = {
  reviews: ReviewModel[];
  totalCount: number;
  paginationPage: number;
};

export type QuestionCollection = {
  questions: QuestionModel[];
  totalCount: number;
  paginationPage: number;
};
