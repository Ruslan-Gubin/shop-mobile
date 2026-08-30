import { createStore } from "../services/create-store";
import type { CheckoutInitState } from "./types";

export const checkoutStore = createStore<CheckoutInitState>(
  {
    payment_method: "cash",
    delivery_date: "",
    delivery_time: 0,
    method_receipt: "pickup",
    activePickup: null,
    activeCourier: null,
    courierAddress: [],
    comment: "",
    phone: "",
    recipient_name: "",
    comment_error: "",
    phone_error: "",
    recipient_name_error: "",
  },
  "checkout",
);