import type { AddressItem } from "../../store/checkout/types";

export type WarehouseModel = {
  id: number;
  create_user_id: number;
  name: string;
  description: string;
  default_warehouse: boolean;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  address: AddressItem | null;
};