export type OrderStatus =
  | "new"
  | "cancelled_new"
  | "processing"
  | "cancelled_assembly"
  | "ready"
  | "in_delivery"
  | "cancelled_delivery"
  | "completed"
  | "cancelled_customer";

export type OrderModel = {
  id: number;
  create_user_id: number;
  order_number: string;
  comment: string;
  status: OrderStatus;
  rejected_reason: string;
  phone: string;
  phoneCode: string;
  recipient_name: string;
  payment_method: string;
  method_receipt: string;
  date_from: Date | null;
  date_to: Date | null;
  discount: number;
  created_at: Date;
  updated_at: Date | null;
};