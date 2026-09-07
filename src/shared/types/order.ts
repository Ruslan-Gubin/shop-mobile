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
  status: OrderStatus;
  rejected_reason: string;
  phone: string;
  phoneCode: string;
  recipient_name: string;
  date_from: Date | null;
  date_to: Date | null;
  discount: number;
  created_at: Date;
  updated_at: Date | null;
  comment: string;
  create_user_id: number;
  discount_name: string;
  discount_percent: number;
  discount_quantity: number;
  discount_total: number;
  method_receipt: string;
  order_number: string;
  payment_method: string;
  subtotal: number;
  total: number;
};

