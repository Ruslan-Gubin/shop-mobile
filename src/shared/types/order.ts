import type { AddressItem } from "../../store/checkout/types";
import type { WarehouseModel } from "./warehouse";

export type OrderStatus =
  | "new"
  | "cancelled_new"
  | "processing"
  | "cancelled_assembly"
  | "ready"
  | "cancelled_ready"
  | "in_delivery"
  | "cancelled_delivery"
  | "completed"
  | "cancelled_customer";

export type OrderReservation = {
  quantity: number;
  stock_id: number;
  warehouse_id: number;
};

export type OrderProductModel = {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  code: string;
  price: number;
  quantity: number;
  description: string;
  country: string;
  equipment: string;
  product_type: string;
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  created_at: string;
  updated_at: string;
  reservations: OrderReservation[];
  transfers: OrderReservation[];
};

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
  address?: AddressItem | null;
  warehouse?: WarehouseModel | null;
};
