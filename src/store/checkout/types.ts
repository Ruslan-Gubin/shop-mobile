export type AddressItem = {
  id?: number;
  type: "pickup" | "courier";
  name: string;
  place: string;
  lng: number;
  lat: number;
  entrance: string;
  flat: string;
  floor: string;
  intercom: string;
};

export type CheckoutInitState = {
  payment_method: "cash" | "card";
  delivery_date: string;
  delivery_time: number;
  method_receipt: "pickup" | "courier";
  activePickup: { lng: number; lat: number } | null;
  activeCourier: { lng: number; lat: number } | null;
  courierAddress: AddressItem[];
  comment: string;
  phone: string;
  recipient_name: string;
  comment_error: string;
  phone_error: string;
  recipient_name_error: string;
};